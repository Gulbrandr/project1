# Progression

Three acquisition channels. Every one of them roots in real-world work; nothing
material is ever granted by playing the game.

| Axis | Channel | Feel |
| --- | --- | --- |
| Cards | Packs, bought with motes earned from completions | Stochastic, frequent, small |
| Talents | Character level, XP earned from completions | Deterministic, paced, guaranteed |
| Equipment | Named real-world milestones | Deterministic, rare, memorable |

Talents being level-driven is deliberate: every player gets a build path regardless
of pack luck, so a cold run of pulls never leaves someone unable to play their class.

## Keywords

Cards carry keyword tags (`strike`, `guard`, `drain`, `burn`, `focus`, `recall`,
`bond`) and state raw effects. Talents modify keywords, never individual cards.
That is what lets one card read four ways.

Drain 6, under four talent paths:

| Talent | Rewrite | Role |
| --- | --- | --- |
| Sanguine | Drain heals 150% | DPS sustain |
| Overflow | Healing above max HP becomes Block | Tank |
| Conduit | Drain heals the lowest-HP ally instead of you | Healer |
| Tether | Drain applies 1 Vulnerable per heal tick | Support |

Open question: do keywords live only on the card definition, or can equipment add
keywords to cards? The second is far more expressive and roughly twice the tuning work.

## Talent trees

Three branches per class, seven tiers, one pick per tier.

- Tiers 4 and 7 are **conversion** talents: they change what a keyword does.
- Every other tier is **numeric**: it changes how much a keyword does.
- Hard rule: at most one active conversion per keyword. Stacked conversions produce
  numbers no encounter math survives.
- Respec is cheap or free. A permanent tree gets net-decked and the open-endedness dies.

## Equipment

Three slots, each with a distinct job.

- **Weapon**: defines the 0-cost basic attack card and grants one keyword affinity.
  The slot that changes how a turn feels.
- **Armor**: sets max HP and Block baseline plus one defensive trigger.
- **Sigil**: the wildcard, one conditional rule. Closest to a classic relic.

A class is therefore its weapon and armor proficiencies plus its talent tree, not a
card pool. That definition survives adding classes later.

## Milestones

Equipment unlocks on named milestones. Good milestone signals are slow and hard to
fake in a burst, because everything rests on self-reported completions.

- Streak length, and breadth across domains rather than depth in one.
- Elapsed-time milestones (30 days holding a Tract), which no amount of tapping accelerates.
- Recovery milestones: returning after a lapse of 7 or more days. Most important one
  for the self-help layer, and the moment most apps punish instead of reward.
- Firsts: first project-difficulty task, first reflection, first task in a new domain.

Avoid raw-volume milestones. The economy already applies `dailyDecay` to discourage
task-spam, and a "complete 500 tasks" milestone would fight it.

### Shared milestones

A milestone done together with another person is not a personal milestone. It is a
shared claim, and it pays into a separate pool: **milestone energy**, held jointly by
the people who did it.

One real event produces one claim, never two. Two people who went to the store
together do not each bank a personal errand milestone; they bank shared energy. This
is both the honest reading of what happened and the thing that closes the obvious
collusion loop, where two accounts attest each other's fabricated days for double
personal credit.

Shared energy spends only on coop-facing progression: party equipment, `bond` keyword
gear, shared lore chapters, coop tract access. Nothing it buys is solo power. That
also gives Warden a progression source that matches its identity, since it is the one
class whose cards assume someone else is on the board.

Rules:

- A shared claim requires attestation from every participant, from their own account.
- Shared claims have their own daily cap, separate from the personal cap, so social
  activity never cannibalizes solo progression.
- The cap is per pair (or per group), not per person, so one account cannot farm
  shared energy by cycling through many partners.
- A cooldown applies per pair, so the same two people cannot bank repeat claims for
  the same kind of outing in one day.

Open question: what happens when the companion does not use the app. Options are to
credit it as an ordinary personal milestone (no double-credit risk exists, since only
one account is involved), or to let the player flag it as accompanied for a reduced
shared credit into a solo-held energy pool. Leaning toward the first, since the second
invents an unverifiable claim type.

### Daily milestone cap

A player can claim only a limited number of milestones per day, and the cap rises
with character level. This is the primary anti-cheat lever: a burst of fabricated
completions cannot be converted into a burst of equipment, and the ceiling itself is
gated behind levelling, which is gated behind sustained real work.

The cap is a soft rate limit, not a punishment. Milestones reached past the cap are
banked and claimable the next day; none are ever lost.

### Proof (later version)

A future version may let a player attach evidence to a completion (photo, timer,
location, an integration). Proof is opt-in and only ever raises limits, never a
requirement to play. Nothing in the current model assumes it exists.

## Run rewards

Combat grants no cards, no motes, no equipment. A run pays in:

- Run-scoped choices that exist only inside that run.
- Lore chapters, unlocked by beating content rather than by completing chores.
- Mastery records (beat the boss with a Drain build, under N turns, solo). These
  register as milestones, which is how combat can *trigger* an unlock without
  *granting* one. The gear still comes out of the milestone system.

## Duplicate protection

A class pack costs roughly a day of real chores, so a duplicate past the deck-legal
cap stings. Duplicates convert to dust, and dust buys a specific named card. This
gives the stochastic channel a deterministic floor without adding a second earning source.

## Lapse handling

Progression rests on real-life consistency, so a bad month must not lock the game.

- Milestones never expire and never regress.
- Losing a streak reduces the mote *rate*, never access.
- Recovery milestones make returning its own reward.

The failure mode to avoid: someone opens the app after three weeks away, sees a dead
streak and a locked tree, and closes it.

## Engine consequence

Talents mean effects are rewritten before resolution, so effect resolution becomes a
pipeline of build modifiers followed by the literal effect. Still pure, still
deterministic. This is the one real architectural change, and it is much cheaper to
land before three classes ship than after.
