import { Tabs } from 'expo-router';
import { Text, ColorValue } from 'react-native';
import { useSettings } from '../../hooks/useSettings';

function TabIcon({ name, color, focused }: { name: string; color: ColorValue; focused: boolean }) {
  return (
    <Text style={{ fontSize: 24, color: color as string, opacity: focused ? 1 : 0.6 }}>
      {name === 'timer' ? '⏱️' : name === 'stopwatch' ? '⏲️' : '⚙️'}
    </Text>
  );
}

export default function TabLayout() {
  const { currentTheme } = useSettings();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: currentTheme.colors.primary,
        tabBarInactiveTintColor: currentTheme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: currentTheme.colors.surface,
          borderTopColor: currentTheme.colors.border,
        },
        headerStyle: {
          backgroundColor: currentTheme.colors.background,
        },
        headerTintColor: currentTheme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Timer',
          headerTitle: 'Gentle Timer',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="timer" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="stopwatch"
        options={{
          title: 'Stopwatch',
          headerTitle: 'Stopwatch',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="stopwatch" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerTitle: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="settings" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
