import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Theme } from '../lib/themes';

interface CircularTimerProps {
  hours: number;
  minutes: number;
  seconds: number;
  progress: number;
  isRunning: boolean;
  isCompleted: boolean;
  size: number;
  theme: Theme;
}

export function CircularTimer({
  hours,
  minutes,
  seconds,
  progress,
  isRunning,
  isCompleted,
  size,
  theme,
}: CircularTimerProps) {
  const strokeWidth = 11;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const remaining = Math.max(0, Math.min(1, 1 - progress));
  const time =
    hours > 0
      ? `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      : `${minutes.toString().padStart(2, '0')}:${seconds
          .toString()
          .padStart(2, '0')}`;

  const status = isCompleted
    ? '완료'
    : isRunning
      ? '집중 중'
      : progress > 0
        ? '잠시 멈춤'
        : '준비 완료';

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.ring}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill={theme.colors.surface}
          stroke={theme.colors.border}
          strokeWidth={strokeWidth}
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={isCompleted ? theme.colors.success : theme.colors.primary}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference * (1 - remaining)}
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      <View style={styles.content}>
        <View
          style={[
            styles.statusPill,
            {
              backgroundColor: isRunning
                ? `${theme.colors.primary}1F`
                : `${theme.colors.textSecondary}17`,
            },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: isCompleted
                  ? theme.colors.success
                  : isRunning
                    ? theme.colors.primary
                    : theme.colors.textSecondary,
              },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              {
                color: isRunning
                  ? theme.colors.primary
                  : theme.colors.textSecondary,
              },
            ]}
          >
            {status}
          </Text>
        </View>

        <Text
          adjustsFontSizeToFit
          numberOfLines={1}
          style={[styles.time, { color: theme.colors.text }]}
        >
          {time}
        </Text>
        <Text style={[styles.caption, { color: theme.colors.textSecondary }]}>
          남은 시간
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 28,
    width: '100%',
  },
  statusPill: {
    alignItems: 'center',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  statusDot: {
    borderRadius: 4,
    height: 7,
    width: 7,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  time: {
    fontSize: 54,
    fontVariant: ['tabular-nums'],
    fontWeight: '800',
    letterSpacing: -2,
    marginTop: 15,
  },
  caption: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});
