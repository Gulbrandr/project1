# Adulting

A todo app, a deckbuilding card game, and a self-help layer sharing one loop:
real chores are the only source of in-game currency and character XP.

```
apps/mobile      Expo React Native client (expo-router, Zustand, TanStack Query)
apps/api         NestJS + Prisma + Postgres, authoritative coop server
packages/shared  Domain types, zod schemas, wire protocol
packages/engine  Deterministic battle engine (pure TS, no IO)
packages/content Cards, classes, enemies, packs, lore
docs/            Design, architecture, data model, economy, progression, canon, roadmap
```

Start with `docs/00-overview.md`.

## Current state (M0)

Working and covered by tests:

- `packages/shared`: task/economy/card/character domain, grant math, coop and sync protocol.
- `packages/engine`: seeded RNG, battle state, effects, turn flow, 9 tests including determinism and replay.
- `packages/content`: 4 classes, 18 cards, 5 enemies, 2 pack definitions, 3 lore chapters, 4 tests.

Scaffolded, not yet runnable end to end:

- `apps/api`: module map, Prisma schema, economy/sync/packs logic, coop WebSocket gateway. Needs auth (M3).
- `apps/mobile`: five screens against in-memory state. Needs SQLite persistence (M1).

## Setup

```bash
pnpm install
pnpm test          # engine + content
pnpm typecheck
```

API:

```bash
cp apps/api/.env.example apps/api/.env
pnpm --filter @adulting/api prisma:migrate
pnpm --filter @adulting/api dev
```

Mobile:

```bash
pnpm --filter @adulting/mobile dev
```

## Design rules that decide arguments later

1. Currency comes from real completions only. No purchases, no combat rewards.
   Cards come from packs, talents from levels, equipment from real-world milestones.
2. The engine is pure. No `Date.now`, no `Math.random`, no IO, ever.
3. Solo play works offline. Coop is server-authoritative.
4. Balances are derived from ledgers, never stored as mutable columns.
