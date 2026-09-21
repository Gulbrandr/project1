import { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useTaskStore } from '@/state/useTaskStore';
import { TaskRow } from '@/components/TaskRow';
import { theme } from '@/theme';

export default function TodayScreen(): JSX.Element {
  const tasks = useTaskStore((state) => state.tasks);
  const completions = useTaskStore((state) => state.completionsToday);
  const balance = useTaskStore((state) => state.moteBalance);
  const streak = useTaskStore((state) => state.streakDays);
  const complete = useTaskStore((state) => state.complete);

  const doneIds = useMemo(() => new Set(completions.map((c) => c.taskId)), [completions]);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.balance}>{balance}</Text>
          <Text style={styles.label}>motes</Text>
        </View>
        <View>
          <Text style={styles.balance}>{streak}</Text>
          <Text style={styles.label}>day streak</Text>
        </View>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(task) => task.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TaskRow task={item} done={doneIds.has(item.id)} onComplete={complete} />
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nothing held today. Add a task to start a Tract.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.color.bg },
  header: {
    flexDirection: 'row',
    gap: theme.space.xl,
    padding: theme.space.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.color.border,
  },
  balance: { color: theme.color.accent, fontSize: 28, fontWeight: '800' },
  label: { color: theme.color.textDim, fontSize: 12, textTransform: 'uppercase' },
  list: { padding: theme.space.md },
  empty: { color: theme.color.textDim, textAlign: 'center', marginTop: theme.space.xl },
});
