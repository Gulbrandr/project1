import { z } from 'zod';

export const taskDifficulties = ['trivial', 'small', 'medium', 'large', 'project'] as const;
export type TaskDifficulty = (typeof taskDifficulties)[number];

/** Lore zones. A task's domain decides which Tract its energy feeds. */
export const taskDomains = ['kitchen', 'home', 'admin', 'body', 'people', 'money', 'work'] as const;
export type TaskDomain = (typeof taskDomains)[number];

export const recurrenceSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('none') }),
  z.object({ kind: z.literal('daily') }),
  z.object({ kind: z.literal('weekly'), weekdays: z.array(z.number().int().min(0).max(6)).min(1) }),
  z.object({ kind: z.literal('interval'), days: z.number().int().min(1).max(365) }),
  z.object({ kind: z.literal('monthlyDay'), day: z.number().int().min(1).max(31) }),
]);
export type Recurrence = z.infer<typeof recurrenceSchema>;

export const taskSchema = z.object({
  id: z.string(),
  listId: z.string(),
  title: z.string().min(1).max(200),
  notes: z.string().max(4000).optional(),
  domain: z.enum(taskDomains),
  difficulty: z.enum(taskDifficulties),
  recurrence: recurrenceSchema,
  dueAt: z.string().datetime().optional(),
  archivedAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime(),
});
export type Task = z.infer<typeof taskSchema>;

export const taskCompletionSchema = z.object({
  /** Client-generated, idempotency key for sync. */
  clientId: z.string().uuid(),
  taskId: z.string(),
  completedAt: z.string().datetime(),
  difficultyAtCompletion: z.enum(taskDifficulties),
});
export type TaskCompletion = z.infer<typeof taskCompletionSchema>;
