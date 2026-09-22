# The Canon

Preseeded content: what the app tells you that you should be doing, before you have
typed anything into it. Two content types, with different authority models.

| Type | Answers | Shape |
| --- | --- | --- |
| **Seed** | "What am I supposed to do, and when?" | A dated or triggered obligation |
| **Program** | "I have never done this consistently, how do I start?" | A ramp that generates tasks over time and graduates |

A colonoscopy is a seed. A cleaning routine is a program. Both feed the ordinary task
list once instantiated, so both earn motes through the normal economy.

---

# Part 1: Seeds

## Where the authority comes from

No closed source is required. The best authorities are US government work: public
domain, machine readable, and releasable.

**Preventive health.** USPSTF recommendations are the standard of reference for what
to screen for and when. AHRQ publishes them, and the electronic selector (ePSS) takes
age, sex, pregnancy status and a few risk factors and returns applicable
recommendations with grades. CDC/ACIP publishes immunization schedules in machine
readable form. Verify exact API terms before shipping; the recommendations themselves
are not gateable.

**Home.** No single authority, so it is assembled: NFPA for smoke and CO alarms, EPA
for radon and water, DOE for seasonal HVAC, Cooperative Extension publications for the
rest. Note the split: NFPA's facts are free, NFPA's codes are copyrighted. Encode the
interval, never the document.

**Vehicle.** Service intervals live in manufacturer manuals and are copyrighted, so
this is the one area that may eventually need licensed data. NHTSA's recall lookup is
free and VIN-based, and an open recall is a stronger authority signal than any oil
change reminder.

**Admin and money.** IRS deadlines, FTC free credit report cadence, SSA statement
checks, CMS open enrollment windows. All federal, all citable. Licenses, registration
and inspection are state level and need per-jurisdiction data.

**Pets.** AAHA and AVMA schedules. Guidance text is copyrighted; the intervals are facts.

## Provenance is the product

Every seeded task shows its source in the UI. Not "time for a colonoscopy," but the
recommendation, the issuing body, the grade and the year. A citation line is the
difference between an app that nags and an app that knows something.

## Tiers

Every template carries a tier, and the bottom tier is labeled honestly.

- **Tier A** — clinical or regulatory guideline, with citation and grade.
- **Tier B** — industry consensus with a citation, such as alarm replacement intervals.
- **Tier C** — convention, no real evidence behind it. Changing a furnace filter every
  three months is a manufacturer's habit, not a finding.

Label Tier C as convention and the canon stays trustworthy. Dress it up as guidance and
the whole thing loses credibility.

## Anatomy of a seed

Title, domain, difficulty, eligibility predicate, trigger, citation, tier, and one
sentence on why it matters. Triggers come in four shapes and all four are required:

- **Age based**, one-time or recurring on an interval.
- **Event based**: bought a home, so test for radon; got a dog, so start the vaccine series.
- **Seasonal and calendar**: tax deadlines, open enrollment, seasonal maintenance.
- **Jurisdictional**: state inspection and registration rules.

## Eligibility stays on the device

Eligibility predicates need a profile: age, sex at birth, household, vehicle, pets,
dependents, jurisdiction, optional risk flags. Keep the profile local and evaluate
eligibility on device. The app can know your age and that you own a home without our
server ever holding those attributes.

This fits the local-first architecture already in `02-architecture.md`, and it takes
the scariest version of this product off the table before anyone has to ask about it.

## Guidelines change

This is an architectural requirement, not a content chore. USPSTF moved the mammography
start age recently; the colonoscopy start age moved from 50 to 45 in 2021. The canon
needs a version, a review date per entry, and the ability to reschedule a user's
existing seeded tasks when guidance moves. Retrofitting this later is expensive.

## Scope guardrail

Health information, not diagnosis and not personalized medical advice. Seeded screening
tasks state what the recommendation is and that the decision belongs to the user and
their clinician. No individualized risk scoring. This stays a reminder app rather than
a regulated one.

---

# Part 2: Programs

A program is a ramp. It starts smaller than the user thinks necessary, grows on a
schedule, and graduates into ordinary recurring tasks once it holds. Programs generate
tasks over time rather than dropping them all at once.

## Anatomy of a program

- **Baseline.** Where the user is starting, self-rated, no judgment language. "Dishes
  pile up for a few days" is a baseline, not a failing.
- **Ramp.** Week 1 is one zone, ten minutes, on named days. Week 2 adds a second zone.
  The ramp is the entire product. A program that generates twenty tasks on day one is a
  to-do list with extra steps, which is what every cleaning app already is.
- **Rotation.** Which zone on which day, so no decision is required at the moment of doing.
- **Collapse mode.** The version that runs on a bad week: one zone, five minutes, no
  rotation. The single most important part, and almost nothing ships it.
- **Graduation.** Exit criteria, after which the program stops being a program and
  becomes plain recurring tasks. Programs should end.

## Authority for programs

Cite two different things separately.

**The structure** is where real evidence exists: implementation intentions (specifying
when and where produces a substantial effect on follow-through), habit stacking onto
existing cues, and habit formation taking on the order of two months rather than three
weeks, with missed days not resetting progress. That last finding is the entire
justification for collapse mode, and it belongs in the UI: missing a day does not undo
what you built.

**The content** comes from practical sources: EPA and CDC for cleaning and disinfection,
USDA for kitchen and food safety, and Cooperative Extension publications, which have
the best free home care material available and are usually reusable with attribution.

**What cannot be used**: FlyLady, KonMari, Unf\*ck Your Habitat and similar are
copyrighted systems with trademarks attached. The general principles are not
protectable, so we write our own progressions in our own words and never name or mirror
theirs.

Tier program entries the same way as seeds. Structure claims get a citation. "Clean the
bathroom weekly" is convention, labeled as convention.

## First programs

Pick ones where the failure is common, the ramp is obvious, and the win is visible
within two weeks.

- Home reset (the cleaning routine), zone based.
- Kitchen cycle: dishes, counters, fridge purge.
- Laundry cycle, which is a scheduling problem more than a cleaning one.
- Paper and admin: the pile, the inbox, the unopened mail.
- Money basics: know your balance, check your credit report, kill one recurring charge.
- Sleep and wind-down.
- Recovery: the program offered after two weeks away. The one that decides whether
  people come back.

## Worked example: Home Reset

**Baseline options.** Surfaces are clear most days / dishes pile up for a few days /
most rooms need an hour before anyone could visit / I do not know where to start.

**Zones.** Kitchen counters, sink and dishes, bathroom, floors, one flat surface,
laundry cycle, bedroom.

**Ramp.**

| Week | Load |
| --- | --- |
| 1 | One zone, 10 minutes, two named days |
| 2 | Same zone three days, plus one second zone |
| 3 | Two zones on rotation, four days |
| 4 | Three zones on rotation, five days, plus one weekly reset block |

**Rotation.** Fixed day-to-zone mapping, never a choice at the moment of doing.

**Collapse mode.** Sink only, five minutes, any day. Keeps the streak, keeps the class
affinity, costs nothing to resume from.

**Graduation.** Four consecutive weeks at the week-4 load, or eight weeks of any load
without a two-week gap. On graduation the zones become ordinary recurring tasks and the
program closes with a Deed.

## Capacity is the thing to get right

The same cleaning program cannot serve someone with a spare hour a day and someone in a
depressive episode who has not washed a dish in three weeks. Either the ramp adapts to
the observed completion rate, or two intensities ship and people switch between them
without penalty. Programs that assume a healthy week are why self-help apps get deleted
on the bad ones.

---

## Game integration

Seeds are one-off obligations that pay motes at their difficulty. A colonoscopy is
`project` difficulty: the highest payout in the economy, and it should unlock a Deed.
An app where getting your actual cancer screening done is the single most rewarding
thing you can do is a defensible product.

Programs are questlines. They have chapters, they ramp, they have a completion state,
and finishing a ramp is exactly what a Deed should be. They are the narrative spine
that makes character advancement track something real.

Programs also give class affinity teeth. Home Reset feeds Steward. Paper and admin
feeds Archivist. The affinity fields already in `packages/content` finally have a source.

## POC path

Hand-curate 150 to 300 seed templates across health, home, vehicle, money, admin and
pets, as data with citations, alongside the cards in `packages/content`. Days of
careful work, not an engineering project, and releasable from day one because of where
it comes from. Wire ePSS or the CDC schedules later if the dynamic version proves worth it.

Programs: ship Home Reset first, in full, as the shape every later program copies.
