import { Tabs } from 'expo-router';
import { theme } from '@/theme';

export default function TabsLayout(): JSX.Element {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: theme.color.surface, borderTopColor: theme.color.border },
        tabBarActiveTintColor: theme.color.accent,
        tabBarInactiveTintColor: theme.color.textDim,
        headerStyle: { backgroundColor: theme.color.surface },
        headerTintColor: theme.color.text,
        sceneStyle: { backgroundColor: theme.color.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Today' }} />
      <Tabs.Screen name="keeper" options={{ title: 'Keeper' }} />
      <Tabs.Screen name="collection" options={{ title: 'Cards' }} />
      <Tabs.Screen name="run" options={{ title: 'Run' }} />
      <Tabs.Screen name="lore" options={{ title: 'Lore' }} />
    </Tabs>
  );
}
