import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../lib/themes';

interface TimerDisplayProps {
  hours: number;
  minutes: number;
  seconds: number;
  progress: number;
  isRunning: boolean;
  theme: Theme;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  hours,
  minutes,
  seconds,
  progress,
  isRunning,
  theme,
}) => {
  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <View style={styles.container}>
      <View style={[styles.displayContainer, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.time, { color: theme.colors.text }]}>
          {formatNumber(hours)}:{formatNumber(minutes)}:{formatNumber(seconds)}
        </Text>
        
        {/* Progress bar */}
        <View style={[styles.progressContainer, { backgroundColor: theme.colors.border }]}>
          <View
            style={[
              styles.progressBar,
              {
                backgroundColor: isRunning ? theme.colors.success : theme.colors.primary,
                width: `${progress * 100}%`,
              },
            ]}
          />
        </View>
        
        {isRunning && (
          <Text style={[styles.status, { color: theme.colors.success }]}>
            Running
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  displayContainer: {
    alignItems: 'center',
    padding: 30,
    borderRadius: 20,
    width: '100%',
    maxWidth: 300,
  },
  time: {
    fontSize: 64,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
    letterSpacing: 2,
  },
  progressContainer: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    marginTop: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  status: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },
});
