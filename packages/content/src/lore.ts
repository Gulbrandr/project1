export interface LoreChapter {
  readonly id: string;
  readonly title: string;
  readonly domain: string;
  /** Cumulative real completions in this domain required to unlock. */
  readonly unlockAtCompletions: number;
  readonly body: string;
}

export const loreChapters: readonly LoreChapter[] = [
  {
    id: 'lore.ch1',
    title: 'The Tract You Hold',
    domain: 'home',
    unlockAtCompletions: 0,
    body:
      'Every Keeper is given a Tract: a square of the world small enough to hold. ' +
      'The Hollow does not attack it. The Hollow waits for it to be left alone.',
  },
  {
    id: 'lore.ch2',
    title: 'What Burns Clean',
    domain: 'body',
    unlockAtCompletions: 25,
    body:
      'Kindlers are not brave. They have simply learned that a thing done badly today ' +
      'outlasts a thing planned perfectly for a week from now.',
  },
  {
    id: 'lore.ch3',
    title: 'Two Lamps',
    domain: 'people',
    unlockAtCompletions: 40,
    body:
      'A Warden carries no wall and no fire. A Warden carries the second lamp, ' +
      'so that the one who is walking ahead does not have to look back.',
  },
];
