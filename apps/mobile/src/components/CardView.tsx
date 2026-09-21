import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { CardDef } from '@adulting/shared';
import { theme } from '@/theme';

interface Props {
  def: CardDef;
  playable?: boolean;
  onPress?: () => void;
}

const rarityColor: Record<CardDef['rarity'], string> = {
  common: theme.color.border,
  uncommon: theme.color.good,
  rare: theme.color.accent,
  mythic: theme.color.danger,
};

export function CardView({ def, playable = true, onPress }: Props): JSX.Element {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={!playable}
      style={[styles.card, { borderColor: rarityColor[def.rarity] }, !playable && styles.disabled]}
    >
      <View style={styles.header}>
        <Text style={styles.cost}>{def.cost}</Text>
        <Text style={styles.name} numberOfLines={1}>
          {def.name}
        </Text>
      </View>
      <Text style={styles.text}>{def.text}</Text>
      <Text style={styles.type}>{def.type}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 128,
    height: 176,
    padding: theme.space.sm,
    marginRight: theme.space.sm,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    backgroundColor: theme.color.surfaceAlt,
    justifyContent: 'space-between',
  },
  disabled: { opacity: 0.4 },
  header: { flexDirection: 'row', alignItems: 'center', gap: theme.space.xs },
  cost: {
    color: theme.color.bg,
    backgroundColor: theme.color.accent,
    width: 22,
    height: 22,
    borderRadius: 11,
    textAlign: 'center',
    fontWeight: '800',
  },
  name: { color: theme.color.text, fontWeight: '700', flex: 1 },
  text: { color: theme.color.textDim, fontSize: 12 },
  type: { color: theme.color.textDim, fontSize: 10, textTransform: 'uppercase' },
});
