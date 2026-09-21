# Architecture

## Client (apps/mobile)

Expo (React Native), expo-router, TypeScript strict.

- **State**: Zustand for UI/session, TanStack Query for server state.
- **Local-first data**: SQLite (expo-sqlite) via Drizzle for tasks, habits, ledger, collection cache. The task list works fully offline.
- **Sync**: outbox table, last-write-wins per record with `updatedAt` + `deviceId`. Currency is reconciled server-side (see below).
- **Battle**: `@adulting/engine` runs in-process for solo. Coop mirrors the server: send intent, apply the authoritative event stream, reconcile on mismatch by snapshot replace.

## Server (apps/api)

NestJS, Prisma, Postgres. Modules:

| Module | Responsibility |
| --- | --- |
| `auth` | Device-first accounts, optional email link |
| `tasks` | Task/habit sync endpoints, completion ingestion |
| `economy` | Mote ledger, XP ledger, anti-abuse rate limits |
| `packs` | Pack purchase, seeded pull, collection writes |
| `collection` | Cards owned, decks, validation against class rules |
| `characters` | Levels, talents, relics |
| `runs` | Run lifecycle, seeds, persistence, node map generation |
| `battle` | WebSocket gateway, authoritative engine host for coop |
| `content` | Serves versioned content bundles to clients |

### Authority split

- **Currency and pulls**: server only. The client shows an optimistic balance and
  reconciles on the next sync. Every grant is a ledger row, never a mutated balance.
- **Solo combat**: client-run. The result is reported, not trusted for anything
  except cosmetics and quest progress, since solo combat grants no currency.
- **Coop combat**: server-run. Clients send `intent`, receive `event[]`.

### Determinism contract

`@adulting/engine` is pure: no `Date.now`, no `Math.random`, no IO. All randomness
comes from an explicit `RngState` carried in `BattleState`. Given the same initial
state and the same ordered intents, every machine produces identical events.
This is what makes coop reconciliation and replay bug reports possible.

## Content pipeline

`packages/content` holds typed data modules, validated by zod at build time and
compiled into a versioned bundle (`contentVersion`). Clients cache a bundle;
the server refuses runs started against an unknown version.
