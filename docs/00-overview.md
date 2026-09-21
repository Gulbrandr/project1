# Adulting — Overview

Three products in one app, bound by a single currency loop.

1. **Todo**: tasks, habits, routines. The only source of currency.
2. **TCG**: deckbuilding card combat, solo runs and 2-4 player coop. Dawncaster-style.
3. **Self help**: streaks, reflection prompts, load management, progress framed as RPG advancement.

## Core loop

```
complete real task -> earn Motes -> buy pack        -> new cards
                  -> earn XP    -> talent tree picks
                  -> milestones -> equipment (weapon / armor / sigil)
cards + talents + equipment -> deeper runs -> lore + mastery records -> new milestones
```

See `docs/06-progression.md` for the three channels and the milestone rules.

Currency is earned in the real world and spent in the game. The game never sells
Motes for money. Monetization (if any) is cosmetic and lore chapters, decided later.

## Non-negotiables

- Task data is local-first. A run never blocks on the network in solo mode.
- Combat is deterministic given `(seed, ordered intents)`. Same engine runs on client and server.
- The self-help layer never diagnoses, never nags with guilt framing, and never punishes a missed day beyond losing a streak multiplier.
- No pay-to-win: the only way to gain power is doing real tasks. Playing the game
  never grants cards, motes or equipment.
- Milestone claims are rate limited per day, with the cap rising by character level.
  Fabricated completions cannot be converted into a burst of power.

## Repo layout

```
apps/mobile      Expo React Native client
apps/api         NestJS + Prisma + Postgres, authoritative coop server
packages/shared  Domain types, zod schemas, wire protocol
packages/engine  Deterministic battle engine (pure TS, no IO)
packages/content Cards, classes, enemies, packs, lore (data + loaders)
```
