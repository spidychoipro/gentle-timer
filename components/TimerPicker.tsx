import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Theme } from '../lib/themes';
import { AppIcon } from './AppIcon';

interface TimerPickerProps {
  hours: number;
  minutes: number;
  seconds: number;
  onHoursChange: (hours: number) => void;
  onMinutesChange: (minutes: number) => void;
  onSecondsChange: (seconds: number) => void;
  theme: Theme;
  disabled?: boolean;
}

export const TimerPicker: React.FC<TimerPickerProps> = ({
  hours,
  minutes,
  seconds,
  onHoursChange,
  onMinutesChange,
  onSecondsChange,
  theme,
  disabled = false,
}) => {
  const changeValue = (
    value: number,
    max: number,
    amount: number,
    onChange: (value: number) => void
  ) => {
    if (disabled) {
      return;
    }

    void Haptics.selectionAsync();
    onChange(Math.max(0, Math.min(max, value + amount)));
  };

  const renderPicker = (
    label: string,
    value: number,
    max: number,
    onChange: (value: number) => void
  ) => (
    <View style={styles.picker}>
      <Pressable
        accessibilityLabel={`${label} 늘리기`}
        disabled={disabled || value >= max}
        onPress={() => changeValue(value, max, 1, onChange)}
        style={({ pressed }) => [
          styles.stepButton,
          {
            backgroundColor: `${theme.colors.primary}16`,
            opacity: disabled || value >= max ? 0.35 : pressed ? 0.62 : 1,
          },
        ]}
      >
        <AppIcon name="plus" size={18} color={theme.colors.primary} />
      </Pressable>

      <Text style={[styles.value, { color: theme.colors.text }]}>
        {value.toString().padStart(2, '0')}
      </Text>
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
        {label}
      </Text>

      <Pressable
        accessibilityLabel={`${label} 줄이기`}
        disabled={disabled || value <= 0}
        onPress={() => changeValue(value, max, -1, onChange)}
        style={({ pressed }) => [
          styles.stepButton,
          {
            backgroundColor: `${theme.colors.primary}16`,
            opacity: disabled || value <= 0 ? 0.35 : pressed ? 0.62 : 1,
          },
        ]}
      >
        <AppIcon name="minus" size={18} color={theme.colors.primary} />
      </Pressable>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      {renderPicker('시간', hours, 23, onHoursChange)}
      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
      {renderPicker('분', minutes, 59, onMinutesChange)}
      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
      {renderPicker('초', seconds, 59, onSecondsChange)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 14,
    width: '100%',
  },
  picker: {
    alignItems: 'center',
    flex: 1,
  },
  stepButton: {
    alignItems: 'center',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 44,
  },
  value: {
    fontSize: 28,
    fontVariant: ['tabular-nums'],
    fontWeight: '700',
    letterSpacing: -0.7,
    marginTop: 9,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 9,
    marginTop: 1,
  },
  divider: {
    height: 62,
    opacity: 0.7,
    width: StyleSheet.hairlineWidth,
  },
});
