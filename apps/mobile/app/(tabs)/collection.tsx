import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { classIds, type ClassId } from '@adulting/shared';
import { cardsForClass } from '@adulting/content';
import { CardView } from '@/components/CardView';
import { theme } from '@/theme';

export default function CollectionScreen(): JSX.Element {
  const [classId, setClassId] = useState<ClassId>('steward');
  const cards = cardsForClass(classId);

  return (
    <View style={styles.screen}>
      <View style={styles.filters}>
        {classIds.map((id) => (
          <Pressable
            key={id}
            accessibilityRole="button"
            onPress={() => setClassId(id)}
            style={[styles.chip, id === classId && styles.chipActive]}
          >
            <Text style={[styles.chipText, id === classId && styles.chipTextActive]}>{id}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={[...cards]}
        keyExtractor={(card) => card.id}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <CardView def={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.color.bg },
  filters: { flexDirection: 'row', gap: theme.space.sm, padding: theme.space.md, flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.xs,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.color.surface,
    borderWidth: 1,
    borderColor: theme.color.border,
  },
  chipActive: { backgroundColor: theme.color.accent, borderColor: theme.color.accent },
  chipText: { color: theme.color.textDim, textTransform: 'capitalize' },
  chipTextActive: { color: theme.color.bg, fontWeight: '700' },
  list: { padding: theme.space.md },
  column: { justifyContent: 'flex-start' },
});
