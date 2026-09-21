import { z } from 'zod';
import { classIds } from './card.js';

export const maxLevel = 30;

export const characterSchema = z.object({
  id: z.string(),
  classId: z.enum(classIds),
  name: z.string().min(1).max(40),
  level: z.number().int().min(1).max(maxLevel),
  xp: z.number().int().min(0),
});
export type Character = z.infer<typeof characterSchema>;

/** Superlinear but shallow: levelling tracks real-world consistency, not grinding. */
export const xpForLevel = (level: number): number => {
  if (level <= 1) return 0;
  return Math.round(80 * (level - 1) ** 1.35);
};

export const levelForXp = (xp: number): number => {
  let level = 1;
  while (level < maxLevel && xp >= xpForLevel(level + 1)) level += 1;
  return level;
};

export interface LevelPerks {
  readonly maxHp: number;
  readonly deckSlots: number;
  readonly relicSlots: number;
  readonly talentPicks: number;
}

export const perksForLevel = (level: number): LevelPerks => ({
  maxHp: 60 + (level - 1) * 3,
  deckSlots: 12 + Math.floor((level - 1) / 2),
  relicSlots: 1 + Math.floor(level / 10),
  talentPicks: Math.floor(level / 5),
});

export const deckRulesSchema = z.object({
  minCards: z.number().int(),
  maxCards: z.number().int(),
  maxCopiesCommon: z.number().int(),
  maxCopiesRare: z.number().int(),
});
export type DeckRules = z.infer<typeof deckRulesSchema>;

export const defaultDeckRules: DeckRules = {
  minCards: 12,
  maxCards: 24,
  maxCopiesCommon: 4,
  maxCopiesRare: 2,
};
