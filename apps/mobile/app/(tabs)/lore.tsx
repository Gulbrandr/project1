import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { loreChapters } from '@adulting/content';
import { useTaskStore } from '@/state/useTaskStore';
import { theme } from '@/theme';

export default function LoreScreen(): JSX.Element {
  const completions = useTaskStore((state) => state.completionsToday.length);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {loreChapters.map((chapter) => {
        const unlocked = completions >= chapter.unlockAtCompletions;
        return (
          <View key={chapter.id} style={styles.card}>
            <Text style={styles.title}>{chapter.title}</Text>
            <Text style={styles.body}>
              {unlocked
                ? chapter.body
                : `Sealed. ${chapter.unlockAtCompletions} completions in ${chapter.domain}.`}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.color.bg },
  content: { padding: theme.space.md, gap: theme.space.md },
  card: {
    padding: theme.space.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.color.surface,
    borderWidth: 1,
    borderColor: theme.color.border,
  },
  title: { color: theme.color.text, fontSize: 18, fontWeight: '700', marginBottom: theme.space.sm },
  body: { color: theme.color.textDim, lineHeight: 20 },
});
