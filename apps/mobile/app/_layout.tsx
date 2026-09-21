import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { theme } from '@/theme';

const queryClient = new QueryClient();

export default function RootLayout(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.color.surface },
          headerTintColor: theme.color.text,
          contentStyle: { backgroundColor: theme.color.bg },
        }}
      />
    </QueryClientProvider>
  );
}
