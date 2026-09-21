import { z } from 'zod';
import { taskCompletionSchema, taskSchema } from '../domain/task.js';
import { ledgerEntrySchema } from '../domain/economy.js';

export const syncPushSchema = z.object({
  deviceId: z.string(),
  since: z.string().datetime().optional(),
  tasks: z.array(taskSchema),
  completions: z.array(taskCompletionSchema),
});
export type SyncPush = z.infer<typeof syncPushSchema>;

export const syncPullSchema = z.object({
  serverTime: z.string().datetime(),
  tasks: z.array(taskSchema),
  /** Authoritative. The client replaces its optimistic ledger tail with this. */
  ledger: z.array(ledgerEntrySchema),
  moteBalance: z.number().int(),
  contentVersion: z.string(),
});
export type SyncPull = z.infer<typeof syncPullSchema>;
