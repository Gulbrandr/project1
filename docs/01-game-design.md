# Game Design

## Run structure

A *run* is a short session (10-20 minutes) through a **Tract** of the Hollow.
Node map like Dawncaster/Slay the Spire: combat, elite, event, rest, shop, boss.
Runs are not persistent power; the collection and character level are.

## Combat

- Turn based. Party (1-4 characters) vs 1-5 foes.
- Each character has: HP, Block, Energy (base 3), deck, hand (draw 5/turn), discard, exhaust.
- Foes telegraph **intents** for the coming turn. Information is complete; randomness is in draw and in a few card effects.
- Block resets at the start of a character's turn unless a card says otherwise.
- Statuses: `strength`, `focus`, `weak`, `vulnerable`, `regen`, `burn`, `clarity`, `fatigue`.

## Classes

Each class defines a card pool, a starting deck, a resource twist and an advancement track.

| Class | Twist | Plays like |
| --- | --- | --- |
| **Steward** | Block carries over (`bulwark`), converts Block to damage | Attrition, coop frontline |
| **Kindler** | `burn` stacking, spends HP for tempo | Aggro, high risk |
| **Archivist** | Draw and recall from discard, cheap cards chain | Combo |
| **Warden** | Heals and grants allies Block/Energy | Support, only good in coop |

Class identity maps to the self-help layer: a player whose real tasks skew
maintenance chores tends toward Steward; deep-work streaks feed Archivist.
Class choice is never forced by that, only suggested.

## Advancement

Per character: level 1-30. Levels come from task XP, not from winning runs.
Levels grant, on a fixed track: `+max HP`, `+deck slots`, `relic slots`,
class talent picks (choose 1 of 3), and unlock the class's rare pool for packs.

## Coop

- 2-4 players, shared foe group, shared turn timer, individual hands.
- Server-authoritative: clients send intents, server runs the engine, broadcasts events.
- Designed for async-friendly sessions: a run can pause and resume; a dropped
  player is replaced by a simple autopilot so the party is never stuck.
- Warden and Steward cards explicitly target allies; solo decks ignore those.

## Lore

The **Hollow** is entropy given a shape: laundry that becomes a mire, an inbox
that becomes a swarm. Players are **Keepers** who hold a **Tract** in order.
Chapters unlock on cumulative real-world completions, not on spending.
Each chapter reframes a task category (kitchen, admin, body, people, money).
