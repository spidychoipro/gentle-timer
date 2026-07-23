import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Theme } from '../lib/themes';
import { Lap } from '../hooks/useStopwatch';

interface StopwatchDisplayProps {
  elapsedTime: number;
  laps: Lap[];
  formatTime: (ms: number) => string;
  isRunning: boolean;
  theme: Theme;
}

export const StopwatchDisplay: React.FC<StopwatchDisplayProps> = ({
  elapsedTime,
  laps,
  formatTime,
  isRunning,
  theme,
}) => {
  const renderLap = ({ item }: { item: Lap }) => (
    <View style={[styles.lapRow, { borderBottomColor: theme.colors.border }]}>
      <Text style={[styles.lapNumber, { color: theme.colors.textSecondary }]}>
        Lap {item.id}
      </Text>
      <Text style={[styles.lapTime, { color: theme.colors.text }]}>
        {formatTime(item.lapTime)}
      </Text>
      <Text style={[styles.totalTime, { color: theme.colors.textSecondary }]}>
        {formatTime(item.time)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.displayContainer, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.time, { color: theme.colors.text }]}>
          {formatTime(elapsedTime)}
        </Text>
        
        {isRunning && (
          <Text style={[styles.status, { color: theme.colors.success }]}>
            Running
          </Text>
        )}
      </View>
      
      {laps.length > 0 && (
        <View style={styles.lapsContainer}>
          <Text style={[styles.lapsTitle, { color: theme.colors.text }]}>
            Laps
          </Text>
          <FlatList
            data={laps}
            renderItem={renderLap}
            keyExtractor={(item) => item.id.toString()}
            style={[styles.lapsList, { backgroundColor: theme.colors.surface }]}
          />
        </View>
      )}
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
  status: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  lapsContainer: {
    width: '100%',
    maxWidth: 300,
    marginTop: 20,
  },
  lapsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  lapsList: {
    borderRadius: 12,
    maxHeight: 200,
  },
  lapRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  lapNumber: {
    fontSize: 14,
    width: 60,
  },
  lapTime: {
    fontSize: 16,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
    flex: 1,
    textAlign: 'center',
  },
  totalTime: {
    fontSize: 14,
    width: 80,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
});
