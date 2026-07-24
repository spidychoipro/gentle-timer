import * as Haptics from 'expo-haptics';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';

const GENTLE_CHIME = require('../assets/sounds/gentle-chime.wav');
let audioModePromise: Promise<void> | null = null;

export const configureCompletionAudio = () => {
  if (!audioModePromise) {
    audioModePromise = setAudioModeAsync({
      interruptionMode: 'duckOthers',
      playsInSilentMode: true,
      shouldPlayInBackground: false,
      shouldRouteThroughEarpiece: false,
    }).catch((error) => {
      audioModePromise = null;
      throw error;
    });
  }

  return audioModePromise;
};

export const playGentleSound = async (soundEnabled: boolean, quietMode: boolean) => {
  if (!soundEnabled || quietMode) return;

  try {
    await configureCompletionAudio();

    const player = createAudioPlayer(GENTLE_CHIME, { downloadFirst: true });
    player.volume = 0.85;
    let disposed = false;
    let cleanupTimer: ReturnType<typeof setTimeout> | undefined;

    const cleanup = () => {
      if (disposed) return;
      disposed = true;
      subscription.remove();
      if (cleanupTimer) clearTimeout(cleanupTimer);
      player.remove();
    };

    const subscription = player.addListener('playbackStatusUpdate', (status) => {
      if (status.didJustFinish || status.error) {
        cleanup();
      }
    });

    cleanupTimer = setTimeout(cleanup, 5000);
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
