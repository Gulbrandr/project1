import { Injectable } from '@nestjs/common';
import { applyIntent, createBattle, type BattleIntent, type BattleState, type BattleSetup } from '@adulting/engine';
import { contentIndex } from '@adulting/content';

interface HostedBattle {
  state: BattleState;
  /** Append-only. Clients resync from a cursor rather than refetching state. */
  events: unknown[];
  members: Map<string, string>;
}

/**
 * Authoritative host for coop battles. The same engine runs on the client for
 * prediction; only this copy decides what happened.
 */
@Injectable()
export class BattleService {
  private readonly battles = new Map<string, HostedBattle>();

  create(setup: BattleSetup, members: ReadonlyMap<string, string>): BattleState {
    const { state, events } = createBattle(setup, contentIndex);
    this.battles.set(setup.id, { state, events: [...events], members: new Map(members) });
    return state;
  }

  snapshot(battleId: string): BattleState | undefined {
    return this.battles.get(battleId)?.state;
  }

  eventsSince(battleId: string, cursor: number): readonly unknown[] {
    const battle = this.battles.get(battleId);
    if (battle === undefined) return [];
    return battle.events.slice(cursor);
  }

  /** Rejects an intent for a combatant the sender does not own. */
  submit(battleId: string, userId: string, intent: BattleIntent): readonly unknown[] {
    const battle = this.battles.get(battleId);
    if (battle === undefined) throw new Error(`unknown battle ${battleId}`);
    const combatantId = battle.members.get(userId);
    if (combatantId === undefined) throw new Error(`${userId} is not in battle ${battleId}`);

    const result = applyIntent(battle.state, combatantId, intent, contentIndex);
    battle.state = result.state;
    battle.events.push(...result.events);
    return result.events;
  }

  dispose(battleId: string): void {
    this.battles.delete(battleId);
  }
}
