import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, themes } from '../lib/themes';

export interface Settings {
  quietMode: boolean;
  themeId: string;
  vibrationEnabled: boolean;
  soundEnabled: boolean;
}

interface SettingsContextValue {
  settings: Settings;
  currentTheme: Theme;
  isLoading: boolean;
  toggleQuietMode: () => void;
  setTheme: (themeId: string) => void;
  toggleVibration: () => void;
  toggleSound: () => void;
}

const DEFAULT_SETTINGS: Settings = {
  quietMode: false,
  themeId: 'dracula',
  vibrationEnabled: true,
  soundEnabled: true,
};

const SETTINGS_KEY = '@gentle_timer_settings';
const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem(SETTINGS_KEY);
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setSettings({ ...DEFAULT_SETTINGS, ...parsed });
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadSettings();
  }, []);

  const updateSettings = useCallback(
    (updater: (previous: Settings) => Settings) => {
      setSettings((previous) => {
        const next = updater(previous);
        void AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next)).catch((error) => {
          console.error('Failed to save settings:', error);
        });
        return next;
      });
    },
    []
  );

  const toggleQuietMode = useCallback(
    () =>
      updateSettings((previous) => ({
        ...previous,
        quietMode: !previous.quietMode,
      })),
    [updateSettings]
  );

  const setTheme = useCallback(
    (themeId: string) =>
      updateSettings((previous) => ({
        ...previous,
        themeId,
      })),
    [updateSettings]
  );

  const toggleVibration = useCallback(
    () =>
      updateSettings((previous) => ({
        ...previous,
        vibrationEnabled: !previous.vibrationEnabled,
      })),
    [updateSettings]
  );

  const toggleSound = useCallback(
    () =>
      updateSettings((previous) => ({
        ...previous,
        soundEnabled: !previous.soundEnabled,
      })),
    [updateSettings]
  );

  const currentTheme = useMemo(
    () => themes.find((theme) => theme.id === settings.themeId) || themes[0],
    [settings.themeId]
  );

  const value = useMemo(
    () => ({
      settings,
      currentTheme,
      isLoading,
      toggleQuietMode,
      setTheme,
      toggleVibration,
      toggleSound,
    }),
    [
      currentTheme,
      isLoading,
      setTheme,
      settings,
      toggleQuietMode,
      toggleSound,
      toggleVibration,
    ]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('SettingsProvider is missing from the app root');
  }
  return context;
};
