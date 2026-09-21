import type { ClassId } from '@adulting/shared';

export interface ClassDef {
  readonly id: ClassId;
  readonly name: string;
  readonly blurb: string;
  readonly baseMaxHp: number;
  readonly startingDeck: readonly string[];
  /** Task domains whose completions the app reads as affinity for this class. */
  readonly affinity: readonly string[];
}

export const classes: readonly ClassDef[] = [
  {
    id: 'steward',
    name: 'Steward',
    blurb: 'Holds the line. Turns the wall into the weapon.',
    baseMaxHp: 70,
    startingDeck: [
      'stw_tidy', 'stw_tidy', 'stw_tidy', 'stw_tidy',
      'stw_brace', 'stw_brace', 'stw_brace', 'stw_brace',
      'stw_sweep', 'stw_threshold', 'stw_threshold', 'stw_bulwark_break',
    ],
    affinity: ['kitchen', 'home'],
  },
  {
    id: 'kindler',
    name: 'Kindler',
    blurb: 'Spends itself for tempo. Nothing smoulders for long.',
    baseMaxHp: 56,
    startingDeck: [
      'knd_spark', 'knd_spark', 'knd_spark', 'knd_spark',
      'knd_kindle', 'knd_kindle', 'knd_kindle',
      'knd_stoke', 'knd_stoke', 'knd_flashover', 'knd_spark', 'knd_kindle',
    ],
    affinity: ['body', 'work'],
  },
  {
    id: 'archivist',
    name: 'Archivist',
    blurb: 'Chains cheap cards. The discard pile is a second hand.',
    baseMaxHp: 60,
    startingDeck: [
      'arc_note', 'arc_note', 'arc_note', 'arc_note',
      'arc_index', 'arc_index', 'arc_index',
      'arc_recall', 'arc_recall', 'arc_citation', 'arc_note', 'arc_index',
    ],
    affinity: ['admin', 'money'],
  },
  {
    id: 'warden',
    name: 'Warden',
    blurb: 'Keeps the party standing. Made for coop.',
    baseMaxHp: 64,
    startingDeck: [
      'wrd_mend', 'wrd_mend', 'wrd_mend',
      'wrd_ward', 'wrd_ward', 'wrd_ward', 'wrd_ward',
      'wrd_secondwind', 'wrd_secondwind', 'wrd_vigil', 'wrd_mend', 'wrd_ward',
    ],
    affinity: ['people'],
  },
];
