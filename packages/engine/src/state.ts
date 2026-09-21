import type { StatusId } from '@adulting/shared';
import type { BattleState, Combatant, Zones } from './types.js';
import { EngineError } from './types.js';

/** Statuses that tick down by one at the end of the owner's turn. */
export const decayingStatuses: ReadonlySet<StatusId> = new Set<StatusId>(['weak', 'vulnerable', 'clarity']);

export const cloneZones = (zones: Zones): Zones => ({
  draw: zones.draw.map((c) => ({ ...c })),
  hand: zones.hand.map((c) => ({ ...c })),
  discard: zones.discard.map((c) => ({ ...c })),
  exhaust: zones.exhaust.map((c) => ({ ...c })),
});

export const cloneState = (state: BattleState): BattleState => ({
  id: state.id,
  rng: { ...state.rng },
  turn: state.turn,
  phase: state.phase,
  cursor: state.cursor,
  order: [...state.order],
  combatants: Object.fromEntries(
    Object.entries(state.combatants).map(([id, c]) => [id, { ...c, statuses: { ...c.statuses } }]),
  ),
  zones: Object.fromEntries(Object.entries(state.zones).map(([id, z]) => [id, cloneZones(z)])),
});

export const getCombatant = (state: BattleState, id: string): Combatant => {
  const combatant = state.combatants[id];
  if (combatant === undefined) throw new EngineError(`unknown combatant ${id}`, 'unknownCombatant');
  return combatant;
};

export const getZones = (state: BattleState, id: string): Zones => {
  const zones = state.zones[id];
  if (zones === undefined) throw new EngineError(`no zones for combatant ${id}`, 'unknownCombatant');
  return zones;
};

export const livingOf = (state: BattleState, side: Combatant['side']): Combatant[] =>
  state.order
    .map((id) => getCombatant(state, id))
    .filter((c) => c.side === side && c.hp > 0);

export const statusOf = (combatant: Combatant, status: StatusId): number => combatant.statuses[status] ?? 0;

export const setStatus = (combatant: Combatant, status: StatusId, stacks: number): void => {
  if (stacks <= 0) {
    delete combatant.statuses[status];
    return;
  }
  combatant.statuses[status] = stacks;
};
