# Data Model (Postgres, Prisma)

Normalized. Balances are derived from ledgers, never stored as mutable columns.

## Productivity

- `User(id, handle, createdAt)`
- `Device(id, userId, platform, lastSeenAt)`
- `TaskList(id, userId, name, domain)` — domain maps to lore zones
- `Task(id, listId, title, notes, difficulty, recurrence, dueAt, archivedAt)`
- `TaskCompletion(id, taskId, userId, completedAt, clientId, difficultyAtCompletion)` — unique on `(taskId, clientId)` for idempotent sync
- `HabitStreak(id, userId, taskId, current, longest, lastCreditedOn)`
- `Reflection(id, userId, periodStart, periodEnd, prompt, body)`

## Social

- `Connection(id, userAId, userBId, status, createdAt)` — symmetric, stored once with a
  canonical ordering. Degree-2 reachability is computed, never denormalized.
- `Attestation(id, claimId, attesterUserId, phoneHash, redeemedAt, linkedAccount)` —
  `phoneHash` only; plaintext numbers are never stored.
- `SharedClaim(id, milestoneId, energy, createdAt)` + participants — one real event,
  one claim, joint energy.

## Economy

- `MoteLedger(id, userId, delta, reason, refType, refId, createdAt)`
- `XpLedger(id, userId, characterId, delta, reason, refId, createdAt)`
- Balance: `sum(delta)`. Materialized view refreshed on write for read speed.

## Game

- `Character(id, userId, classId, name, level, createdAt)`
- `CardDefinition` lives in content, not the DB. The DB stores ownership only.
- `CardOwnership(id, userId, cardDefId, count, foil, acquiredAt)`
- `Deck(id, characterId, name, isActive)` / `DeckCard(deckId, cardDefId, count)`
- `PackPurchase(id, userId, packDefId, motesSpent, seed, createdAt)` + `PackPull(id, purchaseId, cardDefId, rarity)`
- `Run(id, userId, tractId, seed, contentVersion, status, startedAt, endedAt)`
- `RunParticipant(runId, characterId, userId, role)`
- `BattleSnapshot(id, runId, nodeIndex, state jsonb, eventCursor)` — resume support
- `LoreUnlock(userId, chapterId, unlockedAt)`

## Invariants

1. A `TaskCompletion` is the only thing that can create a positive `MoteLedger` row with reason `task`.
2. `PackPurchase.seed` plus `contentVersion` fully determines the pulls; pulls are reproducible for support.
3. A `Deck` is valid only if every `DeckCard` is owned in sufficient `count` and legal for the character's class and level.
