import type { EnemyIntent } from '@adulting/shared';
import { nextInt, shuffle, type RngState } from './rng.js';
import { createRng } from './rng.js';
import type {
  BattleEvent,
  BattleIntent,
  BattleState,
  Combatant,
  ContentIndex,
  StepResult,
  Zones,
} from './types.js';
import { EngineError } from './types.js';
import { cloneState, decayingStatuses, getCombatant, getZones, livingOf, setStatus, statusOf } from './state.js';
import { applyEffect, dealDamage, drawCards } from './effects.js';

export const handSize = 5;
export const baseEnergy = 3;

export interface PartyMemberSetup {
  id: string;
  name: string;
  maxHp: number;
  /** Card definition ids; instance ids are derived deterministically. */
  deck: readonly string[];
  ownerUserId?: string;
  maxEnergy?: number;
}

export interface FoeSetup {
  id: string;
  defId: string;
}

export interface BattleSetup {
  id: string;
  seed: number;
  party: readonly PartyMemberSetup[];
  foes: readonly FoeSetup[];
}

const emptyZones = (): Zones => ({ draw: [], hand: [], discard: [], exhaust: [] });

const intentForTurn = (pattern: readonly EnemyIntent[], index: number): EnemyIntent => {
  const intent = pattern[index % pattern.length];
  if (intent === undefined) throw new EngineError('enemy has an empty pattern', 'unknownCard');
  return intent;
};

const setFoeIntents = (state: BattleState, content: ContentIndex, events: BattleEvent[]): void => {
  for (const foe of livingOf(state, 'foes')) {
    if (foe.enemyDefId === undefined) continue;
    const def = content.enemy(foe.enemyDefId);
    const index = foe.patternIndex ?? 0;
    const intent = intentForTurn(def.pattern, index);
    foe.intent = intent;
    events.push({ type: 'intentSet', combatantId: foe.id, intent });
  }
};

const tickTurnStartStatuses = (combatant: Combatant, events: BattleEvent[]): void => {
  const burn = statusOf(combatant, 'burn');
  if (burn > 0) {
    combatant.hp = Math.max(0, combatant.hp - burn);
    events.push({ type: 'damaged', sourceId: combatant.id, targetId: combatant.id, amount: burn, blocked: 0 });
    setStatus(combatant, 'burn', burn - 1);
    if (combatant.hp === 0) events.push({ type: 'defeated', combatantId: combatant.id });
  }
  const regen = statusOf(combatant, 'regen');
  if (regen > 0) {
    combatant.hp = Math.min(combatant.maxHp, combatant.hp + regen);
    events.push({ type: 'healed', targetId: combatant.id, amount: regen });
    setStatus(combatant, 'regen', regen - 1);
  }
};

const decayStatuses = (combatant: Combatant, events: BattleEvent[]): void => {
  for (const status of decayingStatuses) {
    const stacks = statusOf(combatant, status);
    if (stacks <= 0) continue;
    setStatus(combatant, status, stacks - 1);
    events.push({ type: 'statusChanged', targetId: combatant.id, status, stacks: stacks - 1 });
  }
};

const startPartyTurn = (state: BattleState, content: ContentIndex, events: BattleEvent[]): void => {
  state.turn += 1;
  state.phase = 'party';
  events.push({ type: 'turnStarted', turn: state.turn, side: 'party' });
  for (const member of livingOf(state, 'party')) {
    // Steward keeps a slice of its wall; everyone else starts clean.
    const bulwark = statusOf(member, 'bulwark');
    member.block = bulwark > 0 ? Math.floor(member.block * 0.5) : 0;
    member.energy = member.maxEnergy;
    member.endedTurn = false;
    tickTurnStartStatuses(member, events);
    drawCards(state, member, handSize, events);
  }
  setFoeIntents(state, content, events);
};

const discardHand = (state: BattleState, combatant: Combatant): void => {
  const zones = getZones(state, combatant.id);
  zones.discard.push(...zones.hand);
  zones.hand = [];
};

const pickTargetForFoe = (state: BattleState, rng: RngState): Combatant | undefined => {
  const living = livingOf(state, 'party');
  if (living.length === 0) return undefined;
  return living[nextInt(rng, living.length)];
};

const runFoeTurn = (state: BattleState, content: ContentIndex, events: BattleEvent[]): void => {
  state.phase = 'foes';
  events.push({ type: 'turnStarted', turn: state.turn, side: 'foes' });
  for (const foe of livingOf(state, 'foes')) {
    foe.block = 0;
    tickTurnStartStatuses(foe, events);
    if (foe.hp <= 0) continue;
    const intent = foe.intent;
    if (intent === undefined) continue;
    switch (intent.kind) {
      case 'attack': {
        for (let hit = 0; hit < intent.hits; hit += 1) {
          const target = pickTargetForFoe(state, state.rng);
          if (target === undefined) break;
          dealDamage(foe, target, intent.amount, events);
        }
        break;
      }
      case 'defend': {
        foe.block += intent.amount;
        events.push({ type: 'blockGained', targetId: foe.id, amount: foe.block });
        break;
      }
      case 'buff': {
        setStatus(foe, intent.status, statusOf(foe, intent.status) + intent.stacks);
        events.push({
          type: 'statusChanged',
          targetId: foe.id,
          status: intent.status,
          stacks: statusOf(foe, intent.status),
        });
        break;
      }
      case 'debuff': {
        const target = pickTargetForFoe(state, state.rng);
        if (target === undefined) break;
        setStatus(target, intent.status, statusOf(target, intent.status) + intent.stacks);
        events.push({
          type: 'statusChanged',
          targetId: target.id,
          status: intent.status,
          stacks: statusOf(target, intent.status),
        });
        break;
      }
      default: {
        const exhaustive: never = intent;
        throw new Error(`unhandled intent ${JSON.stringify(exhaustive)}`);
      }
    }
    foe.patternIndex = (foe.patternIndex ?? 0) + 1;
    decayStatuses(foe, events);
  }
  if (!settleOutcome(state, events)) startPartyTurn(state, content, events);
};

/** Returns true when the battle is over and the phase has been set accordingly. */
const settleOutcome = (state: BattleState, events: BattleEvent[]): boolean => {
  if (livingOf(state, 'foes').length === 0) {
    state.phase = 'won';
    events.push({ type: 'battleEnded', result: 'won' });
    return true;
  }
  if (livingOf(state, 'party').length === 0) {
    state.phase = 'lost';
    events.push({ type: 'battleEnded', result: 'lost' });
    return true;
  }
  return false;
};

export const createBattle = (setup: BattleSetup, content: ContentIndex): StepResult => {
  const state: BattleState = {
    id: setup.id,
    rng: createRng(setup.seed),
    turn: 0,
    phase: 'party',
    order: [],
    combatants: {},
    zones: {},
    cursor: 0,
  };

  for (const member of setup.party) {
    const combatant: Combatant = {
      id: member.id,
      side: 'party',
      name: member.name,
      hp: member.maxHp,
      maxHp: member.maxHp,
      block: 0,
      energy: member.maxEnergy ?? baseEnergy,
      maxEnergy: member.maxEnergy ?? baseEnergy,
      statuses: {},
      endedTurn: false,
      ...(member.ownerUserId === undefined ? {} : { ownerUserId: member.ownerUserId }),
    };
    state.combatants[member.id] = combatant;
    state.order.push(member.id);
    const zones = emptyZones();
    zones.draw = shuffle(
      state.rng,
      member.deck.map((defId, index) => ({ id: `${member.id}:${index}`, defId })),
    );
    state.zones[member.id] = zones;
  }

  for (const foe of setup.foes) {
    const def = content.enemy(foe.defId);
    state.combatants[foe.id] = {
      id: foe.id,
      side: 'foes',
      name: def.name,
      hp: def.maxHp,
      maxHp: def.maxHp,
      block: 0,
      energy: 0,
      maxEnergy: 0,
      statuses: {},
      endedTurn: false,
      enemyDefId: def.id,
      patternIndex: 0,
    };
    state.order.push(foe.id);
    state.zones[foe.id] = emptyZones();
  }

  const events: BattleEvent[] = [{ type: 'battleStarted', turn: 1 }];
  startPartyTurn(state, content, events);
  state.cursor = events.length;
  return { state, events };
};

export const applyIntent = (
  previous: BattleState,
  actorId: string,
  intent: BattleIntent,
  content: ContentIndex,
): StepResult => {
  if (previous.phase === 'won' || previous.phase === 'lost') {
    throw new EngineError('battle is already over', 'battleOver');
  }
  const state = cloneState(previous);
  const actor = getCombatant(state, actorId);
  const events: BattleEvent[] = [];

  if (actor.side !== 'party' || state.phase !== 'party' || actor.hp <= 0 || actor.endedTurn) {
    throw new EngineError(`${actorId} cannot act right now`, 'notYourTurn');
  }

  switch (intent.kind) {
    case 'playCard': {
      const zones = getZones(state, actorId);
      const index = zones.hand.findIndex((card) => card.id === intent.cardInstanceId);
      const card = index >= 0 ? zones.hand[index] : undefined;
      if (card === undefined) throw new EngineError(`${intent.cardInstanceId} is not in hand`, 'notInHand');
      const def = content.card(card.defId);
      if (actor.energy < def.cost) throw new EngineError('not enough energy', 'notEnoughEnergy');
      if (def.needsTarget && intent.targetId === undefined) {
        throw new EngineError(`${def.id} requires a target`, 'targetRequired');
      }

      actor.energy -= def.cost;
      zones.hand.splice(index, 1);
      events.push({
        type: 'cardPlayed',
        combatantId: actorId,
        cardInstanceId: card.id,
        defId: def.id,
        ...(intent.targetId === undefined ? {} : { targetId: intent.targetId }),
      });
      events.push({ type: 'energyChanged', combatantId: actorId, amount: actor.energy });

      for (const effect of def.effects) applyEffect(state, actor, effect, intent.targetId, events, content);

      if (def.exhaust) zones.exhaust.push(card);
      else zones.discard.push(card);

      settleOutcome(state, events);
      break;
    }
    case 'endTurn': {
      actor.endedTurn = true;
      discardHand(state, actor);
      decayStatuses(actor, events);
      events.push({ type: 'turnEnded', turn: state.turn, combatantId: actorId });
      const stillActing = livingOf(state, 'party').some((member) => !member.endedTurn);
      if (!stillActing && !settleOutcome(state, events)) runFoeTurn(state, content, events);
      break;
    }
    case 'concede': {
      state.phase = 'lost';
      events.push({ type: 'battleEnded', result: 'lost' });
      break;
    }
    default: {
      const exhaustive: never = intent;
      throw new Error(`unhandled intent ${JSON.stringify(exhaustive)}`);
    }
  }

  state.cursor = previous.cursor + events.length;
  return { state, events };
};
