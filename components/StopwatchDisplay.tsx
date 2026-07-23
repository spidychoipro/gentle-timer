import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Theme } from '../lib/themes';

interface StopwatchDisplayProps {
  elapsedTime: number;
  formatTime: (ms: number) => string;
  isRunning: boolean;
  theme: Theme;
}

export const StopwatchDisplay: React.FC<StopwatchDisplayProps> = ({
  elapsedTime,
  formatTime,
  isRunning,
  theme,
}) => (
  <View
    style={[
      styles.container,
      {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
      },
    ]}
  >
    <View
      style={[
        styles.pulse,
        {
          backgroundColor: isRunning
            ? `${theme.colors.primary}22`
            : `${theme.colors.textSecondary}13`,
        },
      ]}
    >
      <View
        style={[
          styles.pulseCore,
          {
            backgroundColor: isRunning
              ? theme.colors.primary
              : theme.colors.textSecondary,
          },
        ]}
      />
    </View>

    <Text
      adjustsFontSizeToFit
      numberOfLines={1}
      style={[styles.time, { color: theme.colors.text }]}
    >
      {formatTime(elapsedTime)}
    </Text>
    <Text style={[styles.status, { color: theme.colors.textSecondary }]}>
      {isRunning ? '시간을 기록하고 있어요' : elapsedTime > 0 ? '기록 일시 정지' : '측정 준비'}
    </Text>

    <View style={[styles.rule, { backgroundColor: theme.colors.border }]} />
    <View style={styles.units}>
      <Text style={[styles.unitText, { color: theme.colors.textSecondary }]}>
        분
      </Text>
      <Text style={[styles.unitText, { color: theme.colors.textSecondary }]}>
        초
      </Text>
      <Text style={[styles.unitText, { color: theme.colors.textSecondary }]}>
        1/100초
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 30,
    borderWidth: 1,
    marginTop: 26,
    paddingBottom: 20,
    paddingHorizontal: 22,
    paddingTop: 27,
  },
  pulse: {
    alignItems: 'center',
    borderRadius: 12,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  pulseCore: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  time: {
    fontSize: 54,
    fontVariant: ['tabular-nums'],
    fontWeight: '800',
    letterSpacing: -2,
    marginTop: 17,
    width: '100%',
    textAlign: 'center',
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 7,
  },
  rule: {
    height: StyleSheet.hairlineWidth,
    marginTop: 24,
    opacity: 0.8,
    width: '100%',
  },
  units: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 13,
    paddingHorizontal: 22,
    width: '100%',
  },
  unitText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
