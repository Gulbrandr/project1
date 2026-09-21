import type { EnemyDef } from '@adulting/shared';

export const enemies: readonly EnemyDef[] = [
  {
    id: 'foe_dustmote',
    name: 'Dustmote',
    maxHp: 14,
    tier: 'minion',
    pattern: [
      { kind: 'attack', amount: 4, hits: 1 },
      { kind: 'attack', amount: 2, hits: 2 },
    ],
  },
  {
    id: 'foe_pilecreep',
    name: 'Pilecreep',
    maxHp: 26,
    tier: 'standard',
    pattern: [
      { kind: 'defend', amount: 6 },
      { kind: 'attack', amount: 8, hits: 1 },
      { kind: 'debuff', status: 'weak', stacks: 1 },
    ],
    loreRef: 'lore.ch1.pilecreep',
  },
  {
    id: 'foe_inbox_swarm',
    name: 'Inbox Swarm',
    maxHp: 34,
    tier: 'standard',
    pattern: [
      { kind: 'attack', amount: 3, hits: 3 },
      { kind: 'buff', status: 'strength', stacks: 2 },
    ],
  },
  {
    id: 'foe_the_mire',
    name: 'The Mire',
    maxHp: 90,
    tier: 'elite',
    pattern: [
      { kind: 'debuff', status: 'vulnerable', stacks: 2 },
      { kind: 'attack', amount: 12, hits: 1 },
      { kind: 'defend', amount: 12 },
      { kind: 'attack', amount: 6, hits: 2 },
    ],
  },
  {
    id: 'foe_hollow_warden',
    name: 'Hollow Warden',
    maxHp: 160,
    tier: 'boss',
    pattern: [
      { kind: 'buff', status: 'strength', stacks: 3 },
      { kind: 'attack', amount: 10, hits: 2 },
      { kind: 'debuff', status: 'fatigue', stacks: 2 },
      { kind: 'attack', amount: 22, hits: 1 },
    ],
    loreRef: 'lore.ch1.boss',
  },
];
