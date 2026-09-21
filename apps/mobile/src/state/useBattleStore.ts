import { create } from 'zustand';
import { applyIntent, createBattle, type BattleEvent, type BattleIntent, type BattleState } from '@adulting/engine';
import { contentIndex } from '@adulting/content';
import type { BattleSetup } from '@adulting/engine';

interface BattleStore {
  state: BattleState | undefined;
  log: BattleEvent[];
  lastError: string | undefined;
  start(setup: BattleSetup): void;
  send(actorId: string, intent: BattleIntent): void;
  /** Coop: the server is the only source of truth, so this replaces local state. */
  adoptSnapshot(state: BattleState): void;
}

export const useBattleStore = create<BattleStore>((set, get) => ({
  state: undefined,
  log: [],
  lastError: undefined,

  start: (setup) => {
    const { state, events } = createBattle(setup, contentIndex);
    set({ state, log: events, lastError: undefined });
  },

  send: (actorId, intent) => {
    const current = get().state;
    if (current === undefined) return;
    try {
      const result = applyIntent(current, actorId, intent, contentIndex);
      set((store) => ({ state: result.state, log: [...store.log, ...result.events], lastError: undefined }));
    } catch (error) {
      set({ lastError: error instanceof Error ? error.message : 'illegal move' });
    }
  },

  adoptSnapshot: (state) => set({ state, lastError: undefined }),
}));
