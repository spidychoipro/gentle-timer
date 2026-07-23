import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Theme } from '../lib/themes';

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
  const renderPicker = (
    label: string,
    value: number,
    max: number,
    onChange: (val: number) => void
  ) => (
    <View style={[styles.pickerContainer, { backgroundColor: theme.colors.surface }]}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={() => !disabled && onChange(Math.min(value + 1, max))}
        disabled={disabled}
      >
        <Text style={[styles.buttonText, { color: theme.colors.text }]}>+</Text>
      </TouchableOpacity>
      
      <View style={[styles.valueContainer, { borderColor: theme.colors.border }]}>
        <Text style={[styles.value, { color: theme.colors.text }]}>
          {value.toString().padStart(2, '0')}
        </Text>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          {label}
        </Text>
      </View>
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={() => !disabled && onChange(Math.max(value - 1, 0))}
        disabled={disabled}
      >
        <Text style={[styles.buttonText, { color: theme.colors.text }]}>-</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderPicker('HRS', hours, 23, onHoursChange)}
      <Text style={[styles.separator, { color: theme.colors.text }]}>:</Text>
      {renderPicker('MIN', minutes, 59, onMinutesChange)}
      <Text style={[styles.separator, { color: theme.colors.text }]}>:</Text>
      {renderPicker('SEC', seconds, 59, onSecondsChange)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerContainer: {
    alignItems: 'center',
    borderRadius: 12,
    padding: 8,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  valueContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    minWidth: 70,
  },
  value: {
    fontSize: 36,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
  separator: {
    fontSize: 36,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
});
