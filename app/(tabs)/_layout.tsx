import { Tabs } from 'expo-router';
import { ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon, AppIconName } from '../../components/AppIcon';
import { useSettings } from '../../hooks/useSettings';

function TabIcon({
  name,
  color,
  focused,
}: {
  name: AppIconName;
  color: ColorValue;
  focused: boolean;
}) {
  return (
    <AppIcon
      name={name}
      color={color as string}
      size={focused ? 24 : 23}
      strokeWidth={focused ? 2.2 : 1.8}
    />
  );
}

export default function TabLayout() {
  const { currentTheme } = useSettings();
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 8);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: currentTheme.colors.background,
        },
        tabBarActiveTintColor: currentTheme.colors.primary,
        tabBarInactiveTintColor: currentTheme.colors.textSecondary,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: 2,
        },
        tabBarItemStyle: {
          minHeight: 52,
          paddingTop: 2,
        },
        tabBarStyle: {
          backgroundColor: currentTheme.colors.surface,
          borderTopColor: currentTheme.colors.border,
          borderTopWidth: 1,
          height: 64 + bottomInset,
          paddingBottom: bottomInset,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '타이머',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="timer" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="stopwatch"
        options={{
          title: '스톱워치',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="stopwatch" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '설정',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="settings" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
