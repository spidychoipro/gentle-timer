import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSettings } from '../hooks/useSettings';

export default function RootLayout() {
  const { currentTheme } = useSettings();

  return (
    <>
      <StatusBar style={currentTheme.id === 'light' ? 'dark' : 'light'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: currentTheme.colors.background,
          },
          headerTintColor: currentTheme.colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
