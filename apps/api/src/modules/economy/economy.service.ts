import { Injectable } from '@nestjs/common';
import { computeGrant, type LedgerReason, type TaskDifficulty } from '@adulting/shared';
import { PrismaService } from '../../prisma.service';

/** Hard ceiling so a runaway client cannot inflate the economy. */
export const dailyMoteCap = 600;

export interface CreditCompletionInput {
  userId: string;
  taskId: string;
  completionId: string;
  difficulty: TaskDifficulty;
  completedAt: Date;
}

@Injectable()
export class EconomyService {
  constructor(private readonly prisma: PrismaService) {}

  async moteBalance(userId: string): Promise<number> {
    const result = await this.prisma.moteLedger.aggregate({
      where: { userId },
      _sum: { delta: true },
    });
    return result._sum.delta ?? 0;
  }

  /**
   * Recomputes the grant server-side from the completion itself. The client's
   * claimed reward is never trusted, only its completion record.
   */
  async creditCompletion(input: CreditCompletionInput): Promise<{ motes: number; xp: number }> {
    const dayStart = new Date(input.completedAt);
    dayStart.setUTCHours(0, 0, 0, 0);

    const [completionIndexToday, earnedToday, streak] = await Promise.all([
      this.prisma.taskCompletion.count({
        where: { userId: input.userId, completedAt: { gte: dayStart, lte: input.completedAt } },
      }),
      this.prisma.moteLedger.aggregate({
        where: { userId: input.userId, reason: 'task', createdAt: { gte: dayStart } },
        _sum: { delta: true },
      }),
      this.prisma.habitStreak.findUnique({ where: { taskId: input.taskId } }),
    ]);

    const grant = computeGrant({
      difficulty: input.difficulty,
      consecutiveDays: streak?.current ?? 0,
      completionIndexToday,
    });

    const alreadyEarned = earnedToday._sum.delta ?? 0;
    const motes = Math.max(0, Math.min(grant.motes, dailyMoteCap - alreadyEarned));

    await this.prisma.moteLedger.create({
      data: {
        userId: input.userId,
        delta: motes,
        reason: 'task' satisfies LedgerReason,
        refType: 'taskCompletion',
        refId: input.completionId,
      },
    });

    return { motes, xp: grant.xp };
  }

  async spend(userId: string, amount: number, reason: LedgerReason, refId: string): Promise<boolean> {
    const balance = await this.moteBalance(userId);
    if (balance < amount) return false;
    await this.prisma.moteLedger.create({
      data: { userId, delta: -amount, reason, refType: 'purchase', refId },
    });
    return true;
  }
}
