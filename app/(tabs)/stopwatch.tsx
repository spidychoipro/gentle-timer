import React from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useSettings } from '../../hooks/useSettings';
import { Lap, useStopwatch } from '../../hooks/useStopwatch';
import { StopwatchDisplay } from '../../components/StopwatchDisplay';
import { AppIcon } from '../../components/AppIcon';

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

  const toggleRunning = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isRunning) {
      pause();
    } else {
      start();
    }
  };

  const renderLap = ({ item, index }: { item: Lap; index: number }) => (
    <View
      style={[
        styles.lapRow,
        {
          borderBottomColor:
            index === laps.length - 1 ? 'transparent' : currentTheme.colors.border,
        },
      ]}
    >
      <View style={styles.lapIdentity}>
        <View
          style={[
            styles.lapNumber,
            { backgroundColor: `${currentTheme.colors.primary}16` },
          ]}
        >
          <Text style={[styles.lapNumberText, { color: currentTheme.colors.primary }]}>
            {item.id.toString().padStart(2, '0')}
          </Text>
        </View>
        <Text style={[styles.lapLabel, { color: currentTheme.colors.text }]}>
          구간 {item.id}
        </Text>
      </View>
      <View style={styles.lapValues}>
        <Text style={[styles.lapTime, { color: currentTheme.colors.text }]}>
          {formatTime(item.lapTime)}
        </Text>
        <Text
          style={[
            styles.lapTotal,
            { color: currentTheme.colors.textSecondary },
          ]}
        >
          누적 {formatTime(item.time)}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.safeArea, { backgroundColor: currentTheme.colors.background }]}
    >
      <View style={styles.content}>
        <View>
          <Text style={[styles.eyebrow, { color: currentTheme.colors.primary }]}>
            PRECISE MOMENTS
          </Text>
          <Text style={[styles.title, { color: currentTheme.colors.text }]}>
            스톱워치
          </Text>
          <Text style={[styles.intro, { color: currentTheme.colors.textSecondary }]}>
            한 순간씩 정확하게 기록하세요.
          </Text>
        </View>

        <StopwatchDisplay
          elapsedTime={elapsedTime}
          formatTime={formatTime}
          isRunning={isRunning}
          theme={currentTheme}
        />

        <View style={styles.controls}>
          <Pressable
            accessibilityLabel="스톱워치 초기화"
            onPress={() => {
              void Haptics.selectionAsync();
              reset();
            }}
            style={({ pressed }) => [
              styles.utilityButton,
              {
                backgroundColor: currentTheme.colors.surface,
                borderColor: currentTheme.colors.border,
                opacity: pressed ? 0.65 : elapsedTime === 0 ? 0.45 : 1,
              },
            ]}
          >
            <AppIcon name="reset" color={currentTheme.colors.textSecondary} />
            <Text
              style={[
                styles.utilityLabel,
                { color: currentTheme.colors.textSecondary },
              ]}
            >
              초기화
            </Text>
          </Pressable>

          <Pressable
            accessibilityLabel={isRunning ? '일시 정지' : '시작'}
            onPress={toggleRunning}
            style={({ pressed }) => [
              styles.primaryButton,
              { opacity: pressed ? 0.78 : 1 },
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
                size={25}
              />
              <Text
                style={[
                  styles.primaryText,
                  { color: currentTheme.colors.background },
                ]}
              >
                {isRunning ? '멈춤' : '시작'}
              </Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            accessibilityLabel="구간 기록"
            disabled={!isRunning}
            onPress={() => {
              void Haptics.selectionAsync();
              addLap();
            }}
            style={({ pressed }) => [
              styles.utilityButton,
              {
                backgroundColor: currentTheme.colors.surface,
                borderColor: currentTheme.colors.border,
                opacity: !isRunning ? 0.45 : pressed ? 0.65 : 1,
              },
            ]}
          >
            <AppIcon name="lap" color={currentTheme.colors.textSecondary} />
            <Text
              style={[
                styles.utilityLabel,
                { color: currentTheme.colors.textSecondary },
              ]}
            >
              구간
            </Text>
          </Pressable>
        </View>

        <View style={styles.lapsHeader}>
          <Text style={[styles.lapsTitle, { color: currentTheme.colors.text }]}>
            구간 기록
          </Text>
          <Text style={[styles.lapsCount, { color: currentTheme.colors.textSecondary }]}>
            {laps.length}개
          </Text>
        </View>

        <View
          style={[
            styles.lapsCard,
            {
              backgroundColor: currentTheme.colors.surface,
              borderColor: currentTheme.colors.border,
            },
          ]}
        >
          {laps.length > 0 ? (
            <FlatList
              data={laps}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderLap}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyLaps}>
              <AppIcon
                name="lap"
                color={currentTheme.colors.textSecondary}
                size={22}
              />
              <Text
                style={[
                  styles.emptyTitle,
                  { color: currentTheme.colors.textSecondary },
                ]}
              >
                아직 기록이 없어요
              </Text>
              <Text
                style={[
                  styles.emptyCopy,
                  { color: currentTheme.colors.textSecondary },
                ]}
              >
                측정 중 ‘구간’을 눌러 랩 타임을 남기세요.
              </Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    alignSelf: 'center',
    flex: 1,
    maxWidth: 520,
    paddingHorizontal: 20,
    paddingTop: 18,
    width: '100%',
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
  intro: {
    fontSize: 14,
    marginTop: 8,
  },
  controls: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    marginTop: 20,
  },
  utilityButton: {
    alignItems: 'center',
    borderRadius: 21,
    borderWidth: 1,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  utilityLabel: {
    fontSize: 9,
    fontWeight: '700',
    marginTop: 3,
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
    gap: 8,
    height: 64,
    justifyContent: 'center',
    minWidth: 148,
    paddingHorizontal: 24,
  },
  primaryText: {
    fontSize: 16,
    fontWeight: '800',
  },
  lapsHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 25,
    paddingHorizontal: 2,
  },
  lapsTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  lapsCount: {
    fontSize: 11,
    fontWeight: '600',
  },
  lapsCard: {
    borderRadius: 23,
    borderWidth: 1,
    flex: 1,
    marginBottom: 18,
    minHeight: 112,
    overflow: 'hidden',
  },
  lapRow: {
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    paddingVertical: 13,
  },
  lapIdentity: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  lapNumber: {
    alignItems: 'center',
    borderRadius: 10,
    height: 31,
    justifyContent: 'center',
    width: 31,
  },
  lapNumberText: {
    fontSize: 10,
    fontWeight: '800',
  },
  lapLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  lapValues: {
    alignItems: 'flex-end',
  },
  lapTime: {
    fontSize: 14,
    fontVariant: ['tabular-nums'],
    fontWeight: '700',
  },
  lapTotal: {
    fontSize: 9,
    fontVariant: ['tabular-nums'],
    marginTop: 2,
  },
  emptyLaps: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: 112,
    opacity: 0.7,
    padding: 18,
  },
  emptyTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 7,
  },
  emptyCopy: {
    fontSize: 10,
    marginTop: 3,
  },
});
