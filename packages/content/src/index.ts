import {
  cardDefSchema,
  enemyDefSchema,
  type CardDef,
  type ClassId,
  type EnemyDef,
} from '@adulting/shared';
import { stewardCards } from './cards/steward.js';
import { kindlerCards } from './cards/kindler.js';
import { archivistCards } from './cards/archivist.js';
import { wardenCards } from './cards/warden.js';
import { enemies } from './enemies.js';

export * from './classes.js';
export * from './packs.js';
export * from './lore.js';
export { enemies } from './enemies.js';

/** Bumped whenever card, enemy or pack data changes. Runs are pinned to it. */
export const contentVersion = '0.1.0';

export const cards: readonly CardDef[] = [
  ...stewardCards,
  ...kindlerCards,
  ...archivistCards,
  ...wardenCards,
];

const cardsById = new Map<string, CardDef>(cards.map((card) => [card.id, card]));
const enemiesById = new Map<string, EnemyDef>(enemies.map((enemy) => [enemy.id, enemy]));

export const contentIndex = {
  card(defId: string): CardDef {
    const def = cardsById.get(defId);
    if (def === undefined) throw new Error(`unknown card definition ${defId}`);
    return def;
  },
  enemy(defId: string): EnemyDef {
    const def = enemiesById.get(defId);
    if (def === undefined) throw new Error(`unknown enemy definition ${defId}`);
    return def;
  },
};

export const cardsForClass = (classId: ClassId): readonly CardDef[] =>
  cards.filter((card) => card.classId === classId || card.classId === null);

/** Run at build time and in CI; content is data, so it gets validated like input. */
export const validateContent = (): void => {
  for (const card of cards) cardDefSchema.parse(card);
  for (const enemy of enemies) enemyDefSchema.parse(enemy);
  const ids = new Set<string>();
  for (const card of cards) {
    if (ids.has(card.id)) throw new Error(`duplicate card id ${card.id}`);
    ids.add(card.id);
  }
};
