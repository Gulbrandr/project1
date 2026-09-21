import { Pressable, StyleSheet, Text, View } from 'react-native';
import { moteBaseByDifficulty, type Task } from '@adulting/shared';
import { theme } from '@/theme';

interface Props {
  task: Task;
  done: boolean;
  onComplete: (taskId: string) => void;
}

export function TaskRow({ task, done, onComplete }: Props): JSX.Element {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ checked: done }}
      style={[styles.row, done && styles.rowDone]}
      onPress={() => onComplete(task.id)}
      disabled={done}
    >
      <View style={styles.main}>
        <Text style={[styles.title, done && styles.titleDone]}>{task.title}</Text>
        <Text style={styles.meta}>
          {task.domain} · {task.difficulty}
        </Text>
      </View>
      <Text style={styles.motes}>+{moteBaseByDifficulty[task.difficulty]}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.space.md,
    marginBottom: theme.space.sm,
    borderRadius: theme.radius.md,
    backgroundColor: theme.color.surface,
    borderWidth: 1,
    borderColor: theme.color.border,
  },
  rowDone: { opacity: 0.45 },
  main: { flex: 1 },
  title: { color: theme.color.text, fontSize: 16, fontWeight: '600' },
  titleDone: { textDecorationLine: 'line-through' },
  meta: { color: theme.color.textDim, fontSize: 12, marginTop: 2 },
  motes: { color: theme.color.accent, fontWeight: '700' },
});
