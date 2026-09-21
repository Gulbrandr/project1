import type { CardDef, EnemyDef } from '@adulting/shared';
import type { ContentIndex } from '../src/types.js';

const cards: readonly CardDef[] = [
  {
    id: 't_strike',
    name: 'Strike',
    classId: null,
    type: 'attack',
    rarity: 'common',
    cost: 1,
    needsTarget: true,
    exhaust: false,
    effects: [{ kind: 'damage', amount: 6, target: 'chosenFoe' }],
    text: 'Deal 6 damage.',
  },
  {
    id: 't_guard',
    name: 'Guard',
    classId: null,
    type: 'skill',
    rarity: 'common',
    cost: 1,
    needsTarget: false,
    exhaust: false,
    effects: [{ kind: 'block', amount: 5, target: 'self' }],
    text: 'Gain 5 Block.',
  },
];

const enemies: readonly EnemyDef[] = [
  {
    id: 't_dummy',
    name: 'Dummy',
    maxHp: 20,
    tier: 'standard',
    pattern: [{ kind: 'attack', amount: 5, hits: 1 }],
  },
];

export const testContent: ContentIndex = {
  card(defId) {
    const def = cards.find((c) => c.id === defId);
    if (def === undefined) throw new Error(`unknown card ${defId}`);
    return def;
  },
  enemy(defId) {
    const def = enemies.find((e) => e.id === defId);
    if (def === undefined) throw new Error(`unknown enemy ${defId}`);
    return def;
  },
};

export const soloSetup = {
  id: 'battle_test',
  seed: 12345,
  party: [
    {
      id: 'hero',
      name: 'Hero',
      maxHp: 40,
      deck: ['t_strike', 't_strike', 't_strike', 't_guard', 't_guard', 't_strike', 't_guard', 't_strike'],
    },
  ],
  foes: [{ id: 'foe1', defId: 't_dummy' }],
} as const;
