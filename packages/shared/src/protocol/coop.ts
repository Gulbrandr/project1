import { z } from 'zod';

/**
 * Wire protocol for coop battles. Clients send intents, the server runs
 * @adulting/engine and broadcasts the resulting events. Clients never apply a
 * local intent as truth; they render it optimistically and reconcile on events.
 */

export const clientIntentSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('playCard'),
    cardInstanceId: z.string(),
    targetId: z.string().optional(),
  }),
  z.object({ kind: z.literal('endTurn') }),
  z.object({ kind: z.literal('concede') }),
  z.object({ kind: z.literal('ping'), targetId: z.string(), note: z.string().max(80).optional() }),
]);
export type ClientIntent = z.infer<typeof clientIntentSchema>;

export const clientMessageSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('join'), runId: z.string(), characterId: z.string() }),
  z.object({ type: z.literal('leave') }),
  z.object({
    type: z.literal('intent'),
    /** Monotonic per client; the server echoes it so the client can drop stale optimism. */
    seq: z.number().int().nonnegative(),
    intent: clientIntentSchema,
  }),
  z.object({ type: z.literal('resync') }),
]);
export type ClientMessage = z.infer<typeof clientMessageSchema>;

export interface ServerMessage {
  readonly type: 'snapshot' | 'events' | 'rejected' | 'lobby' | 'error';
  readonly battleId: string;
  /** Server event cursor. Clients request a resync when they see a gap. */
  readonly cursor: number;
  readonly payload: unknown;
}

export const lobbySchema = z.object({
  runId: z.string(),
  hostUserId: z.string(),
  members: z.array(
    z.object({
      userId: z.string(),
      characterId: z.string(),
      displayName: z.string(),
      ready: z.boolean(),
      connected: z.boolean(),
    }),
  ),
  /** A disconnected member is driven by autopilot so the party is never stuck. */
  autopilotUserIds: z.array(z.string()),
});
export type Lobby = z.infer<typeof lobbySchema>;
