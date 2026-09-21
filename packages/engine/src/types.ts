import type { CardDef, EnemyDef, EnemyIntent, StatusId } from '@adulting/shared';
import type { RngState } from './rng.js';

export type Side = 'party' | 'foes';
export type BattlePhase = 'party' | 'foes' | 'won' | 'lost';

export type StatusBag = Partial<Record<StatusId, number>>;

export interface CardInstance {
  id: string;
  defId: string;
}

export interface Zones {
  draw: CardInstance[];
  hand: CardInstance[];
  discard: CardInstance[];
  exhaust: CardInstance[];
}

export interface Combatant {
  id: string;
  side: Side;
  name: string;
  hp: number;
  maxHp: number;
  block: number;
  energy: number;
  maxEnergy: number;
  statuses: StatusBag;
  endedTurn: boolean;
  /** Party members only: which client may send intents for this combatant. */
  ownerUserId?: string;
  /** Foes only. */
  enemyDefId?: string;
  patternIndex?: number;
  intent?: EnemyIntent;
}

export interface BattleState {
  id: string;
  rng: RngState;
  turn: number;
  phase: BattlePhase;
  order: string[];
  combatants: Record<string, Combatant>;
  zones: Record<string, Zones>;
  /** Number of events emitted so far. Clients use it to detect gaps. */
  cursor: number;
}

export type BattleEvent =
  | { type: 'battleStarted'; turn: number }
  | { type: 'turnStarted'; turn: number; side: Side }
  | { type: 'turnEnded'; turn: number; combatantId: string }
  | { type: 'cardPlayed'; combatantId: string; cardInstanceId: string; defId: string; targetId?: string }
  | { type: 'damaged'; sourceId: string; targetId: string; amount: number; blocked: number }
  | { type: 'blockGained'; targetId: string; amount: number }
  | { type: 'healed'; targetId: string; amount: number }
  | { type: 'statusChanged'; targetId: string; status: StatusId; stacks: number }
  | { type: 'cardsDrawn'; combatantId: string; cardInstanceIds: string[] }
  | { type: 'pileShuffled'; combatantId: string }
  | { type: 'energyChanged'; combatantId: string; amount: number }
  | { type: 'defeated'; combatantId: string }
  | { type: 'intentSet'; combatantId: string; intent: EnemyIntent }
  | { type: 'battleEnded'; result: 'won' | 'lost' };

export type BattleIntent =
  | { kind: 'playCard'; cardInstanceId: string; targetId?: string }
  | { kind: 'endTurn' }
  | { kind: 'concede' };

export interface ContentIndex {
  card(defId: string): CardDef;
  enemy(defId: string): EnemyDef;
}

export interface StepResult {
  state: BattleState;
  events: BattleEvent[];
}

export class EngineError extends Error {
  constructor(
    message: string,
    readonly code:
      | 'unknownCombatant'
      | 'unknownCard'
      | 'notYourTurn'
      | 'notInHand'
      | 'notEnoughEnergy'
      | 'targetRequired'
      | 'invalidTarget'
      | 'battleOver',
  ) {
    super(message);
    this.name = 'EngineError';
  }
}
