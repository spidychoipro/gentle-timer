import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
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
import { CircularTimer } from '../../components/CircularTimer';
import { DurationInputModal } from '../../components/DurationInputModal';
import { AppIcon } from '../../components/AppIcon';
import { triggerCompletionAlert } from '../../lib/notifications';

const QUICK_ADD = [
  { label: '+1분', seconds: 60 },
  { label: '+5분', seconds: 5 * 60 },
  { label: '+25분', seconds: 25 * 60 },
];

const FINISHED_BACKGROUND = '#D94C4C';
const FINISHED_FOREGROUND = '#FFFFFF';

const formatDuration = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export default function TimerScreen() {
  const { width } = useWindowDimensions();
  const { currentTheme, settings, setSoundMode } = useSettings();
  const {
    hours,
    minutes,
    seconds,
    isRunning,
    totalSeconds,
    initialSeconds,
    isCompleted,
    progress,
    setDuration,
    addTime,
    start,
    pause,
    reset,
    clear,
    restart,
  } = useTimer();
  const [isInputVisible, setInputVisible] = useState(false);
  const pulse = useRef(new Animated.Value(0)).current;
  const completionHandled = useRef(false);

  const soundOn = settings.soundEnabled && !settings.quietMode;

  useEffect(() => {
    if (!isCompleted) {
      completionHandled.current = false;
      return;
    }
    if (completionHandled.current) {
      return;
    }

    completionHandled.current = true;
    void triggerCompletionAlert(
      settings.soundEnabled,
      settings.vibrationEnabled,
      settings.quietMode
    );

    pulse.setValue(0);
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          duration: 360,
          easing: Easing.out(Easing.ease),
          toValue: 1,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulse, {
          duration: 360,
          easing: Easing.in(Easing.ease),
          toValue: 0,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]),
      { iterations: 3 }
    );
    animation.start();

    return () => animation.stop();
  }, [
    isCompleted,
    pulse,
    settings.quietMode,
    settings.soundEnabled,
    settings.vibrationEnabled,
  ]);

  const toggleSoundMode = () => {
    void Haptics.selectionAsync();
    setSoundMode(!soundOn);
  };

  if (isCompleted) {
    const alertDescription = soundOn
      ? '소리 모드 · 완료음이 재생됐어요'
      : settings.vibrationEnabled
        ? '무음 모드 · 진동으로 알려드렸어요'
        : '무음 모드 · 화면 알림만 사용 중이에요';

    return (
      <SafeAreaView
        edges={['top']}
        style={[styles.finishedSafeArea, { backgroundColor: FINISHED_BACKGROUND }]}
      >
        <View style={styles.finishedContent}>
          <View style={styles.finishedHeader}>
            <Text style={styles.finishedEyebrow}>GENTLE TIMER</Text>
            <SoundModePill
              dark
              soundOn={soundOn}
              onPress={toggleSoundMode}
              textColor={FINISHED_FOREGROUND}
            />
          </View>

          <View style={styles.finishedHero}>
            <Animated.View
              style={[
                styles.finishedPulse,
                {
                  opacity: pulse.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.35, 0],
                  }),
                  transform: [
                    {
                      scale: pulse.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.28],
                      }),
                    },
                  ],
                },
              ]}
            />
            <View style={styles.finishedIcon}>
              <AppIcon
                name="check"
                color={FINISHED_BACKGROUND}
                size={54}
                strokeWidth={2.4}
              />
            </View>
          </View>

          <Text style={styles.finishedTitle}>타이머 종료</Text>
          <Text style={styles.finishedTime}>00:00:00</Text>
          <Text style={styles.finishedMessage}>
            설정한 시간이 모두 지났습니다.
          </Text>

          <View style={styles.finishedModeCard}>
            <AppIcon
              name={soundOn ? 'volume' : 'volumeOff'}
              color={FINISHED_FOREGROUND}
              size={21}
            />
            <Text style={styles.finishedModeText}>{alertDescription}</Text>
          </View>

          <View style={styles.finishedActions}>
            <Pressable
              accessibilityLabel="타이머 종료 알림 닫기"
              onPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                clear();
              }}
              style={({ pressed }) => [
                styles.dismissButton,
                { opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Text style={styles.dismissButtonText}>확인</Text>
            </Pressable>
            <Pressable
              accessibilityLabel="같은 시간 다시 시작"
              onPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                restart();
              }}
              style={({ pressed }) => [
                styles.restartButton,
                { opacity: pressed ? 0.62 : 1 },
              ]}
            >
              <AppIcon name="reset" color={FINISHED_FOREGROUND} size={19} />
              <Text style={styles.restartButtonText}>
                {formatDuration(initialSeconds)} 다시 시작
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const ringSize = Math.min(width - 64, 292);
  const isPaused = !isRunning && progress > 0;
  const statusCopy = isRunning
    ? '타이머가 끝날 때까지 남은 시간을 정확하게 알려드려요.'
    : isPaused
      ? '잠시 멈췄습니다. 준비되면 이어서 시작하세요.'
      : totalSeconds > 0
        ? '준비됐습니다. 시작 버튼을 눌러주세요.'
        : '시간을 설정해 타이머를 시작하세요.';

  const handlePrimaryAction = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isRunning) {
      pause();
    } else {
      start();
    }
  };

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
                GENTLE TIMER
              </Text>
              <Text style={[styles.title, { color: currentTheme.colors.text }]}>
                타이머
              </Text>
            </View>
            <SoundModePill
              soundOn={soundOn}
              onPress={toggleSoundMode}
              textColor={currentTheme.colors.text}
              backgroundColor={
                soundOn
                  ? `${currentTheme.colors.primary}18`
                  : `${currentTheme.colors.warning}18`
              }
              borderColor={
                soundOn ? currentTheme.colors.primary : currentTheme.colors.warning
              }
              iconColor={
                soundOn ? currentTheme.colors.primary : currentTheme.colors.warning
              }
            />
          </View>

          <Text style={[styles.intro, { color: currentTheme.colors.textSecondary }]}>
            {statusCopy}
          </Text>

          <Pressable
            accessibilityLabel={
              isRunning ? '현재 타이머 시간' : '타이머 시간 설정'
            }
            disabled={isRunning}
            onPress={() => setInputVisible(true)}
            style={({ pressed }) => [
              styles.ringArea,
              { opacity: pressed ? 0.78 : 1 },
            ]}
          >
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
              isCompleted={false}
              size={ringSize}
              theme={currentTheme}
            />
          </Pressable>

          {!isRunning && !isPaused && (
            <View style={styles.quickAddSection}>
              <Text
                style={[
                  styles.quickAddLabel,
                  { color: currentTheme.colors.textSecondary },
                ]}
              >
                빠른 시간 추가
              </Text>
              <View style={styles.quickAddRow}>
                {QUICK_ADD.map((item) => (
                  <Pressable
                    key={item.seconds}
                    onPress={() => {
                      void Haptics.selectionAsync();
                      addTime(item.seconds);
                    }}
                    style={({ pressed }) => [
                      styles.quickAddButton,
                      {
                        backgroundColor: currentTheme.colors.surface,
                        borderColor: currentTheme.colors.border,
                        opacity: pressed ? 0.65 : 1,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.quickAddText,
                        { color: currentTheme.colors.text },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          <Pressable
            accessibilityLabel={isRunning ? '타이머 일시 정지' : '타이머 시작'}
            disabled={!isRunning && totalSeconds === 0}
            onPress={handlePrimaryAction}
            style={({ pressed }) => [
              styles.primaryButton,
              {
                opacity:
                  !isRunning && totalSeconds === 0 ? 0.34 : pressed ? 0.78 : 1,
              },
            ]}
          >
            <LinearGradient
              colors={[currentTheme.colors.primary, currentTheme.colors.success]}
              end={{ x: 1, y: 1 }}
              start={{ x: 0, y: 0 }}
              style={styles.primaryGradient}
            >
              <AppIcon
                name={isRunning ? 'pause' : 'play'}
                color={currentTheme.colors.background}
                size={24}
                strokeWidth={2.2}
              />
              <Text
                style={[
                  styles.primaryText,
                  { color: currentTheme.colors.background },
                ]}
              >
                {isRunning
                  ? '잠시 멈춤'
                  : totalSeconds === 0
                    ? '시간을 설정하세요'
                    : isPaused
                      ? '이어서 시작'
                      : '타이머 시작'}
              </Text>
            </LinearGradient>
          </Pressable>

          <View style={styles.secondaryControls}>
            <Pressable
              disabled={totalSeconds === 0 && initialSeconds === 0}
              onPress={() => {
                void Haptics.selectionAsync();
                if (isPaused || isRunning) {
                  reset();
                } else {
                  clear();
                }
              }}
              style={({ pressed }) => [
                styles.secondaryButton,
                {
                  borderColor: currentTheme.colors.border,
                  opacity:
                    totalSeconds === 0 && initialSeconds === 0
                      ? 0.35
                      : pressed
                        ? 0.62
                        : 1,
                },
              ]}
            >
              <AppIcon
                name={isPaused || isRunning ? 'reset' : 'delete'}
                color={currentTheme.colors.textSecondary}
                size={19}
              />
              <Text
                style={[
                  styles.secondaryText,
                  { color: currentTheme.colors.textSecondary },
                ]}
              >
                {isPaused || isRunning ? '처음으로' : '시간 지우기'}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                void Haptics.selectionAsync();
                addTime(60);
              }}
              style={({ pressed }) => [
                styles.secondaryButton,
                {
                  borderColor: currentTheme.colors.border,
                  opacity: pressed ? 0.62 : 1,
                },
              ]}
            >
              <AppIcon
                name="plus"
                color={currentTheme.colors.textSecondary}
                size={19}
              />
              <Text
                style={[
                  styles.secondaryText,
                  { color: currentTheme.colors.textSecondary },
                ]}
              >
                1분 추가
              </Text>
            </Pressable>
          </View>

          <View
            style={[
              styles.modeNotice,
              {
                backgroundColor: currentTheme.colors.surface,
                borderColor: currentTheme.colors.border,
              },
            ]}
          >
            <AppIcon
              name={soundOn ? 'volume' : 'volumeOff'}
              color={
                soundOn ? currentTheme.colors.primary : currentTheme.colors.warning
              }
              size={19}
            />
            <View style={styles.modeNoticeCopy}>
              <Text style={[styles.modeNoticeTitle, { color: currentTheme.colors.text }]}>
                {soundOn ? '완료음이 켜져 있어요' : '무음 모드예요'}
              </Text>
              <Text
                style={[
                  styles.modeNoticeDescription,
                  { color: currentTheme.colors.textSecondary },
                ]}
              >
                {soundOn
                  ? '시간이 끝나면 소리와 진동으로 알려드려요.'
                  : settings.vibrationEnabled
                    ? '시간이 끝나면 진동으로 알려드려요.'
                    : '시간이 끝나면 화면으로만 알려드려요.'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <DurationInputModal
        currentSeconds={totalSeconds}
        onApply={setDuration}
        onClose={() => setInputVisible(false)}
        theme={currentTheme}
        visible={isInputVisible}
      />
    </SafeAreaView>
  );
}

interface SoundModePillProps {
  soundOn: boolean;
  onPress: () => void;
  textColor: string;
  dark?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  iconColor?: string;
}

function SoundModePill({
  soundOn,
  onPress,
  textColor,
  dark = false,
  backgroundColor,
  borderColor,
  iconColor,
}: SoundModePillProps) {
  return (
    <Pressable
      accessibilityHint="완료 알림의 소리 모드를 전환합니다"
      accessibilityLabel={soundOn ? '소리 모드 켜짐' : '무음 모드 켜짐'}
      onPress={onPress}
      style={({ pressed }) => [
        styles.soundPill,
        {
          backgroundColor:
            backgroundColor ?? (dark ? 'rgba(255,255,255,0.14)' : 'transparent'),
          borderColor:
            borderColor ?? (dark ? 'rgba(255,255,255,0.45)' : 'transparent'),
          opacity: pressed ? 0.66 : 1,
        },
      ]}
    >
      <AppIcon
        name={soundOn ? 'volume' : 'volumeOff'}
        color={iconColor ?? textColor}
        size={17}
      />
      <Text style={[styles.soundPillText, { color: textColor }]}>
        {soundOn ? '소리 켬' : '무음'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 28,
  },
  content: {
    alignSelf: 'center',
    maxWidth: 520,
    paddingHorizontal: 20,
    paddingTop: 18,
    width: '100%',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.6,
  },
  title: {
    fontSize: 33,
    fontWeight: '800',
    letterSpacing: -1.1,
    marginTop: 3,
  },
  intro: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
  },
  soundPill: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 7,
    minHeight: 42,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  soundPillText: {
    fontSize: 12,
    fontWeight: '800',
  },
  ringArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  ringGlow: {
    borderRadius: 999,
    position: 'absolute',
  },
  quickAddSection: {
    marginTop: 20,
  },
  quickAddLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  quickAddRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickAddButton: {
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 10,
  },
  quickAddText: {
    fontSize: 12,
    fontWeight: '700',
  },
  primaryButton: {
    borderRadius: 20,
    elevation: 5,
    marginTop: 20,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  primaryGradient: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 9,
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  primaryText: {
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryControls: {
    flexDirection: 'row',
    gap: 9,
    marginTop: 10,
  },
  secondaryButton: {
    alignItems: 'center',
    borderRadius: 17,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 7,
    height: 48,
    justifyContent: 'center',
  },
  secondaryText: {
    fontSize: 11,
    fontWeight: '700',
  },
  modeNotice: {
    alignItems: 'center',
    borderRadius: 19,
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: 16,
    paddingHorizontal: 15,
    paddingVertical: 13,
  },
  modeNoticeCopy: {
    flex: 1,
    marginLeft: 11,
  },
  modeNoticeTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  modeNoticeDescription: {
    fontSize: 9,
    lineHeight: 14,
    marginTop: 2,
  },
  finishedSafeArea: {
    flex: 1,
  },
  finishedContent: {
    alignSelf: 'center',
    flex: 1,
    maxWidth: 520,
    paddingBottom: 24,
    paddingHorizontal: 22,
    paddingTop: 18,
    width: '100%',
  },
  finishedHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  finishedEyebrow: {
    color: FINISHED_FOREGROUND,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.6,
    opacity: 0.8,
  },
  finishedHero: {
    alignItems: 'center',
    alignSelf: 'center',
    height: 126,
    justifyContent: 'center',
    marginTop: 58,
    width: 126,
  },
  finishedPulse: {
    borderColor: FINISHED_FOREGROUND,
    borderRadius: 63,
    borderWidth: 3,
    height: 126,
    position: 'absolute',
    width: 126,
  },
  finishedIcon: {
    alignItems: 'center',
    backgroundColor: FINISHED_FOREGROUND,
    borderRadius: 46,
    height: 92,
    justifyContent: 'center',
    width: 92,
  },
  finishedTitle: {
    color: FINISHED_FOREGROUND,
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1.5,
    marginTop: 27,
    textAlign: 'center',
  },
  finishedTime: {
    color: FINISHED_FOREGROUND,
    fontSize: 45,
    fontVariant: ['tabular-nums'],
    fontWeight: '800',
    letterSpacing: -1.7,
    marginTop: 12,
    textAlign: 'center',
  },
  finishedMessage: {
    color: FINISHED_FOREGROUND,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 7,
    opacity: 0.85,
    textAlign: 'center',
  },
  finishedModeCard: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderColor: 'rgba(255,255,255,0.32)',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    marginTop: 26,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  finishedModeText: {
    color: FINISHED_FOREGROUND,
    fontSize: 11,
    fontWeight: '700',
  },
  finishedActions: {
    gap: 10,
    marginTop: 'auto',
  },
  dismissButton: {
    alignItems: 'center',
    backgroundColor: FINISHED_FOREGROUND,
    borderRadius: 20,
    height: 58,
    justifyContent: 'center',
  },
  dismissButtonText: {
    color: FINISHED_BACKGROUND,
    fontSize: 16,
    fontWeight: '900',
  },
  restartButton: {
    alignItems: 'center',
    borderColor: 'rgba(255,255,255,0.52)',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    height: 54,
    justifyContent: 'center',
  },
  restartButtonText: {
    color: FINISHED_FOREGROUND,
    fontSize: 13,
    fontWeight: '700',
  },
});
