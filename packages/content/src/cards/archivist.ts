import type { CardDef } from '@adulting/shared';

/** Archivist: cheap chains, discard is a second hand. */
export const archivistCards: readonly CardDef[] = [
  {
    id: 'arc_note',
    name: 'Margin Note',
    classId: 'archivist',
    type: 'skill',
    rarity: 'common',
    cost: 0,
    needsTarget: false,
    exhaust: false,
    effects: [{ kind: 'draw', amount: 1, target: 'self' }],
    text: 'Draw 1 card.',
  },
  {
    id: 'arc_index',
    name: 'Index',
    classId: 'archivist',
    type: 'skill',
    rarity: 'common',
    cost: 1,
    needsTarget: false,
    exhaust: false,
    effects: [
      { kind: 'draw', amount: 2, target: 'self' },
      { kind: 'status', status: 'clarity', stacks: 1, target: 'self' },
    ],
    text: 'Draw 2 cards. Gain 1 Clarity.',
  },
  {
    id: 'arc_recall',
    name: 'Recall',
    classId: 'archivist',
    type: 'skill',
    rarity: 'uncommon',
    cost: 1,
    needsTarget: false,
    exhaust: false,
    effects: [{ kind: 'recall', amount: 1, target: 'self' }],
    text: 'Return the last discarded card to your hand.',
  },
  {
    id: 'arc_citation',
    name: 'Citation',
    classId: 'archivist',
    type: 'attack',
    rarity: 'rare',
    cost: 1,
    needsTarget: true,
    exhaust: false,
    effects: [
      { kind: 'damage', amount: 7, target: 'chosenFoe' },
      { kind: 'draw', amount: 1, target: 'self' },
    ],
    text: 'Deal 7 damage. Draw 1 card.',
  },
];
