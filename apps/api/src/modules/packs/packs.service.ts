import { Injectable } from '@nestjs/common';
import { createRng, weightedPick } from '@adulting/engine';
import { cardsForClass, packs } from '@adulting/content';
import type { CardDef, ClassId, Rarity } from '@adulting/shared';
import { PrismaService } from '../../prisma.service';
import { EconomyService } from '../economy/economy.service';

export interface PullResult {
  purchaseId: string;
  cards: ReadonlyArray<{ cardDefId: string; rarity: Rarity }>;
}

@Injectable()
export class PacksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly economy: EconomyService,
  ) {}

  /**
   * Pulls are a pure function of (seed, contentVersion, packDef), so any pull
   * can be reproduced later for support without storing the card list twice.
   */
  async open(userId: string, packDefId: string, classId: ClassId): Promise<PullResult | null> {
    const pack = packs.find((p) => p.id === packDefId);
    if (pack === undefined) return null;

    const seed = Math.floor(Math.random() * 2 ** 31);
    const purchase = await this.prisma.packPurchase.create({
      data: { userId, packDefId, motesSpent: pack.costMotes, seed },
    });

    const paid = await this.economy.spend(userId, pack.costMotes, 'packPurchase', purchase.id);
    if (!paid) {
      await this.prisma.packPurchase.delete({ where: { id: purchase.id } });
      return null;
    }

    const rng = createRng(seed);
    const pool = cardsForClass(classId);
    const pulls: Array<{ cardDefId: string; rarity: Rarity }> = [];

    for (let slot = 0; slot < pack.cardCount; slot += 1) {
      const isGuaranteedSlot = slot === pack.cardCount - 1;
      const rarity = isGuaranteedSlot ? pack.guaranteedFloor : weightedPick(rng, pack.weights);
      const candidates = pool.filter((card) => card.rarity === rarity);
      const chosen = pickFrom(candidates, pool, rng);
      pulls.push({ cardDefId: chosen.id, rarity: chosen.rarity });
    }

    await this.prisma.$transaction([
      this.prisma.packPull.createMany({
        data: pulls.map((pull) => ({ purchaseId: purchase.id, ...pull })),
      }),
      ...pulls.map((pull) =>
        this.prisma.cardOwnership.upsert({
          where: { userId_cardDefId_foil: { userId, cardDefId: pull.cardDefId, foil: false } },
          create: { userId, cardDefId: pull.cardDefId, count: 1, foil: false },
          update: { count: { increment: 1 } },
        }),
      ),
    ]);

    return { purchaseId: purchase.id, cards: pulls };
  }
}

const pickFrom = (
  candidates: readonly CardDef[],
  fallback: readonly CardDef[],
  rng: ReturnType<typeof createRng>,
): CardDef => {
  const source = candidates.length > 0 ? candidates : fallback;
  const picked = weightedPick(
    rng,
    source.map((card) => [card, 1] as const),
  );
  return picked;
};
