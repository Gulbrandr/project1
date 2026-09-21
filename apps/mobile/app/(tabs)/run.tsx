import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { contentIndex, classes } from '@adulting/content';
import { useBattleStore } from '@/state/useBattleStore';
import { CardView } from '@/components/CardView';
import { theme } from '@/theme';

const heroId = 'hero';

// M2: one fixed encounter. The node map replaces this setup call.
const demoSetup = {
  id: 'demo',
  seed: 20260921,
  party: [
    {
      id: heroId,
      name: 'Keeper',
      maxHp: 70,
      deck: classes[0]?.startingDeck ?? [],
    },
  ],
  foes: [
    { id: 'foe1', defId: 'foe_dustmote' },
    { id: 'foe2', defId: 'foe_pilecreep' },
  ],
} as const;

export default function RunScreen(): JSX.Element {
  const state = useBattleStore((store) => store.state);
  const lastError = useBattleStore((store) => store.lastError);
  const start = useBattleStore((store) => store.start);
  const send = useBattleStore((store) => store.send);

  useEffect(() => {
    if (state === undefined) start(demoSetup);
  }, [state, start]);

  if (state === undefined) return <Text style={styles.dim}>Entering the Tract…</Text>;

  const hero = state.combatants[heroId];
  const hand = state.zones[heroId]?.hand ?? [];
  const foes = state.order
    .map((id) => state.combatants[id])
    .filter((c) => c !== undefined && c.side === 'foes');

  return (
    <View style={styles.screen}>
      <View style={styles.foes}>
        {foes.map((foe) =>
          foe === undefined ? null : (
            <View key={foe.id} style={styles.foe}>
              <Text style={styles.name}>{foe.name}</Text>
              <Text style={styles.hp}>
                {foe.hp}/{foe.maxHp} {foe.block > 0 ? `+${foe.block}` : ''}
              </Text>
              <Text style={styles.intent}>
                {foe.intent === undefined ? '' : describeIntent(foe.intent)}
              </Text>
              <Pressable
                accessibilityRole="button"
                style={styles.targetButton}
                onPress={() => {
                  const card = hand[0];
                  if (card !== undefined) {
                    send(heroId, { kind: 'playCard', cardInstanceId: card.id, targetId: foe.id });
                  }
                }}
              >
                <Text style={styles.targetText}>target</Text>
              </Pressable>
            </View>
          ),
        )}
      </View>

      <View style={styles.status}>
        <Text style={styles.name}>
          {hero?.hp}/{hero?.maxHp} hp · {hero?.block} block · {hero?.energy} energy · turn {state.turn}
        </Text>
        {lastError === undefined ? null : <Text style={styles.error}>{lastError}</Text>}
      </View>

      <ScrollView horizontal contentContainerStyle={styles.hand}>
        {hand.map((card) => {
          const def = contentIndex.card(card.defId);
          return (
            <CardView
              key={card.id}
              def={def}
              playable={(hero?.energy ?? 0) >= def.cost}
              onPress={() =>
                send(heroId, {
                  kind: 'playCard',
                  cardInstanceId: card.id,
                  ...(def.needsTarget ? { targetId: foes[0]?.id ?? '' } : {}),
                })
              }
            />
          );
        })}
      </ScrollView>

      <Pressable accessibilityRole="button" style={styles.endTurn} onPress={() => send(heroId, { kind: 'endTurn' })}>
        <Text style={styles.endTurnText}>End turn</Text>
      </Pressable>
    </View>
  );
}

const describeIntent = (intent: { kind: string; amount?: number; hits?: number; stacks?: number }): string => {
  if (intent.kind === 'attack') return `attacks ${intent.amount ?? 0} x${intent.hits ?? 1}`;
  if (intent.kind === 'defend') return `blocks ${intent.amount ?? 0}`;
  return intent.kind;
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.color.bg, justifyContent: 'space-between' },
  foes: { flexDirection: 'row', gap: theme.space.md, padding: theme.space.md, flexWrap: 'wrap' },
  foe: {
    padding: theme.space.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.color.surface,
    borderWidth: 1,
    borderColor: theme.color.border,
    minWidth: 140,
  },
  name: { color: theme.color.text, fontWeight: '700' },
  hp: { color: theme.color.danger, marginTop: theme.space.xs },
  intent: { color: theme.color.textDim, fontSize: 12, marginTop: theme.space.xs },
  targetButton: { marginTop: theme.space.sm },
  targetText: { color: theme.color.accent, fontSize: 12, textTransform: 'uppercase' },
  status: { padding: theme.space.md },
  error: { color: theme.color.danger, marginTop: theme.space.xs },
  hand: { padding: theme.space.md },
  dim: { color: theme.color.textDim, padding: theme.space.md },
  endTurn: {
    margin: theme.space.md,
    padding: theme.space.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.color.accent,
    alignItems: 'center',
  },
  endTurnText: { color: theme.color.bg, fontWeight: '800' },
});
