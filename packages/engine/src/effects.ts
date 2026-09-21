import type { CardEffect, StatusId, TargetKind } from '@adulting/shared';
import type { BattleEvent, BattleState, Combatant, ContentIndex } from './types.js';
import { EngineError } from './types.js';
import { getCombatant, getZones, livingOf, setStatus, statusOf } from './state.js';
import { shuffle } from './rng.js';

export const resolveTargets = (
  state: BattleState,
  actor: Combatant,
  target: TargetKind,
  chosenId: string | undefined,
): Combatant[] => {
  const foeSide = actor.side === 'party' ? 'foes' : 'party';
  switch (target) {
    case 'self':
      return [actor];
    case 'allFoes':
      return livingOf(state, foeSide);
    case 'allAllies':
      return livingOf(state, actor.side);
    case 'party':
      return livingOf(state, 'party');
    case 'chosenFoe':
    case 'chosenAlly': {
      if (chosenId === undefined) throw new EngineError('effect needs an explicit target', 'targetRequired');
      const chosen = getCombatant(state, chosenId);
      const wantedSide = target === 'chosenFoe' ? foeSide : actor.side;
      if (chosen.side !== wantedSide || chosen.hp <= 0) {
        throw new EngineError(`target ${chosenId} is not a legal ${target}`, 'invalidTarget');
      }
      return [chosen];
    }
    default: {
      const exhaustive: never = target;
      throw new Error(`unhandled target ${String(exhaustive)}`);
    }
  }
};

export const computeDamage = (source: Combatant, target: Combatant, base: number): number => {
  const withStrength = base + statusOf(source, 'strength');
  const weakened = statusOf(source, 'weak') > 0 ? withStrength * 0.75 : withStrength;
  const amplified = statusOf(target, 'vulnerable') > 0 ? weakened * 1.5 : weakened;
  return Math.max(0, Math.floor(amplified));
};

export const dealDamage = (
  source: Combatant,
  target: Combatant,
  raw: number,
  events: BattleEvent[],
): void => {
  if (target.hp <= 0) return;
  const amount = computeDamage(source, target, raw);
  const blocked = Math.min(target.block, amount);
  target.block -= blocked;
  const through = amount - blocked;
  target.hp = Math.max(0, target.hp - through);
  events.push({ type: 'damaged', sourceId: source.id, targetId: target.id, amount: through, blocked });
  if (target.hp === 0) events.push({ type: 'defeated', combatantId: target.id });
};

export const drawCards = (
  state: BattleState,
  combatant: Combatant,
  count: number,
  events: BattleEvent[],
): void => {
  const zones = getZones(state, combatant.id);
  const drawn: string[] = [];
  for (let i = 0; i < count; i += 1) {
    if (zones.draw.length === 0) {
      if (zones.discard.length === 0) break;
      zones.draw = shuffle(state.rng, zones.discard);
      zones.discard = [];
      events.push({ type: 'pileShuffled', combatantId: combatant.id });
    }
    const card = zones.draw.pop();
    if (card === undefined) break;
    zones.hand.push(card);
    drawn.push(card.id);
  }
  if (drawn.length > 0) events.push({ type: 'cardsDrawn', combatantId: combatant.id, cardInstanceIds: drawn });
};

const applyStatus = (target: Combatant, status: StatusId, stacks: number, events: BattleEvent[]): void => {
  const next = Math.max(0, statusOf(target, status) + stacks);
  setStatus(target, status, next);
  events.push({ type: 'statusChanged', targetId: target.id, status, stacks: next });
};

export const applyEffect = (
  state: BattleState,
  actor: Combatant,
  effect: CardEffect,
  chosenId: string | undefined,
  events: BattleEvent[],
  _content: ContentIndex,
): void => {
  const targets = resolveTargets(state, actor, effect.target, chosenId);
  switch (effect.kind) {
    case 'damage':
      for (const target of targets) dealDamage(actor, target, effect.amount, events);
      return;
    case 'block':
      for (const target of targets) {
        target.block += effect.amount + statusOf(actor, 'focus');
        events.push({ type: 'blockGained', targetId: target.id, amount: target.block });
      }
      return;
    case 'heal':
      for (const target of targets) {
        target.hp = Math.min(target.maxHp, target.hp + effect.amount);
        events.push({ type: 'healed', targetId: target.id, amount: effect.amount });
      }
      return;
    case 'loseHp':
      for (const target of targets) {
        target.hp = Math.max(0, target.hp - effect.amount);
        events.push({ type: 'damaged', sourceId: actor.id, targetId: target.id, amount: effect.amount, blocked: 0 });
        if (target.hp === 0) events.push({ type: 'defeated', combatantId: target.id });
      }
      return;
    case 'status':
      for (const target of targets) applyStatus(target, effect.status, effect.stacks, events);
      return;
    case 'draw':
      for (const target of targets) drawCards(state, target, effect.amount, events);
      return;
    case 'energy':
      for (const target of targets) {
        target.energy = Math.max(0, target.energy + effect.amount);
        events.push({ type: 'energyChanged', combatantId: target.id, amount: target.energy });
      }
      return;
    case 'blockAsDamage': {
      const raw = Math.floor(actor.block * effect.ratio);
      if (raw <= 0) return;
      for (const target of targets) dealDamage(actor, target, raw, events);
      return;
    }
    case 'recall': {
      const zones = getZones(state, actor.id);
      const moved: string[] = [];
      for (let i = 0; i < effect.amount; i += 1) {
        const card = zones.discard.pop();
        if (card === undefined) break;
        zones.hand.push(card);
        moved.push(card.id);
      }
      if (moved.length > 0) events.push({ type: 'cardsDrawn', combatantId: actor.id, cardInstanceIds: moved });
      return;
    }
    default: {
      const exhaustive: never = effect;
      throw new Error(`unhandled effect ${JSON.stringify(exhaustive)}`);
    }
  }
};
