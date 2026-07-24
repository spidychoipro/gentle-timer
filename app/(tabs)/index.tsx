import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, Animated } from 'react-native';
import { useSettings } from '../../hooks/useSettings';
import { useTimer } from '../../hooks/useTimer';
import { TimerPicker } from '../../components/TimerPicker';
import { TimerDisplay } from '../../components/TimerDisplay';
import { triggerCompletionAlert } from '../../lib/notifications';

export default function TimerScreen() {
  const { currentTheme, settings } = useSettings();
  const {
    hours,
    minutes,
    seconds,
    isRunning,
    totalSeconds,
    initialSeconds,
    isCompleted,
    progress,
    setHours,
    setMinutes,
    setSeconds,
    start,
    pause,
    reset,
    clearCompletion,
  } = useTimer();

  const flashAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isCompleted) {
      triggerCompletionAlert(
        settings.alertMode,
        settings.vibrationEnabled
      );

      // Flash animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(flashAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(flashAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }),
        ])
      ).start();

      Alert.alert(
        'Timer Complete!',
        'Your timer has finished.',
        [
          {
            text: 'OK',
            onPress: () => {
              flashAnim.setValue(0);
              clearCompletion();
            },
          },
        ]
      );
    }
  }, [isCompleted]);

  const flashBackgroundColor = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [currentTheme.colors.background, currentTheme.colors.success],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: flashBackgroundColor },
      ]}
    >
      <View style={styles.content}>
        {!isRunning && totalSeconds === initialSeconds ? (
          <TimerPicker
            hours={hours}
            minutes={minutes}
            seconds={seconds}
            onHoursChange={setHours}
            onMinutesChange={setMinutes}
            onSecondsChange={setSeconds}
            theme={currentTheme}
            disabled={isRunning}
          />
        ) : (
          <TimerDisplay
            hours={hours}
            minutes={minutes}
            seconds={seconds}
            progress={progress}
            isRunning={isRunning}
            theme={currentTheme}
          />
        )}

        <View style={styles.controls}>
          {!isRunning ? (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: currentTheme.colors.success }]}
              onPress={start}
              disabled={totalSeconds === 0}
            >
              <Text style={[styles.buttonText, { color: currentTheme.colors.text }]}>
                Start
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: currentTheme.colors.warning }]}
              onPress={pause}
            >
              <Text style={[styles.buttonText, { color: currentTheme.colors.text }]}>
                Pause
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: currentTheme.colors.error }]}
            onPress={reset}
          >
            <Text style={[styles.buttonText, { color: currentTheme.colors.text }]}>
              Reset
            </Text>
          </TouchableOpacity>
        </View>

        {settings.alertMode === 'silent' && (
          <View style={[styles.quietIndicator, { backgroundColor: currentTheme.colors.surface }]}>
            <Text style={[styles.quietText, { color: currentTheme.colors.textSecondary }]}>
              🔇 Quiet Mode Active
            </Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 40,
  },
  button: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quietIndicator: {
    marginTop: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  quietText: {
    fontSize: 14,
  },
});
