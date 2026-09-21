import { z } from 'zod';
import type { TaskDifficulty } from './task.js';

export const moteBaseByDifficulty: Readonly<Record<TaskDifficulty, number>> = {
  trivial: 5,
  small: 10,
  medium: 25,
  large: 60,
  project: 150,
};

export const xpBaseByDifficulty: Readonly<Record<TaskDifficulty, number>> = {
  trivial: 2,
  small: 5,
  medium: 12,
  large: 30,
  project: 80,
};

export const streakStep = 0.05;
export const streakMax = 1.5;

export const streakMultiplier = (consecutiveDays: number): number =>
  Math.min(streakMax, 1 + Math.max(0, consecutiveDays) * streakStep);

/** Softens task spam without punishing a genuinely heavy day. */
export const dailyDecay = (completionIndexToday: number): number => {
  if (completionIndexToday < 8) return 1;
  if (completionIndexToday < 15) return 0.5;
  return 0.25;
};

export interface GrantInput {
  readonly difficulty: TaskDifficulty;
  readonly consecutiveDays: number;
  readonly completionIndexToday: number;
}

export interface Grant {
  readonly motes: number;
  readonly xp: number;
}

export const computeGrant = (input: GrantInput): Grant => {
  const multiplier = streakMultiplier(input.consecutiveDays) * dailyDecay(input.completionIndexToday);
  return {
    motes: Math.round(moteBaseByDifficulty[input.difficulty] * multiplier),
    xp: Math.round(xpBaseByDifficulty[input.difficulty] * multiplier),
  };
};

export const ledgerReasons = [
  'task',
  'streakBonus',
  'reflection',
  'packPurchase',
  'cosmeticPurchase',
  'refund',
  'adminAdjustment',
] as const;
export type LedgerReason = (typeof ledgerReasons)[number];

export const ledgerEntrySchema = z.object({
  id: z.string(),
  delta: z.number().int(),
  reason: z.enum(ledgerReasons),
  refType: z.string().optional(),
  refId: z.string().optional(),
  createdAt: z.string().datetime(),
});
export type LedgerEntry = z.infer<typeof ledgerEntrySchema>;
