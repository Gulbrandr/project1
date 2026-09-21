# Roadmap

## M0 — Skeleton (this commit)
Workspace, shared types, engine core, content seed, app shell, API module map.

## M1 — Todo that stands alone
Local SQLite tasks/habits, recurrence, streaks, mote ledger client-side, Today screen.
Ship-worthy as a plain todo app even if nothing else lands.

## M2 — Solo combat
Node map, 1 tract, 1 class (Steward), 12 cards, 6 enemies, 1 boss. Engine driven, client only.

## M3 — Collection and economy
Server auth, task sync, server-side mote ledger, packs, pulls, deckbuilder, deck validation.

## M4 — Advancement and content width
4 classes, talents, relics, 3 tracts, lore chapters 1-3.

## M5 — Coop
WebSocket gateway hosting the engine, lobby, reconnect, autopilot for dropped players.

## M6 — Self help layer
Weekly reflection, load balancing suggestions, category insight tied to class affinity.

## Open questions
- Recurrence model: RRULE subset vs custom. Leaning custom (daily/weekly/interval/monthly-day).
- Do coop runs grant collection rewards at all, or only cosmetics? Affects anti-collusion.
- Push notifications: opt-in copy needs to stay non-punitive.
