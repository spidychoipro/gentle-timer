import * as Haptics from 'expo-haptics';
import { createAudioPlayer } from 'expo-audio';

const GENTLE_SOUND_URI =
  'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH+JkI+GfnR0goqOj4yGf3l5hIuQkI2HgH1+goqPkI2IgH5+gYmNj42JgX9/gIeLjoyIgH9/gIaIjIuHgYCAgIWGiYqHgYGBgYOEhomJh4GBgYKEhYeIiIeBgYGDhYaHh4eAgYGDhYaHh4eAgYGDhYaHh4eAgYGDhYaHh4eAgQ==';

export const playGentleSound = async (soundEnabled: boolean, quietMode: boolean) => {
  if (!soundEnabled || quietMode) return;

  try {
    const player = createAudioPlayer(GENTLE_SOUND_URI);
    player.volume = 0.3;

    const subscription = player.addListener('playbackStatusUpdate', (status) => {
      if (status.didJustFinish || status.error) {
        subscription.remove();
        player.remove();
      }
    });
    player.play();
  } catch (error) {
    console.error('Failed to play sound:', error);
  }
};

export const triggerVibration = async (vibrationEnabled: boolean, quietMode: boolean) => {
  if (!vibrationEnabled) return;

  try {
    if (quietMode) {
      for (let index = 0; index < 3; index += 1) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        if (index < 2) {
          await new Promise((resolve) => setTimeout(resolve, 320));
        }
      }
    } else {
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
  await Promise.all([
    triggerVibration(vibrationEnabled, quietMode),
    playGentleSound(soundEnabled, quietMode),
  ]);
};
