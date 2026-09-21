import type { ClassId, Rarity } from '@adulting/shared';

export interface PackDef {
  readonly id: string;
  readonly name: string;
  readonly costMotes: number;
  readonly cardCount: number;
  readonly classId: ClassId | null;
  /** Rarity weights per slot; the last slot uses guaranteedFloor. */
  readonly weights: ReadonlyArray<readonly [Rarity, number]>;
  readonly guaranteedFloor: Rarity;
  /** A rare is guaranteed within this many packs from the same pool. */
  readonly pityAfter: number;
}

export const packs: readonly PackDef[] = [
  {
    id: 'pack_common',
    name: 'Common Pack',
    costMotes: 60,
    cardCount: 5,
    classId: null,
    weights: [
      ['common', 70],
      ['uncommon', 24],
      ['rare', 5.5],
      ['mythic', 0.5],
    ],
    guaranteedFloor: 'uncommon',
    pityAfter: 20,
  },
  {
    id: 'pack_class',
    name: 'Class Pack',
    costMotes: 120,
    cardCount: 5,
    classId: null,
    weights: [
      ['common', 58],
      ['uncommon', 30],
      ['rare', 10],
      ['mythic', 2],
    ],
    guaranteedFloor: 'rare',
    pityAfter: 10,
  },
];
