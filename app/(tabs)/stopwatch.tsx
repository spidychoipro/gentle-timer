import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useSettings } from '../../hooks/useSettings';
import { useStopwatch } from '../../hooks/useStopwatch';
import { StopwatchDisplay } from '../../components/StopwatchDisplay';

export default function StopwatchScreen() {
  const { currentTheme } = useSettings();
  const {
    elapsedTime,
    isRunning,
    laps,
    formatTime,
    start,
    pause,
    reset,
    addLap,
  } = useStopwatch();

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <View style={styles.content}>
        <StopwatchDisplay
          elapsedTime={elapsedTime}
          laps={laps}
          formatTime={formatTime}
          isRunning={isRunning}
          theme={currentTheme}
        />

        <View style={styles.controls}>
          {!isRunning ? (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: currentTheme.colors.success }]}
              onPress={start}
            >
              <Text style={[styles.buttonText, { color: currentTheme.colors.text }]}>
                Start
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: currentTheme.colors.warning }]}
                onPress={pause}
              >
                <Text style={[styles.buttonText, { color: currentTheme.colors.text }]}>
                  Pause
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, { backgroundColor: currentTheme.colors.primary }]}
                onPress={addLap}
              >
                <Text style={[styles.buttonText, { color: currentTheme.colors.text }]}>
                  Lap
                </Text>
              </TouchableOpacity>
            </>
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
      </View>
    </View>
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
    flexWrap: 'wrap',
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
});
