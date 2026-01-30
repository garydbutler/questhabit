/**
 * QuestHabit — Local Push Notification Service
 *
 * Uses expo-notifications for scheduled habit reminders.
 * Each habit can have a daily reminder at a user-chosen time.
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATION_PREFS_KEY = '@questhabit:notification_prefs';

// ─── TYPES ───────────────────────────────────────────────────────

export interface NotificationPrefs {
  enabled: boolean;
  dailyReminder: boolean;
  dailyReminderTime: string; // HH:mm
  habitReminders: boolean;
  streakWarnings: boolean;
  achievements: boolean;
}

export const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  enabled: true,
  dailyReminder: true,
  dailyReminderTime: '08:00',
  habitReminders: true,
  streakWarnings: true,
  achievements: true,
};

// ─── CONFIGURATION ───────────────────────────────────────────────

/** Configure how notifications behave when the app is in the foreground. */
export function configureNotifications(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

// ─── PERMISSIONS ─────────────────────────────────────────────────

/** Request notification permissions. Returns true if granted. */
export async function requestPermissions(): Promise<boolean> {
  if (!Device.isDevice) {
    console.log('Notifications require a physical device');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Notification permissions not granted');
    return false;
  }

  // Android: create notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('habit-reminders', {
      name: 'Habit Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#06B6D4',
      sound: 'default',
    });

    await Notifications.setNotificationChannelAsync('streak-warnings', {
      name: 'Streak Warnings',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 400, 200, 400],
      lightColor: '#F97316',
      sound: 'default',
    });

    await Notifications.setNotificationChannelAsync('achievements', {
      name: 'Achievements',
      importance: Notifications.AndroidImportance.DEFAULT,
      lightColor: '#F59E0B',
      sound: 'default',
    });
  }

  return true;
}

// ─── PREFERENCES ─────────────────────────────────────────────────

/** Load saved notification preferences from AsyncStorage. */
export async function loadNotificationPrefs(): Promise<NotificationPrefs> {
  try {
    const raw = await AsyncStorage.getItem(NOTIFICATION_PREFS_KEY);
    if (raw) {
      return { ...DEFAULT_NOTIFICATION_PREFS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to load notification prefs:', e);
  }
  return DEFAULT_NOTIFICATION_PREFS;
}

/** Save notification preferences to AsyncStorage. */
export async function saveNotificationPrefs(prefs: NotificationPrefs): Promise<void> {
  try {
    await AsyncStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.error('Failed to save notification prefs:', e);
  }
}

// ─── SCHEDULING ──────────────────────────────────────────────────

/**
 * Schedule a daily habit reminder notification.
 * Returns the notification identifier (for cancelling later).
 */
export async function scheduleHabitReminder(
  habitId: string,
  habitName: string,
  habitIcon: string,
  timeString: string, // "HH:mm"
): Promise<string | null> {
  try {
    const [hours, minutes] = timeString.split(':').map(Number);

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `${habitIcon} Time for your quest!`,
        body: `Don't forget: ${habitName}`,
        data: { type: 'habit_reminder', habitId },
        sound: 'default',
        ...(Platform.OS === 'android' && { channelId: 'habit-reminders' }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: hours,
        minute: minutes,
      },
    });

    // Persist the mapping so we can cancel later
    await saveReminderMapping(habitId, id);
    return id;
  } catch (e) {
    console.error('Failed to schedule habit reminder:', e);
    return null;
  }
}

/**
 * Schedule the global daily summary reminder.
 * "You have N quests waiting today!"
 */
export async function scheduleDailyReminder(
  timeString: string, // "HH:mm"
): Promise<string | null> {
  try {
    // Cancel any existing daily reminder first
    await cancelDailyReminder();

    const [hours, minutes] = timeString.split(':').map(Number);

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Your quests await!',
        body: 'Start your day strong — check your habits.',
        data: { type: 'daily_reminder' },
        sound: 'default',
        ...(Platform.OS === 'android' && { channelId: 'habit-reminders' }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: hours,
        minute: minutes,
      },
    });

    await AsyncStorage.setItem('@questhabit:daily_reminder_id', id);
    return id;
  } catch (e) {
    console.error('Failed to schedule daily reminder:', e);
    return null;
  }
}

/**
 * Schedule a streak warning notification for evening.
 * Fires if the user hasn't completed all habits by this time.
 */
export async function scheduleStreakWarning(
  incompleteCount: number,
): Promise<string | null> {
  try {
    // Cancel previous streak warning
    const existingId = await AsyncStorage.getItem('@questhabit:streak_warning_id');
    if (existingId) {
      await Notifications.cancelScheduledNotificationAsync(existingId);
    }

    if (incompleteCount <= 0) return null;

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Don\'t break your streak!',
        body: `You still have ${incompleteCount} quest${incompleteCount > 1 ? 's' : ''} left today.`,
        data: { type: 'streak_warning' },
        sound: 'default',
        ...(Platform.OS === 'android' && { channelId: 'streak-warnings' }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 1, // We schedule this dynamically, so fire soon
        repeats: false,
      },
    });

    await AsyncStorage.setItem('@questhabit:streak_warning_id', id);
    return id;
  } catch (e) {
    console.error('Failed to schedule streak warning:', e);
    return null;
  }
}

/**
 * Send an achievement unlocked notification immediately.
 */
export async function sendAchievementNotification(
  achievementName: string,
  xpBonus: number,
): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Achievement Unlocked!',
        body: `${achievementName} — +${xpBonus} XP bonus!`,
        data: { type: 'achievement' },
        sound: 'default',
        ...(Platform.OS === 'android' && { channelId: 'achievements' }),
      },
      trigger: null, // Fire immediately
    });
  } catch (e) {
    console.error('Failed to send achievement notification:', e);
  }
}

// ─── CANCELLATION ────────────────────────────────────────────────

/** Cancel the reminder for a specific habit. */
export async function cancelHabitReminder(habitId: string): Promise<void> {
  try {
    const notifId = await getReminderMapping(habitId);
    if (notifId) {
      await Notifications.cancelScheduledNotificationAsync(notifId);
      await removeReminderMapping(habitId);
    }
  } catch (e) {
    console.error('Failed to cancel habit reminder:', e);
  }
}

/** Cancel the global daily reminder. */
export async function cancelDailyReminder(): Promise<void> {
  try {
    const id = await AsyncStorage.getItem('@questhabit:daily_reminder_id');
    if (id) {
      await Notifications.cancelScheduledNotificationAsync(id);
      await AsyncStorage.removeItem('@questhabit:daily_reminder_id');
    }
  } catch (e) {
    console.error('Failed to cancel daily reminder:', e);
  }
}

/** Cancel ALL scheduled notifications. */
export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await AsyncStorage.removeItem('@questhabit:reminder_mappings');
    await AsyncStorage.removeItem('@questhabit:daily_reminder_id');
    await AsyncStorage.removeItem('@questhabit:streak_warning_id');
  } catch (e) {
    console.error('Failed to cancel all notifications:', e);
  }
}

// ─── INTERNAL MAPPING (habitId -> notificationId) ────────────────

const MAPPING_KEY = '@questhabit:reminder_mappings';

async function saveReminderMapping(habitId: string, notifId: string): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(MAPPING_KEY);
    const mappings: Record<string, string> = raw ? JSON.parse(raw) : {};
    mappings[habitId] = notifId;
    await AsyncStorage.setItem(MAPPING_KEY, JSON.stringify(mappings));
  } catch (e) {
    console.error('Failed to save reminder mapping:', e);
  }
}

async function getReminderMapping(habitId: string): Promise<string | null> {
  try {
    const raw = await AsyncStorage.getItem(MAPPING_KEY);
    if (!raw) return null;
    const mappings: Record<string, string> = JSON.parse(raw);
    return mappings[habitId] || null;
  } catch (e) {
    console.error('Failed to get reminder mapping:', e);
    return null;
  }
}

async function removeReminderMapping(habitId: string): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(MAPPING_KEY);
    if (!raw) return;
    const mappings: Record<string, string> = JSON.parse(raw);
    delete mappings[habitId];
    await AsyncStorage.setItem(MAPPING_KEY, JSON.stringify(mappings));
  } catch (e) {
    console.error('Failed to remove reminder mapping:', e);
  }
}

// ─── DEBUG ───────────────────────────────────────────────────────

/** List all currently scheduled notifications (for debugging). */
export async function listScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  return Notifications.getAllScheduledNotificationsAsync();
}
