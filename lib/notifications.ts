import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

export const playGentleSound = async (soundEnabled: boolean, quietMode: boolean) => {
  if (!soundEnabled || quietMode) return;

  try {
    // Create a simple beep sound using Audio
    const { sound } = await Audio.Sound.createAsync(
      { uri: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH+JkI+GfnR0goqOj4yGf3l5hIuQkI2HgH1+goqPkI2IgH5+gYmNj42JgX9/gIeLjoyIgH9/gIaIjIuHgYCAgIWGiYqHgYGBgYOEhomJh4GBgYKEhYeIiIeBgYGDhYaHh4eAgYGDhYaHh4eAgYGDhYaHh4eAgYGDhYaHh4eAgQ==' },
      { shouldPlay: true }
    );
    await sound.setVolumeAsync(0.3); // Gentle volume
    
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (error) {
    console.error('Failed to play sound:', error);
  }
};

export const triggerVibration = async (vibrationEnabled: boolean, quietMode: boolean) => {
  if (!vibrationEnabled) return;

  try {
    if (quietMode) {
      // Stronger vibration for quiet mode
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else {
      // Gentle vibration for normal mode
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  } catch (error) {
    console.error('Failed to trigger vibration:', error);
  }
};

export const triggerCompletionAlert = async (
  soundEnabled: boolean,
  vibrationEnabled: boolean,
  quietMode: boolean
) => {
  // Always try to vibrate
  await triggerVibration(vibrationEnabled, quietMode);
  
  // Play sound based on mode
  await playGentleSound(soundEnabled, quietMode);
};
