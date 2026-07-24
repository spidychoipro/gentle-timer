import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, themes } from '../lib/themes';

export type AlertMode = 'sound' | 'silent';

export interface Settings {
  alertMode: AlertMode;
  themeId: string;
  vibrationEnabled: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  alertMode: 'silent',
  themeId: 'dracula',
  vibrationEnabled: true,
};

const SETTINGS_KEY = '@gentle_timer_settings';

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    const theme = themes.find((t) => t.id === settings.themeId) || themes[0];
    setCurrentTheme(theme);
  }, [settings.themeId]);

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

  const saveSettings = async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const toggleQuietMode = () => {
    const newMode: AlertMode = settings.alertMode === 'silent' ? 'sound' : 'silent';
    saveSettings({ ...settings, alertMode: newMode });
  };

  const setAlertMode = (mode: AlertMode) => {
    saveSettings({ ...settings, alertMode: mode });
  };

  const setTheme = (themeId: string) => {
    saveSettings({ ...settings, themeId });
  };

  const toggleVibration = () => {
    saveSettings({ ...settings, vibrationEnabled: !settings.vibrationEnabled });
  };

  return {
    settings,
    currentTheme,
    isLoading,
    quietMode: settings.alertMode === 'silent',
    soundEnabled: settings.alertMode === 'sound',
    toggleQuietMode,
    setAlertMode,
    setTheme,
    toggleVibration,
  };
};
