import React, { useEffect } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useSettings } from '../../hooks/useSettings';
import { useTimer } from '../../hooks/useTimer';
import { TimerPicker } from '../../components/TimerPicker';
import { CircularTimer } from '../../components/CircularTimer';
import { AppIcon } from '../../components/AppIcon';
import { triggerCompletionAlert } from '../../lib/notifications';

const PRESETS = [
  { label: '5분', seconds: 5 * 60 },
  { label: '10분', seconds: 10 * 60 },
  { label: '25분', seconds: 25 * 60 },
  { label: '45분', seconds: 45 * 60 },
];

export default function TimerScreen() {
  const { width } = useWindowDimensions();
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
    setDuration,
    addTime,
    start,
    pause,
    reset,
    clearCompletion,
  } = useTimer();

  useEffect(() => {
    if (!isCompleted) {
      return;
    }

    void triggerCompletionAlert(
      settings.soundEnabled,
      settings.vibrationEnabled,
      settings.quietMode
    );

    Alert.alert('집중 시간이 끝났어요', '잠깐 숨을 고르고 다음 시간을 준비해 보세요.', [
      { text: '닫기', onPress: clearCompletion, style: 'cancel' },
      { text: '같은 시간 다시', onPress: reset },
    ]);
  }, [
    clearCompletion,
    isCompleted,
    reset,
    settings.quietMode,
    settings.soundEnabled,
    settings.vibrationEnabled,
  ]);

  const ringSize = Math.min(width - 64, 292);
  const runAction = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isCompleted) {
      reset();
    } else if (isRunning) {
      pause();
    } else {
      start();
    }
  };

  const selectPreset = (duration: number) => {
    void Haptics.selectionAsync();
    setDuration(duration);
  };

  const statusCopy = isCompleted
    ? '잘했어요. 오늘의 작은 집중이 쌓였습니다.'
    : isRunning
      ? '다른 생각은 잠시 내려두고 지금에 머물러 보세요.'
      : progress > 0
        ? '준비되면 이어서 시작하세요.'
        : '원하는 시간을 고르고 편안하게 시작하세요.';

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.safeArea, { backgroundColor: currentTheme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.eyebrow, { color: currentTheme.colors.primary }]}>
                GENTLE FOCUS
              </Text>
              <Text style={[styles.title, { color: currentTheme.colors.text }]}>
                타이머
              </Text>
            </View>

            {settings.quietMode && (
              <View
                style={[
                  styles.quietBadge,
                  {
                    backgroundColor: currentTheme.colors.surface,
                    borderColor: currentTheme.colors.border,
                  },
                ]}
              >
                <AppIcon name="moon" size={15} color={currentTheme.colors.primary} />
                <Text style={[styles.quietText, { color: currentTheme.colors.textSecondary }]}>
                  조용히
                </Text>
              </View>
            )}
          </View>

          <Text style={[styles.intro, { color: currentTheme.colors.textSecondary }]}>
            {statusCopy}
          </Text>

          <View style={styles.presets}>
            {PRESETS.map((preset) => {
              const isSelected = initialSeconds === preset.seconds;
              return (
                <Pressable
                  key={preset.seconds}
                  disabled={isRunning}
                  onPress={() => selectPreset(preset.seconds)}
                  style={({ pressed }) => [
                    styles.preset,
                    {
                      backgroundColor: isSelected
                        ? currentTheme.colors.primary
                        : currentTheme.colors.surface,
                      borderColor: isSelected
                        ? currentTheme.colors.primary
                        : currentTheme.colors.border,
                      opacity: isRunning ? 0.55 : pressed ? 0.72 : 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.presetText,
                      {
                        color: isSelected
                          ? currentTheme.colors.background
                          : currentTheme.colors.textSecondary,
                      },
                    ]}
                  >
                    {preset.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.ringArea}>
            <View
              style={[
                styles.ringGlow,
                {
                  backgroundColor: `${currentTheme.colors.primary}0C`,
                  height: ringSize + 34,
                  width: ringSize + 34,
                },
              ]}
            />
            <CircularTimer
              hours={hours}
              minutes={minutes}
              seconds={seconds}
              progress={progress}
              isRunning={isRunning}
              isCompleted={isCompleted}
              size={ringSize}
              theme={currentTheme}
            />
          </View>

          <View style={styles.mainControls}>
            <Pressable
              accessibilityLabel="타이머 초기화"
              onPress={() => {
                void Haptics.selectionAsync();
                reset();
              }}
              style={({ pressed }) => [
                styles.utilityButton,
                {
                  backgroundColor: currentTheme.colors.surface,
                  borderColor: currentTheme.colors.border,
                  opacity: pressed ? 0.65 : 1,
                },
              ]}
            >
              <AppIcon name="reset" color={currentTheme.colors.textSecondary} />
            </Pressable>

            <Pressable
              accessibilityLabel={
                isCompleted ? '다시 준비' : isRunning ? '일시 정지' : '시작'
              }
              disabled={!isCompleted && !isRunning && totalSeconds === 0}
              onPress={runAction}
              style={({ pressed }) => [
                styles.primaryButton,
                {
                  opacity:
                    !isCompleted && !isRunning && totalSeconds === 0
                      ? 0.35
                      : pressed
                        ? 0.78
                        : 1,
                },
              ]}
            >
              <LinearGradient
                colors={[
                  currentTheme.colors.primary,
                  currentTheme.colors.success,
                ]}
                end={{ x: 1, y: 1 }}
                start={{ x: 0, y: 0 }}
                style={styles.primaryGradient}
              >
                <AppIcon
                  name={isCompleted ? 'reset' : isRunning ? 'pause' : 'play'}
                  color={currentTheme.colors.background}
                  size={25}
                  strokeWidth={2.2}
                />
                <Text
                  style={[
                    styles.primaryText,
                    { color: currentTheme.colors.background },
                  ]}
                >
                  {isCompleted ? '다시 준비' : isRunning ? '잠시 멈춤' : '시작'}
                </Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              accessibilityLabel="1분 추가"
              onPress={() => {
                void Haptics.selectionAsync();
                addTime(60);
              }}
              style={({ pressed }) => [
                styles.utilityButton,
                {
                  backgroundColor: currentTheme.colors.surface,
                  borderColor: currentTheme.colors.border,
                  opacity: pressed ? 0.65 : 1,
                },
              ]}
            >
              <View style={styles.addMinute}>
                <AppIcon name="plus" color={currentTheme.colors.textSecondary} size={17} />
                <Text
                  style={[
                    styles.addMinuteText,
                    { color: currentTheme.colors.textSecondary },
                  ]}
                >
                  1분
                </Text>
              </View>
            </Pressable>
          </View>

          <View style={styles.customSection}>
            <View style={styles.sectionHeading}>
              <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
                세부 시간 설정
              </Text>
              <Text
                style={[
                  styles.sectionHint,
                  { color: currentTheme.colors.textSecondary },
                ]}
              >
                최대 23:59:59
              </Text>
            </View>
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
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  content: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    width: '100%',
    maxWidth: 520,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.7,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1.2,
    marginTop: 3,
  },
  quietBadge: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  quietText: {
    fontSize: 12,
    fontWeight: '700',
  },
  intro: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 9,
  },
  presets: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 22,
  },
  preset: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 10,
  },
  presetText: {
    fontSize: 13,
    fontWeight: '700',
  },
  ringArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },
  ringGlow: {
    borderRadius: 999,
    position: 'absolute',
  },
  mainControls: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    marginTop: 23,
  },
  utilityButton: {
    alignItems: 'center',
    borderRadius: 21,
    borderWidth: 1,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  primaryButton: {
    borderRadius: 22,
    elevation: 5,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.22,
    shadowRadius: 11,
  },
  primaryGradient: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 9,
    height: 60,
    justifyContent: 'center',
    minWidth: 166,
    paddingHorizontal: 23,
  },
  primaryText: {
    fontSize: 16,
    fontWeight: '800',
  },
  addMinute: {
    alignItems: 'center',
  },
  addMinuteText: {
    fontSize: 9,
    fontWeight: '800',
    marginTop: -1,
  },
  customSection: {
    marginTop: 29,
  },
  sectionHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 11,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  sectionHint: {
    fontSize: 11,
    fontWeight: '600',
  },
});
