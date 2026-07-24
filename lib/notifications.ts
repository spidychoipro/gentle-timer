import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { AlertMode } from '../hooks/useSettings';

export const playGentleSound = async (alertMode: AlertMode) => {
  if (alertMode === 'silent') return;

  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: false,
      staysActiveInBackground: false,
    });

    const { sound } = await Audio.Sound.createAsync(
      { uri: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH+JkI+GfnR0goqOj4yGf3l5hIuQkI2HgH1+goqPkI2IgH5+gYmNj42JgX9/gIeLjoyIgH9/gIaIjIuHgYCAgIWGiYqHgYGBgYOEhomJh4GBgYKEhYeIiIeBgYGDhYaHh4eAgYGDhYaHh4eAgYGDhYaHh4eAgYGDhYaHh4eAgQ==' },
      { shouldPlay: true }
    );
    await sound.setVolumeAsync(0.3);
    
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (error) {
    console.error('Failed to play sound:', error);
  }
};

export const triggerVibration = async (vibrationEnabled: boolean, alertMode: AlertMode) => {
  if (!vibrationEnabled) return;

  try {
    if (alertMode === 'silent') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  } catch (error) {
    console.error('Failed to trigger vibration:', error);
  }
};

export const triggerCompletionAlert = async (
  alertMode: AlertMode,
  vibrationEnabled: boolean
) => {
  await triggerVibration(vibrationEnabled, alertMode);
  await playGentleSound(alertMode);
};
