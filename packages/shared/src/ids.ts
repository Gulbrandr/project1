declare const brand: unique symbol;

type Brand<T, B extends string> = T & { readonly [brand]: B };

export type UserId = Brand<string, 'UserId'>;
export type DeviceId = Brand<string, 'DeviceId'>;
export type TaskId = Brand<string, 'TaskId'>;
export type TaskListId = Brand<string, 'TaskListId'>;
export type CompletionId = Brand<string, 'CompletionId'>;
export type CharacterId = Brand<string, 'CharacterId'>;
export type CardDefId = Brand<string, 'CardDefId'>;
export type CardInstanceId = Brand<string, 'CardInstanceId'>;
export type DeckId = Brand<string, 'DeckId'>;
export type RelicDefId = Brand<string, 'RelicDefId'>;
export type EnemyDefId = Brand<string, 'EnemyDefId'>;
export type PackDefId = Brand<string, 'PackDefId'>;
export type RunId = Brand<string, 'RunId'>;
export type BattleId = Brand<string, 'BattleId'>;
export type CombatantId = Brand<string, 'CombatantId'>;
export type TractId = Brand<string, 'TractId'>;
export type LoreChapterId = Brand<string, 'LoreChapterId'>;

/** Only place where an untyped string becomes an id. Keeps the brands honest. */
export const asId = <T extends string>(value: string): T => value as T;
