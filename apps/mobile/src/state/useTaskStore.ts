import { create } from 'zustand';
import {
  computeGrant,
  type Task,
  type TaskCompletion,
  type TaskDifficulty,
  type TaskDomain,
} from '@adulting/shared';

export interface PendingCompletion extends TaskCompletion {
  motesAwarded: number;
  xpAwarded: number;
  synced: boolean;
}

interface TaskStore {
  tasks: Task[];
  completionsToday: PendingCompletion[];
  streakDays: number;
  /** Optimistic. The server ledger replaces this on the next successful sync. */
  moteBalance: number;
  addTask(input: {
    title: string;
    domain: TaskDomain;
    difficulty: TaskDifficulty;
  }): void;
  complete(taskId: string, now?: Date): PendingCompletion | undefined;
  markSynced(clientIds: readonly string[], serverBalance: number): void;
}

const newId = (): string => globalThis.crypto.randomUUID();

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  completionsToday: [],
  streakDays: 0,
  moteBalance: 0,

  addTask: (input) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          id: newId(),
          listId: 'default',
          title: input.title,
          domain: input.domain,
          difficulty: input.difficulty,
          recurrence: { kind: 'none' },
          updatedAt: new Date().toISOString(),
        },
      ],
    })),

  complete: (taskId, now = new Date()) => {
    const state = get();
    const task = state.tasks.find((candidate) => candidate.id === taskId);
    if (task === undefined) return undefined;

    const grant = computeGrant({
      difficulty: task.difficulty,
      consecutiveDays: state.streakDays,
      completionIndexToday: state.completionsToday.length,
    });

    const completion: PendingCompletion = {
      clientId: newId(),
      taskId,
      completedAt: now.toISOString(),
      difficultyAtCompletion: task.difficulty,
      motesAwarded: grant.motes,
      xpAwarded: grant.xp,
      synced: false,
    };

    set({
      completionsToday: [...state.completionsToday, completion],
      moteBalance: state.moteBalance + grant.motes,
    });
    return completion;
  },

  markSynced: (clientIds, serverBalance) =>
    set((state) => ({
      completionsToday: state.completionsToday.map((completion) =>
        clientIds.includes(completion.clientId) ? { ...completion, synced: true } : completion,
      ),
      moteBalance: serverBalance,
    })),
}));
