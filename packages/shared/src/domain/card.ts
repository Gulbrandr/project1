import { z } from 'zod';

export const classIds = ['steward', 'kindler', 'archivist', 'warden'] as const;
export type ClassId = (typeof classIds)[number];

export const rarities = ['common', 'uncommon', 'rare', 'mythic'] as const;
export type Rarity = (typeof rarities)[number];

export const cardTypes = ['attack', 'skill', 'power', 'curse'] as const;
export type CardType = (typeof cardTypes)[number];

export const statusIds = [
  'strength',
  'focus',
  'weak',
  'vulnerable',
  'regen',
  'burn',
  'clarity',
  'fatigue',
  'bulwark',
] as const;
export type StatusId = (typeof statusIds)[number];

/** Who an effect resolves against once the card is played. */
export const targetSchema = z.enum(['self', 'chosenFoe', 'allFoes', 'chosenAlly', 'allAllies', 'party']);
export type TargetKind = z.infer<typeof targetSchema>;

export const effectSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('damage'), amount: z.number().int().positive(), target: targetSchema }),
  z.object({ kind: z.literal('block'), amount: z.number().int().positive(), target: targetSchema }),
  z.object({ kind: z.literal('heal'), amount: z.number().int().positive(), target: targetSchema }),
  z.object({ kind: z.literal('loseHp'), amount: z.number().int().positive(), target: targetSchema }),
  z.object({
    kind: z.literal('status'),
    status: z.enum(statusIds),
    stacks: z.number().int(),
    target: targetSchema,
  }),
  z.object({ kind: z.literal('draw'), amount: z.number().int().positive(), target: targetSchema }),
  z.object({ kind: z.literal('energy'), amount: z.number().int(), target: targetSchema }),
  /** Steward: spend accumulated Block as damage. */
  z.object({ kind: z.literal('blockAsDamage'), ratio: z.number().positive(), target: targetSchema }),
  /** Archivist: pull a card back from discard to hand. */
  z.object({ kind: z.literal('recall'), amount: z.number().int().positive(), target: z.literal('self') }),
]);
export type CardEffect = z.infer<typeof effectSchema>;

export const cardDefSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  classId: z.enum(classIds).nullable(),
  type: z.enum(cardTypes),
  rarity: z.enum(rarities),
  cost: z.number().int().min(0).max(5),
  /** Requires an explicit target pick from the player before resolution. */
  needsTarget: z.boolean(),
  exhaust: z.boolean(),
  effects: z.array(effectSchema).min(1),
  text: z.string(),
  loreRef: z.string().optional(),
});
export type CardDef = z.infer<typeof cardDefSchema>;

export const enemyIntentSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('attack'), amount: z.number().int().positive(), hits: z.number().int().min(1) }),
  z.object({ kind: z.literal('defend'), amount: z.number().int().positive() }),
  z.object({ kind: z.literal('buff'), status: z.enum(statusIds), stacks: z.number().int() }),
  z.object({ kind: z.literal('debuff'), status: z.enum(statusIds), stacks: z.number().int() }),
]);
export type EnemyIntent = z.infer<typeof enemyIntentSchema>;

export const enemyDefSchema = z.object({
  id: z.string(),
  name: z.string(),
  maxHp: z.number().int().positive(),
  tier: z.enum(['minion', 'standard', 'elite', 'boss']),
  /** Cycled in order; the engine picks by turn index so behaviour stays deterministic. */
  pattern: z.array(enemyIntentSchema).min(1),
  loreRef: z.string().optional(),
});
export type EnemyDef = z.infer<typeof enemyDefSchema>;
