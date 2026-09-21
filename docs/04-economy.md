# Economy

## Earning

```
motes = base(difficulty) * streakMultiplier * dailyDecay
```

- `base`: trivial 5, small 10, medium 25, large 60, project 150.
- `streakMultiplier`: 1.0 to 1.5, +0.05 per consecutive active day, capped, resets to 1.0 after a fully missed day.
- `dailyDecay`: 1.0 for the first 8 completions of a day, 0.5 for 9-15, 0.25 beyond. Stops task-spam inflation without punishing a genuinely big day.
- XP uses the same shape with different constants and is per active character.

## Spending

| Item | Cost | Contents |
| --- | --- | --- |
| Common pack | 60 | 5 cards, 1 uncommon+ guaranteed |
| Class pack | 120 | 5 cards from one class pool, 1 rare+ guaranteed |
| Relic cache | 200 | 1 relic, weighted by character level |
| Cosmetic | 40-300 | Card backs, keeper skins |

Pity: a rare is guaranteed within 10 class packs; tracked per user per pool.

## Target rates

A moderate user (6 tasks/day, mixed difficulty) earns ~150 motes/day, roughly one
class pack and change. Tune against this table before changing card power.

## Anti-abuse

Completions are honor-based by design. Guardrails exist only to protect the
economy, not to police the user: per-day mote cap, rate limit on task create and
complete within a short window, and server-side recompute of every grant.
