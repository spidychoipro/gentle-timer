import React from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useSettings } from '../../hooks/useSettings';
import { themes } from '../../lib/themes';
import { AppIcon, AppIconName } from '../../components/AppIcon';

interface SettingRowProps {
  icon: AppIconName;
  title: string;
  description: string;
  value: boolean;
  onChange: () => void;
  isLast?: boolean;
}

export default function SettingsScreen() {
  const {
    settings,
    currentTheme,
    toggleQuietMode,
    setTheme,
    toggleVibration,
    toggleSound,
  } = useSettings();

  const SettingRow = ({
    icon,
    title,
    description,
    value,
    onChange,
    isLast = false,
  }: SettingRowProps) => (
    <View
      style={[
        styles.settingRow,
        {
          borderBottomColor: isLast ? 'transparent' : currentTheme.colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.iconBox,
          { backgroundColor: `${currentTheme.colors.primary}15` },
        ]}
      >
        <AppIcon name={icon} color={currentTheme.colors.primary} size={20} />
      </View>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingTitle, { color: currentTheme.colors.text }]}>
          {title}
        </Text>
        <Text
          style={[
            styles.settingDescription,
            { color: currentTheme.colors.textSecondary },
          ]}
        >
          {description}
        </Text>
      </View>
      <Switch
        accessibilityLabel={title}
        onValueChange={() => {
          void Haptics.selectionAsync();
          onChange();
        }}
        thumbColor={value ? currentTheme.colors.background : currentTheme.colors.textSecondary}
        trackColor={{
          false: currentTheme.colors.border,
          true: currentTheme.colors.primary,
        }}
        value={value}
      />
    </View>
  );

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
          <Text style={[styles.eyebrow, { color: currentTheme.colors.primary }]}>
            MAKE IT YOURS
          </Text>
          <Text style={[styles.title, { color: currentTheme.colors.text }]}>
            설정
          </Text>
          <Text style={[styles.intro, { color: currentTheme.colors.textSecondary }]}>
            나에게 가장 편안한 타이머로 맞춰보세요.
          </Text>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
              알림과 피드백
            </Text>
          </View>
          <View
            style={[
              styles.card,
              {
                backgroundColor: currentTheme.colors.surface,
                borderColor: currentTheme.colors.border,
              },
            ]}
          >
            <SettingRow
              icon="moon"
              title="조용한 모드"
              description="완료음 없이 진동으로만 알려드려요"
              value={settings.quietMode}
              onChange={toggleQuietMode}
            />
            <SettingRow
              icon="volume"
              title="완료음"
              description="시간이 끝나면 부드러운 소리를 재생해요"
              value={settings.soundEnabled}
              onChange={toggleSound}
            />
            <SettingRow
              icon="vibrate"
              title="진동"
              description="화면을 보지 않아도 완료를 알 수 있어요"
              value={settings.vibrationEnabled}
              onChange={toggleVibration}
              isLast
            />
          </View>

          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
                분위기
              </Text>
              <Text
                style={[
                  styles.sectionSubtitle,
                  { color: currentTheme.colors.textSecondary },
                ]}
              >
                앱 전체에 바로 적용됩니다
              </Text>
            </View>
            <AppIcon
              name="palette"
              color={currentTheme.colors.textSecondary}
              size={20}
            />
          </View>
          <View style={styles.themeGrid}>
            {themes.map((theme) => {
              const isSelected = settings.themeId === theme.id;
              return (
                <Pressable
                  accessibilityLabel={`${theme.name} 테마`}
                  key={theme.id}
                  onPress={() => {
                    void Haptics.selectionAsync();
                    setTheme(theme.id);
                  }}
                  style={({ pressed }) => [
                    styles.themeOption,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: isSelected
                        ? theme.colors.primary
                        : theme.colors.border,
                      opacity: pressed ? 0.72 : 1,
                    },
                  ]}
                >
                  <View style={styles.themeTop}>
                    <View
                      style={[
                        styles.themeSample,
                        { backgroundColor: theme.colors.background },
                      ]}
                    >
                      <View
                        style={[
                          styles.themeArc,
                          {
                            borderColor: theme.colors.primary,
                            borderRightColor: theme.colors.border,
                          },
                        ]}
                      />
                    </View>
                    {isSelected && (
                      <View
                        style={[
                          styles.check,
                          { backgroundColor: theme.colors.primary },
                        ]}
                      >
                        <AppIcon
                          name="check"
                          color={theme.colors.background}
                          size={13}
                          strokeWidth={2.5}
                        />
                      </View>
                    )}
                  </View>
                  <Text style={[styles.themeName, { color: theme.colors.text }]}>
                    {theme.name}
                  </Text>
                  <View style={styles.colorPreview}>
                    {[theme.colors.primary, theme.colors.secondary, theme.colors.accent].map(
                      (color) => (
                        <View
                          key={color}
                          style={[styles.colorDot, { backgroundColor: color }]}
                        />
                      )
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
              앱 정보
            </Text>
          </View>
          <View
            style={[
              styles.card,
              {
                backgroundColor: currentTheme.colors.surface,
                borderColor: currentTheme.colors.border,
              },
            ]}
          >
            <View
              style={[styles.aboutRow, { borderBottomColor: currentTheme.colors.border }]}
            >
              <Text
                style={[styles.aboutLabel, { color: currentTheme.colors.textSecondary }]}
              >
                버전
              </Text>
              <Text style={[styles.aboutValue, { color: currentTheme.colors.text }]}>
                1.2.2
              </Text>
            </View>
            <Pressable
              onPress={() =>
                void Linking.openURL('https://github.com/spidychoipro/gentle-timer')
              }
              style={({ pressed }) => [
                styles.aboutRow,
                { opacity: pressed ? 0.6 : 1 },
              ]}
            >
              <Text
                style={[styles.aboutLabel, { color: currentTheme.colors.textSecondary }]}
              >
                소스 코드
              </Text>
              <Text style={[styles.aboutValue, { color: currentTheme.colors.primary }]}>
                GitHub에서 보기
              </Text>
            </Pressable>
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
    paddingBottom: 34,
  },
  content: {
    alignSelf: 'center',
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
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 28,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: 10,
    marginTop: 3,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    paddingHorizontal: 15,
  },
  settingRow: {
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    minHeight: 82,
    paddingVertical: 13,
  },
  iconBox: {
    alignItems: 'center',
    borderRadius: 14,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  settingInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 10,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  settingDescription: {
    fontSize: 10,
    lineHeight: 15,
    marginTop: 3,
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  themeOption: {
    borderRadius: 20,
    borderWidth: 1.5,
    flexBasis: '48%',
    flexGrow: 1,
    minWidth: 150,
    padding: 14,
  },
  themeTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeSample: {
    alignItems: 'center',
    borderRadius: 13,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  themeArc: {
    borderRadius: 12,
    borderWidth: 4,
    height: 24,
    transform: [{ rotate: '-25deg' }],
    width: 24,
  },
  check: {
    alignItems: 'center',
    borderRadius: 11,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  themeName: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 11,
  },
  colorPreview: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 7,
  },
  colorDot: {
    borderRadius: 4,
    height: 8,
    width: 20,
  },
  aboutRow: {
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 52,
  },
  aboutLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  aboutValue: {
    fontSize: 12,
    fontWeight: '700',
  },
});
