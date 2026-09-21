/**
 * Deterministic PRNG (mulberry32). The engine never touches Math.random; all
 * randomness flows through an RngState carried inside BattleState, so a battle
 * replays identically from (seed, ordered intents) on any machine.
 */
export interface RngState {
  value: number;
}

export const createRng = (seed: number): RngState => ({ value: seed >>> 0 });

export const nextFloat = (rng: RngState): number => {
  rng.value = (rng.value + 0x6d2b79f5) >>> 0;
  let t = rng.value;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/** Integer in [0, maxExclusive). */
export const nextInt = (rng: RngState, maxExclusive: number): number => {
  if (maxExclusive <= 0) throw new Error('nextInt requires a positive bound');
  return Math.floor(nextFloat(rng) * maxExclusive);
};

/** Fisher-Yates, in place, driven by the shared RngState. */
export const shuffle = <T>(rng: RngState, items: T[]): T[] => {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = nextInt(rng, i + 1);
    const a = items[i];
    const b = items[j];
    if (a === undefined || b === undefined) continue;
    items[i] = b;
    items[j] = a;
  }
  return items;
};

/** Weighted pick. Used for pack pulls and enemy variance. */
export const weightedPick = <T>(rng: RngState, entries: ReadonlyArray<readonly [T, number]>): T => {
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  if (total <= 0) throw new Error('weightedPick requires positive total weight');
  let roll = nextFloat(rng) * total;
  for (const [item, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return item;
  }
  const last = entries[entries.length - 1];
  if (last === undefined) throw new Error('weightedPick requires at least one entry');
  return last[0];
};
