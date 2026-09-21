import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { levelForXp, perksForLevel, xpForLevel } from '@adulting/shared';
import { classes } from '@adulting/content';
import { theme } from '@/theme';

// M1 placeholder: a single local character until characters sync in M3.
const xp = 1240;

export default function KeeperScreen(): JSX.Element {
  const level = levelForXp(xp);
  const perks = perksForLevel(level);
  const next = xpForLevel(level + 1);
  const current = xpForLevel(level);
  const progress = Math.min(1, (xp - current) / Math.max(1, next - current));

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.level}>Level {level}</Text>
      <View style={styles.bar}>
        <View style={[styles.fill, { width: `${Math.round(progress * 100)}%` }]} />
      </View>
      <Text style={styles.dim}>
        {xp - current} / {next - current} xp to level {level + 1}
      </Text>

      <Text style={styles.section}>Perks</Text>
      <Text style={styles.dim}>Max HP {perks.maxHp}</Text>
      <Text style={styles.dim}>Deck slots {perks.deckSlots}</Text>
      <Text style={styles.dim}>Relic slots {perks.relicSlots}</Text>
      <Text style={styles.dim}>Talent picks {perks.talentPicks}</Text>

      <Text style={styles.section}>Classes</Text>
      {classes.map((klass) => (
        <View key={klass.id} style={styles.card}>
          <Text style={styles.cardTitle}>{klass.name}</Text>
          <Text style={styles.dim}>{klass.blurb}</Text>
          <Text style={styles.affinity}>affinity: {klass.affinity.join(', ')}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.color.bg },
  content: { padding: theme.space.md, gap: theme.space.sm },
  level: { color: theme.color.text, fontSize: 32, fontWeight: '800' },
  bar: { height: 10, borderRadius: 5, backgroundColor: theme.color.surfaceAlt, overflow: 'hidden' },
  fill: { height: 10, backgroundColor: theme.color.accent },
  section: { color: theme.color.text, fontSize: 18, fontWeight: '700', marginTop: theme.space.md },
  dim: { color: theme.color.textDim },
  card: {
    padding: theme.space.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.color.surface,
    borderWidth: 1,
    borderColor: theme.color.border,
  },
  cardTitle: { color: theme.color.text, fontWeight: '700', marginBottom: theme.space.xs },
  affinity: { color: theme.color.accent, fontSize: 12, marginTop: theme.space.xs },
});
