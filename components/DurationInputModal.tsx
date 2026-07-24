import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Theme } from '../lib/themes';
import { AppIcon } from './AppIcon';

interface DurationInputModalProps {
  visible: boolean;
  currentSeconds: number;
  theme: Theme;
  onApply: (totalSeconds: number) => void;
  onClose: () => void;
}

const MAX_DURATION = 23 * 60 * 60 + 59 * 60 + 59;
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'delete'];

const getDigitsFromDuration = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${hours}${minutes}${seconds}`.replace(/^0+/, '');
};

const getDurationFromDigits = (digits: string) => {
  const padded = digits.padStart(6, '0');
  const hours = Number(padded.slice(0, 2));
  const minutes = Number(padded.slice(2, 4));
  const seconds = Number(padded.slice(4, 6));
  return hours * 3600 + minutes * 60 + seconds;
};

const formatDuration = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0'),
  ];
};

export function DurationInputModal({
  visible,
  currentSeconds,
  theme,
  onApply,
  onClose,
}: DurationInputModalProps) {
  const insets = useSafeAreaInsets();
  const [digits, setDigits] = useState('');

  useEffect(() => {
    if (visible) {
      setDigits(getDigitsFromDuration(currentSeconds));
    }
  }, [currentSeconds, visible]);

  const totalSeconds = useMemo(() => getDurationFromDigits(digits), [digits]);
  const isValid = totalSeconds <= MAX_DURATION;
  const [hours, minutes, seconds] = formatDuration(
    Math.min(totalSeconds, MAX_DURATION)
  );

  const handleKey = (key: string) => {
    void Haptics.selectionAsync();

    if (key === 'clear') {
      setDigits('');
      return;
    }
    if (key === 'delete') {
      setDigits((previous) => previous.slice(0, -1));
      return;
    }
    setDigits((previous) =>
      previous.length < 6 ? `${previous}${key}` : previous
    );
  };

  const handleApply = () => {
    if (!isValid) {
      return;
    }
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onApply(totalSeconds);
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <View style={styles.modal}>
        <Pressable
          accessibilityLabel="시간 설정 닫기"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              paddingBottom: Math.max(insets.bottom, 18),
            },
          ]}
        >
          <View style={[styles.handle, { backgroundColor: theme.colors.border }]} />
          <Text style={[styles.eyebrow, { color: theme.colors.primary }]}>
            SET DURATION
          </Text>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            시간 설정
          </Text>

          <View
            style={[
              styles.preview,
              {
                backgroundColor: theme.colors.background,
                borderColor: isValid ? theme.colors.border : theme.colors.error,
              },
            ]}
          >
            {[hours, minutes, seconds].map((value, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <Text style={[styles.separator, { color: theme.colors.textSecondary }]}>
                    :
                  </Text>
                )}
                <View style={styles.timeUnit}>
                  <Text style={[styles.timeValue, { color: theme.colors.text }]}>
                    {value}
                  </Text>
                  <Text
                    style={[
                      styles.timeLabel,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    {index === 0 ? '시간' : index === 1 ? '분' : '초'}
                  </Text>
                </View>
              </React.Fragment>
            ))}
          </View>

          <Text
            style={[
              styles.helper,
              { color: isValid ? theme.colors.textSecondary : theme.colors.error },
            ]}
          >
            {isValid
              ? '숫자를 입력하면 오른쪽부터 초·분·시간으로 채워집니다.'
              : '최대 23시간 59분 59초까지 설정할 수 있어요.'}
          </Text>

          <View style={styles.keypad}>
            {KEYS.map((key) => (
              <Pressable
                accessibilityLabel={
                  key === 'clear' ? '전체 삭제' : key === 'delete' ? '한 글자 삭제' : key
                }
                key={key}
                onPress={() => handleKey(key)}
                style={({ pressed }) => [
                  styles.key,
                  {
                    backgroundColor:
                      key === 'clear' || key === 'delete'
                        ? `${theme.colors.primary}10`
                        : theme.colors.background,
                    borderColor: theme.colors.border,
                    opacity: pressed ? 0.62 : 1,
                  },
                ]}
              >
                {key === 'delete' ? (
                  <AppIcon name="delete" color={theme.colors.textSecondary} size={22} />
                ) : (
                  <Text
                    style={[
                      key === 'clear' ? styles.clearKeyText : styles.keyText,
                      {
                        color:
                          key === 'clear'
                            ? theme.colors.primary
                            : theme.colors.text,
                      },
                    ]}
                  >
                    {key === 'clear' ? '전체 삭제' : key}
                  </Text>
                )}
              </Pressable>
            ))}
          </View>

          <View style={styles.actions}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.cancelButton,
                {
                  borderColor: theme.colors.border,
                  opacity: pressed ? 0.62 : 1,
                },
              ]}
            >
              <Text style={[styles.cancelText, { color: theme.colors.textSecondary }]}>
                취소
              </Text>
            </Pressable>
            <Pressable
              disabled={!isValid}
              onPress={handleApply}
              style={({ pressed }) => [
                styles.applyButton,
                {
                  backgroundColor: theme.colors.primary,
                  opacity: !isValid ? 0.35 : pressed ? 0.72 : 1,
                },
              ]}
            >
              <Text style={[styles.applyText, { color: theme.colors.background }]}>
                적용
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'rgba(0, 0, 0, 0.62)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    alignSelf: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 1,
    maxWidth: 520,
    paddingHorizontal: 20,
    paddingTop: 10,
    width: '100%',
  },
  handle: {
    alignSelf: 'center',
    borderRadius: 2,
    height: 4,
    marginBottom: 18,
    width: 42,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 25,
    fontWeight: '800',
    letterSpacing: -0.6,
    marginTop: 3,
  },
  preview: {
    alignItems: 'center',
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
    paddingHorizontal: 14,
    paddingVertical: 17,
  },
  timeUnit: {
    alignItems: 'center',
    minWidth: 65,
  },
  timeValue: {
    fontSize: 36,
    fontVariant: ['tabular-nums'],
    fontWeight: '800',
    letterSpacing: -1,
  },
  timeLabel: {
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
  },
  separator: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 13,
  },
  helper: {
    fontSize: 10,
    lineHeight: 15,
    marginTop: 9,
    textAlign: 'center',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 15,
  },
  key: {
    alignItems: 'center',
    borderRadius: 17,
    borderWidth: 1,
    flexBasis: '30%',
    flexGrow: 1,
    height: 52,
    justifyContent: 'center',
  },
  keyText: {
    fontSize: 19,
    fontWeight: '700',
  },
  clearKeyText: {
    fontSize: 11,
    fontWeight: '800',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },
  cancelButton: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    height: 54,
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '700',
  },
  applyButton: {
    alignItems: 'center',
    borderRadius: 18,
    flex: 1.6,
    height: 54,
    justifyContent: 'center',
  },
  applyText: {
    fontSize: 15,
    fontWeight: '800',
  },
});
