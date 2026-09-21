import { describe, expect, it } from 'vitest';
import { cards, classes, contentIndex, enemies, packs, validateContent } from '../src/index.js';
import { defaultDeckRules } from '@adulting/shared';

describe('content', () => {
  it('validates against the shared schemas', () => {
    expect(() => validateContent()).not.toThrow();
  });

  it('gives every class a legal starting deck', () => {
    for (const klass of classes) {
      expect(klass.startingDeck.length).toBeGreaterThanOrEqual(defaultDeckRules.minCards);
      expect(klass.startingDeck.length).toBeLessThanOrEqual(defaultDeckRules.maxCards);
      for (const defId of klass.startingDeck) {
        const card = contentIndex.card(defId);
        expect([klass.id, null]).toContain(card.classId);
      }
    }
  });

  it('keeps pack rarity weights positive', () => {
    for (const pack of packs) {
      const total = pack.weights.reduce((sum, [, weight]) => sum + weight, 0);
      expect(total).toBeGreaterThan(0);
    }
  });

  it('exposes every card and enemy through the index', () => {
    for (const card of cards) expect(contentIndex.card(card.id).id).toBe(card.id);
    for (const enemy of enemies) expect(contentIndex.enemy(enemy.id).id).toBe(enemy.id);
  });
});
