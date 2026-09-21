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
4 classes, keyword tags, talent trees, equipment slots, 3 tracts, lore chapters 1-3.
Milestone definitions, claims and the daily claim cap ship here, since equipment has
no other source. Effect resolution becomes a modifier pipeline before the third class ships.

## M5 — Coop
WebSocket gateway hosting the engine, lobby, reconnect, autopilot for dropped players.

## M6 — Self help layer
Weekly reflection, load balancing suggestions, category insight tied to class affinity,
recovery milestones and lapse handling.

## M7 — Proof (optional)
Opt-in evidence attached to a completion (photo, timer, location, integration). Only
ever raises limits; never required to play.

## Open questions
- Recurrence model: RRULE subset vs custom. Leaning custom (daily/weekly/interval/monthly-day).
- Do keywords live only on card definitions, or can equipment add keywords to cards?
- What is the exact daily milestone cap curve by level?
- Shared milestones when the companion does not use the app: personal credit, or a
  reduced solo-held shared credit?
- Push notifications: opt-in copy needs to stay non-punitive.

## Settled
- A milestone done with other people is a shared claim paying into joint milestone
  energy, not a personal milestone. One real event, one claim. Shared energy buys
  coop-facing progression only.
- Runs grant no material rewards. Combat can trigger a milestone via mastery records,
  never grant cards, motes or equipment. Removes the coop collusion incentive.
