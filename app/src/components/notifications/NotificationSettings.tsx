/**
 * NotificationSettings — Full notification preferences panel.
 *
 * Rendered inside the Settings tab.
 * Toggles for: master switch, daily reminder, habit reminders,
 * streak warnings, achievement alerts. Time picker for daily reminder.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Card } from '../ui/Card';
import { SectionHeader } from '../ui/SectionHeader';
import {
  NotificationPrefs,
  DEFAULT_NOTIFICATION_PREFS,
  loadNotificationPrefs,
  saveNotificationPrefs,
  requestPermissions,
  scheduleDailyReminder,
  cancelDailyReminder,
  cancelAllNotifications,
} from '../../lib/notifications';
import { Colors, Typography, Spacing, Radius, Icons } from '../../constants/design';

// Simple hour/minute presets instead of a native date picker
const TIME_PRESETS = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
  '09:00', '10:00', '12:00', '18:00', '20:00', '21:00',
];

export function NotificationSettings() {
  const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_NOTIFICATION_PREFS);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    (async () => {
      const loaded = await loadNotificationPrefs();
      setPrefs(loaded);
      // Check current permission status
      const granted = await requestPermissions();
      setPermissionGranted(granted);
    })();
  }, []);

  const updatePref = useCallback(async (key: keyof NotificationPrefs, value: any) => {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    await saveNotificationPrefs(updated);

    // Side effects
    if (key === 'enabled' && !value) {
      await cancelAllNotifications();
    }

    if (key === 'dailyReminder') {
      if (value && updated.enabled) {
        await scheduleDailyReminder(updated.dailyReminderTime);
      } else {
        await cancelDailyReminder();
      }
    }

    if (key === 'dailyReminderTime' && updated.dailyReminder && updated.enabled) {
      await scheduleDailyReminder(value as string);
    }
  }, [prefs]);

  const handleMasterToggle = useCallback(async (value: boolean) => {
    if (value && !permissionGranted) {
      const granted = await requestPermissions();
      if (!granted) {
        Alert.alert(
          'Permissions Required',
          'Please enable notifications in your device settings to receive habit reminders.',
        );
        return;
      }
      setPermissionGranted(true);
    }
    await updatePref('enabled', value);
    if (value && prefs.dailyReminder) {
      await scheduleDailyReminder(prefs.dailyReminderTime);
    }
  }, [permissionGranted, prefs, updatePref]);

  const formatTime = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${h12}:${m.toString().padStart(2, '0')} ${suffix}`;
  };

  return (
    <View style={styles.container}>
      <SectionHeader title="Notifications" />

      {/* Master Toggle */}
      <Card style={styles.toggleRow}>
        <View style={styles.toggleContent}>
          <View style={[styles.toggleIcon, { backgroundColor: Colors.accent.ghost }]}>
            <Text style={[styles.toggleIconText, { color: Colors.accent.primary }]}>
              {Icons.sparkle}
            </Text>
          </View>
          <View style={styles.toggleText}>
            <Text style={styles.toggleTitle}>Push Notifications</Text>
            <Text style={styles.toggleSubtitle}>
              {prefs.enabled ? 'Reminders are active' : 'All notifications disabled'}
            </Text>
          </View>
          <Switch
            value={prefs.enabled}
            onValueChange={handleMasterToggle}
            trackColor={{ false: Colors.bg.subtle, true: Colors.accent.muted }}
            thumbColor={prefs.enabled ? Colors.accent.primary : Colors.text.muted}
            ios_backgroundColor={Colors.bg.subtle}
          />
        </View>
      </Card>

      {prefs.enabled && (
        <>
          {/* Daily Reminder */}
          <Card style={styles.toggleRow}>
            <View style={styles.toggleContent}>
              <View style={[styles.toggleIcon, { backgroundColor: Colors.semantic.infoMuted }]}>
                <Text style={[styles.toggleIconText, { color: Colors.semantic.info }]}>
                  {Icons.today}
                </Text>
              </View>
              <View style={styles.toggleText}>
                <Text style={styles.toggleTitle}>Daily Reminder</Text>
                <Text style={styles.toggleSubtitle}>
                  "Your quests await!" every morning
                </Text>
              </View>
              <Switch
                value={prefs.dailyReminder}
                onValueChange={(v) => updatePref('dailyReminder', v)}
                trackColor={{ false: Colors.bg.subtle, true: Colors.accent.muted }}
                thumbColor={prefs.dailyReminder ? Colors.accent.primary : Colors.text.muted}
                ios_backgroundColor={Colors.bg.subtle}
              />
            </View>
          </Card>

          {/* Daily Reminder Time */}
          {prefs.dailyReminder && (
            <Card style={styles.timeCard}>
              <TouchableOpacity
                style={styles.timeRow}
                onPress={() => setShowTimePicker(!showTimePicker)}
              >
                <Text style={styles.timeLabel}>Remind me at</Text>
                <View style={styles.timeBadge}>
                  <Text style={styles.timeValue}>{formatTime(prefs.dailyReminderTime)}</Text>
                  <Text style={styles.timeChevron}>{Icons.chevronRight}</Text>
                </View>
              </TouchableOpacity>

              {showTimePicker && (
                <View style={styles.timeGrid}>
                  {TIME_PRESETS.map(time => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timeOption,
                        prefs.dailyReminderTime === time && styles.timeOptionActive,
                      ]}
                      onPress={() => {
                        updatePref('dailyReminderTime', time);
                        setShowTimePicker(false);
                      }}
                    >
                      <Text style={[
                        styles.timeOptionText,
                        prefs.dailyReminderTime === time && styles.timeOptionTextActive,
                      ]}>
                        {formatTime(time)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </Card>
          )}

          {/* Habit-specific Reminders */}
          <Card style={styles.toggleRow}>
            <View style={styles.toggleContent}>
              <View style={[styles.toggleIcon, { backgroundColor: Colors.semantic.successMuted }]}>
                <Text style={[styles.toggleIconText, { color: Colors.semantic.success }]}>
                  {Icons.check}
                </Text>
              </View>
              <View style={styles.toggleText}>
                <Text style={styles.toggleTitle}>Habit Reminders</Text>
                <Text style={styles.toggleSubtitle}>
                  Individual reminders for each quest
                </Text>
              </View>
              <Switch
                value={prefs.habitReminders}
                onValueChange={(v) => updatePref('habitReminders', v)}
                trackColor={{ false: Colors.bg.subtle, true: Colors.accent.muted }}
                thumbColor={prefs.habitReminders ? Colors.accent.primary : Colors.text.muted}
                ios_backgroundColor={Colors.bg.subtle}
              />
            </View>
          </Card>

          {/* Streak Warnings */}
          <Card style={styles.toggleRow}>
            <View style={styles.toggleContent}>
              <View style={[styles.toggleIcon, { backgroundColor: Colors.streak.muted }]}>
                <Text style={[styles.toggleIconText, { color: Colors.streak.primary }]}>
                  {Icons.fire}
                </Text>
              </View>
              <View style={styles.toggleText}>
                <Text style={styles.toggleTitle}>Streak Warnings</Text>
                <Text style={styles.toggleSubtitle}>
                  Alert before your streak breaks
                </Text>
              </View>
              <Switch
                value={prefs.streakWarnings}
                onValueChange={(v) => updatePref('streakWarnings', v)}
                trackColor={{ false: Colors.bg.subtle, true: Colors.accent.muted }}
                thumbColor={prefs.streakWarnings ? Colors.accent.primary : Colors.text.muted}
                ios_backgroundColor={Colors.bg.subtle}
              />
            </View>
          </Card>

          {/* Achievements */}
          <Card style={styles.toggleRow}>
            <View style={styles.toggleContent}>
              <View style={[styles.toggleIcon, { backgroundColor: Colors.xp.muted }]}>
                <Text style={[styles.toggleIconText, { color: Colors.xp.primary }]}>
                  {Icons.trophy}
                </Text>
              </View>
              <View style={styles.toggleText}>
                <Text style={styles.toggleTitle}>Achievements</Text>
                <Text style={styles.toggleSubtitle}>
                  Get notified when you unlock badges
                </Text>
              </View>
              <Switch
                value={prefs.achievements}
                onValueChange={(v) => updatePref('achievements', v)}
                trackColor={{ false: Colors.bg.subtle, true: Colors.accent.muted }}
                thumbColor={prefs.achievements ? Colors.accent.primary : Colors.text.muted}
                ios_backgroundColor={Colors.bg.subtle}
              />
            </View>
          </Card>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  toggleRow: {
    padding: Spacing.md,
  },
  toggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  toggleIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleIconText: {
    fontSize: 18,
    fontWeight: '700',
  },
  toggleText: {
    flex: 1,
  },
  toggleTitle: {
    ...Typography.bodySemibold,
    color: Colors.text.primary,
  },
  toggleSubtitle: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    marginTop: 1,
  },
  timeCard: {
    padding: Spacing.md,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeLabel: {
    ...Typography.bodyMedium,
    color: Colors.text.secondary,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent.ghost,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.md,
    gap: Spacing.xxs,
  },
  timeValue: {
    ...Typography.bodySemibold,
    color: Colors.accent.primary,
  },
  timeChevron: {
    fontSize: 14,
    color: Colors.accent.primary,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border.subtle,
  },
  timeOption: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.md,
    backgroundColor: Colors.bg.subtle,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  timeOptionActive: {
    backgroundColor: Colors.accent.ghost,
    borderColor: Colors.accent.primary,
  },
  timeOptionText: {
    ...Typography.captionMedium,
    color: Colors.text.tertiary,
  },
  timeOptionTextActive: {
    color: Colors.accent.primary,
  },
});
