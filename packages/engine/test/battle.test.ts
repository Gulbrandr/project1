import { describe, expect, it } from 'vitest';
import { applyIntent, createBattle } from '../src/battle.js';
import type { BattleIntent, BattleState } from '../src/types.js';
import { soloSetup, testContent } from './fixtures.js';

const play = (state: BattleState, intents: readonly BattleIntent[]): BattleState =>
  intents.reduce((current, intent) => applyIntent(current, 'hero', intent, testContent).state, state);

describe('createBattle', () => {
  it('deals an opening hand and telegraphs foe intents', () => {
    const { state, events } = createBattle(soloSetup, testContent);
    expect(state.zones.hero?.hand).toHaveLength(5);
    expect(state.combatants.hero?.energy).toBe(3);
    expect(events.some((e) => e.type === 'intentSet')).toBe(true);
  });

  it('is deterministic for the same seed', () => {
    const a = createBattle(soloSetup, testContent);
    const b = createBattle(soloSetup, testContent);
    expect(a.state.zones.hero?.hand).toEqual(b.state.zones.hero?.hand);
    expect(a.events).toEqual(b.events);
  });

  it('produces a different opening for a different seed', () => {
    const a = createBattle(soloSetup, testContent);
    const b = createBattle({ ...soloSetup, seed: 999 }, testContent);
    expect(a.state.zones.hero?.hand).not.toEqual(b.state.zones.hero?.hand);
  });
});

describe('applyIntent', () => {
  it('spends energy and resolves card effects', () => {
    const { state } = createBattle(soloSetup, testContent);
    const card = state.zones.hero?.hand.find((c) => c.defId === 't_strike');
    expect(card).toBeDefined();
    const next = applyIntent(
      state,
      'hero',
      { kind: 'playCard', cardInstanceId: card?.id ?? '', targetId: 'foe1' },
      testContent,
    );
    expect(next.state.combatants.hero?.energy).toBe(2);
    expect(next.state.combatants.foe1?.hp).toBe(14);
    expect(next.state.cursor).toBeGreaterThan(state.cursor);
  });

  it('never mutates the state it was given', () => {
    const { state } = createBattle(soloSetup, testContent);
    const before = JSON.stringify(state);
    const card = state.zones.hero?.hand[0];
    applyIntent(
      state,
      'hero',
      { kind: 'playCard', cardInstanceId: card?.id ?? '', targetId: 'foe1' },
      testContent,
    );
    expect(JSON.stringify(state)).toBe(before);
  });

  it('rejects a card that is not in hand', () => {
    const { state } = createBattle(soloSetup, testContent);
    expect(() =>
      applyIntent(state, 'hero', { kind: 'playCard', cardInstanceId: 'nope', targetId: 'foe1' }, testContent),
    ).toThrowError(/not in hand/);
  });

  it('runs the foe turn and starts a new party turn on end turn', () => {
    const { state } = createBattle(soloSetup, testContent);
    const next = applyIntent(state, 'hero', { kind: 'endTurn' }, testContent);
    expect(next.state.turn).toBe(2);
    expect(next.state.phase).toBe('party');
    expect(next.state.combatants.hero?.hp).toBe(35);
    expect(next.state.zones.hero?.hand).toHaveLength(5);
  });

  it('replays identically from the same intent sequence', () => {
    const first = createBattle(soloSetup, testContent);
    const second = createBattle(soloSetup, testContent);
    const intents: BattleIntent[] = [{ kind: 'endTurn' }, { kind: 'endTurn' }, { kind: 'endTurn' }];
    expect(JSON.stringify(play(first.state, intents))).toBe(JSON.stringify(play(second.state, intents)));
  });

  it('ends the battle when the party concedes', () => {
    const { state } = createBattle(soloSetup, testContent);
    const next = applyIntent(state, 'hero', { kind: 'concede' }, testContent);
    expect(next.state.phase).toBe('lost');
    expect(() => applyIntent(next.state, 'hero', { kind: 'endTurn' }, testContent)).toThrowError(/already over/);
  });
});
