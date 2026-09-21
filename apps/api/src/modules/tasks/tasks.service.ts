import { Injectable } from '@nestjs/common';
import type { SyncPull, SyncPush, TaskDifficulty } from '@adulting/shared';
import { contentVersion } from '@adulting/content';
import { PrismaService } from '../../prisma.service';
import { EconomyService } from '../economy/economy.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly economy: EconomyService,
  ) {}

  /**
   * Idempotent: a completion is keyed by (taskId, clientId), so a client may
   * replay its outbox safely after a dropped connection.
   */
  async sync(userId: string, push: SyncPush): Promise<SyncPull> {
    for (const completion of push.completions) {
      const existing = await this.prisma.taskCompletion.findUnique({
        where: { taskId_clientId: { taskId: completion.taskId, clientId: completion.clientId } },
      });
      if (existing !== null) continue;

      const created = await this.prisma.taskCompletion.create({
        data: {
          taskId: completion.taskId,
          userId,
          clientId: completion.clientId,
          completedAt: new Date(completion.completedAt),
          difficultyAtCompletion: completion.difficultyAtCompletion,
        },
      });

      await this.creditStreak(userId, completion.taskId, new Date(completion.completedAt));
      await this.economy.creditCompletion({
        userId,
        taskId: completion.taskId,
        completionId: created.id,
        difficulty: completion.difficultyAtCompletion as TaskDifficulty,
        completedAt: new Date(completion.completedAt),
      });
    }

    const [ledger, balance] = await Promise.all([
      this.prisma.moteLedger.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
      this.economy.moteBalance(userId),
    ]);

    return {
      serverTime: new Date().toISOString(),
      tasks: [],
      ledger: ledger.map((entry) => ({
        id: entry.id,
        delta: entry.delta,
        reason: entry.reason as SyncPull['ledger'][number]['reason'],
        ...(entry.refType === null ? {} : { refType: entry.refType }),
        ...(entry.refId === null ? {} : { refId: entry.refId }),
        createdAt: entry.createdAt.toISOString(),
      })),
      moteBalance: balance,
      contentVersion,
    };
  }

  private async creditStreak(userId: string, taskId: string, completedAt: Date): Promise<void> {
    const day = new Date(completedAt);
    day.setUTCHours(0, 0, 0, 0);
    const streak = await this.prisma.habitStreak.findUnique({ where: { taskId } });

    if (streak === null) {
      await this.prisma.habitStreak.create({
        data: { userId, taskId, current: 1, longest: 1, lastCreditedOn: day },
      });
      return;
    }
    if (streak.lastCreditedOn !== null && streak.lastCreditedOn.getTime() === day.getTime()) return;

    const yesterday = new Date(day);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const continued = streak.lastCreditedOn !== null && streak.lastCreditedOn.getTime() === yesterday.getTime();
    const current = continued ? streak.current + 1 : 1;

    await this.prisma.habitStreak.update({
      where: { taskId },
      data: { current, longest: Math.max(streak.longest, current), lastCreditedOn: day },
    });
  }
}
