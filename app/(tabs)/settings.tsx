import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useSettings } from '../../hooks/useSettings';
import { themes } from '../../lib/themes';

export default function SettingsScreen() {
  const {
    settings,
    currentTheme,
    quietMode,
    toggleQuietMode,
    setTheme,
    toggleVibration,
  } = useSettings();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: currentTheme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Quiet Mode - Primary Feature */}
      <View style={[styles.section, { backgroundColor: currentTheme.colors.surface }]}>
        <View style={styles.quietModeHeader}>
          <Text style={[styles.quietModeTitle, { color: currentTheme.colors.text }]}>
            Quiet Mode
          </Text>
          <Text style={[styles.quietModeDescription, { color: currentTheme.colors.textSecondary }]}>
            For study cafes & libraries — alerts via vibration only
          </Text>
        </View>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: currentTheme.colors.text }]}>
              Enable Quiet Mode
            </Text>
            <Text style={[styles.settingDescription, { color: currentTheme.colors.textSecondary }]}>
              Mute all sounds, use vibration only
            </Text>
          </View>
          <Switch
            value={quietMode}
            onValueChange={toggleQuietMode}
            trackColor={{ false: currentTheme.colors.border, true: currentTheme.colors.primary }}
            thumbColor={currentTheme.colors.text}
          />
        </View>
      </View>

      {/* Vibration */}
      <View style={[styles.section, { backgroundColor: currentTheme.colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
          Vibration
        </Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: currentTheme.colors.text }]}>
              Vibration
            </Text>
            <Text style={[styles.settingDescription, { color: currentTheme.colors.textSecondary }]}>
              Vibrate on completion
            </Text>
          </View>
          <Switch
            value={settings.vibrationEnabled}
            onValueChange={toggleVibration}
            trackColor={{ false: currentTheme.colors.border, true: currentTheme.colors.primary }}
            thumbColor={currentTheme.colors.text}
          />
        </View>
      </View>

      {/* Theme Selection */}
      <View style={[styles.section, { backgroundColor: currentTheme.colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
          Theme
        </Text>
        
        {themes.map((theme) => (
          <TouchableOpacity
            key={theme.id}
            style={[
              styles.themeOption,
              { borderBottomColor: currentTheme.colors.border },
              settings.themeId === theme.id && {
                backgroundColor: currentTheme.colors.primary + '20',
              },
            ]}
            onPress={() => setTheme(theme.id)}
          >
            <View style={styles.themeInfo}>
              <Text style={[styles.themeName, { color: currentTheme.colors.text }]}>
                {theme.name}
              </Text>
              <View style={styles.colorPreview}>
                <View
                  style={[
                    styles.colorDot,
                    { backgroundColor: theme.colors.primary },
                  ]}
                />
                <View
                  style={[
                    styles.colorDot,
                    { backgroundColor: theme.colors.secondary },
                  ]}
                />
                <View
                  style={[
                    styles.colorDot,
                    { backgroundColor: theme.colors.background },
                  ]}
                />
                <View
                  style={[
                    styles.colorDot,
                    { backgroundColor: theme.colors.accent },
                  ]}
                />
              </View>
            </View>
            
            {settings.themeId === theme.id && (
              <Text style={[styles.checkmark, { color: currentTheme.colors.primary }]}>
                ✓
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* About */}
      <View style={[styles.section, { backgroundColor: currentTheme.colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
          About
        </Text>
        
        <View style={styles.aboutRow}>
          <Text style={[styles.aboutLabel, { color: currentTheme.colors.textSecondary }]}>
            Version
          </Text>
          <Text style={[styles.aboutValue, { color: currentTheme.colors.text }]}>
            1.1.0
          </Text>
        </View>
        
        <View style={styles.aboutRow}>
          <Text style={[styles.aboutLabel, { color: currentTheme.colors.textSecondary }]}>
            GitHub
          </Text>
          <Text style={[styles.aboutValue, { color: currentTheme.colors.primary }]}>
            github.com/spidychoipro/gentle-timer
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  quietModeHeader: {
    marginBottom: 16,
  },
  quietModeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quietModeDescription: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingDescription: {
    fontSize: 14,
    marginTop: 4,
  },
  themeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  themeInfo: {
    flex: 1,
  },
  themeName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
  },
  colorPreview: {
    flexDirection: 'row',
    gap: 6,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  checkmark: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  aboutLabel: {
    fontSize: 14,
  },
  aboutValue: {
    fontSize: 14,
    fontWeight: '500',
  },
});
