import {
  type OnGatewayConnection,
  type OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { clientMessageSchema, type ClientIntent, type ServerMessage } from '@adulting/shared';
import type { BattleIntent } from '@adulting/engine';
import { BattleService } from './battle.service';

interface Socket {
  send(data: string): void;
}

interface Session {
  runId: string;
  userId: string;
}

@WebSocketGateway({ path: '/coop' })
export class BattleGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly rooms = new Map<string, Set<Socket>>();
  private readonly sessions = new Map<Socket, Session>();

  constructor(private readonly battles: BattleService) {}

  handleConnection(): void {
    // Auth handshake lands in M5 with the lobby.
  }

  handleDisconnect(client: Socket): void {
    const session = this.sessions.get(client);
    this.sessions.delete(client);
    if (session === undefined) return;
    this.rooms.get(session.runId)?.delete(client);
    // M5: hand the dropped member to autopilot instead of stalling the party.
  }

  @SubscribeMessage('message')
  onMessage(client: Socket, raw: unknown): void {
    const message = clientMessageSchema.parse(raw);

    if (message.type === 'join') {
      // userId comes from the authenticated socket once device auth lands (M3).
      const userId = message.characterId;
      this.sessions.set(client, { runId: message.runId, userId });
      const sockets = this.rooms.get(message.runId) ?? new Set<Socket>();
      sockets.add(client);
      this.rooms.set(message.runId, sockets);
      this.sendSnapshot(client, message.runId);
      return;
    }

    const session = this.sessions.get(client);
    if (session === undefined) {
      this.sendTo(client, { type: 'error', battleId: '', cursor: 0, payload: 'join first' });
      return;
    }

    switch (message.type) {
      case 'intent': {
        if (message.intent.kind === 'ping') {
          this.broadcast(session.runId, {
            type: 'events',
            battleId: session.runId,
            cursor: message.seq,
            payload: [message.intent],
          });
          return;
        }
        try {
          const events = this.battles.submit(session.runId, session.userId, toBattleIntent(message.intent));
          const state = this.battles.snapshot(session.runId);
          this.broadcast(session.runId, {
            type: 'events',
            battleId: session.runId,
            cursor: state?.cursor ?? 0,
            payload: events,
          });
        } catch (error) {
          this.sendTo(client, {
            type: 'rejected',
            battleId: session.runId,
            cursor: message.seq,
            payload: error instanceof Error ? error.message : 'rejected',
          });
        }
        return;
      }
      case 'resync':
        this.sendSnapshot(client, session.runId);
        return;
      case 'leave':
        this.handleDisconnect(client);
        return;
      default: {
        const exhaustive: never = message;
        throw new Error(`unhandled message ${JSON.stringify(exhaustive)}`);
      }
    }
  }

  private sendSnapshot(client: Socket, runId: string): void {
    const state = this.battles.snapshot(runId);
    this.sendTo(client, {
      type: 'snapshot',
      battleId: runId,
      cursor: state?.cursor ?? 0,
      payload: state,
    });
  }

  private sendTo(client: Socket, message: ServerMessage): void {
    client.send(JSON.stringify(message));
  }

  private broadcast(roomId: string, message: ServerMessage): void {
    for (const socket of this.rooms.get(roomId) ?? []) this.sendTo(socket, message);
  }
}

/** Ping is chat, not a game action; everything else maps onto an engine intent. */
const toBattleIntent = (intent: Exclude<ClientIntent, { kind: 'ping' }>): BattleIntent => {
  if (intent.kind !== 'playCard') return { kind: intent.kind };
  return {
    kind: 'playCard',
    cardInstanceId: intent.cardInstanceId,
    ...(intent.targetId === undefined ? {} : { targetId: intent.targetId }),
  };
};
