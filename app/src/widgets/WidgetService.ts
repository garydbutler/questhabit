import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Conditionally import Android widget module
let requestWidgetUpdate: ((widgetName: string) => void) | undefined;
if (Platform.OS === 'android') {
  try {
    const androidWidget = require('react-native-android-widget');
    requestWidgetUpdate = androidWidget.requestWidgetUpdate;
  } catch (e) {
    console.log('[WidgetService] react-native-android-widget not available');
  }
}

// Level thresholds from the app
const LEVEL_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  1000,   // Level 5
  2000,   // Level 6
  4000,   // Level 7
  8000,   // Level 8
  16000,  // Level 9
  32000,  // Level 10
];

function getLevel(totalXP: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}

function getXPForNextLevel(level: number): number {
  if (level >= LEVEL_THRESHOLDS.length) {
    return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] * Math.pow(2, level - 10);
  }
  return LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
}

function getCurrentLevelXP(totalXP: number): number {
  const level = getLevel(totalXP);
  const levelStart = level <= LEVEL_THRESHOLDS.length 
    ? LEVEL_THRESHOLDS[level - 1] 
    : LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] * Math.pow(2, level - 11);
  return totalXP - levelStart;
}

function getXPNeededForLevel(level: number): number {
  const currentThreshold = level <= LEVEL_THRESHOLDS.length 
    ? LEVEL_THRESHOLDS[level - 1] 
    : LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] * Math.pow(2, level - 11);
  const nextThreshold = level < LEVEL_THRESHOLDS.length 
    ? LEVEL_THRESHOLDS[level] 
    : LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] * Math.pow(2, level - 10);
  return nextThreshold - currentThreshold;
}

export interface WidgetData {
  // Habit progress
  completedToday: number;
  totalToday: number;
  
  // Streaks
  currentStreak: number;
  bestStreak: number;
  streakHabitName?: string;
  
  // XP and Level
  totalXP: number;
  recentXPGain?: number;
}

export interface StoredWidgetData {
  completedToday: number;
  totalToday: number;
  currentStreak: number;
  bestStreak: number;
  streakHabitName?: string;
  totalXP: number;
  level: number;
  xpInCurrentLevel: number;
  xpNeededForLevel: number;
  lastUpdated: number;
}

const WIDGET_DATA_KEY = 'questhabit_widget_data';

/**
 * Service for updating Home Screen Widgets on iOS and Android
 * 
 * iOS: Uses expo-widgets (requires development build)
 * Android: Uses react-native-android-widget
 */
export class WidgetService {
  private static isAndroid(): boolean {
    return Platform.OS === 'android';
  }

  private static isIOS(): boolean {
    return Platform.OS === 'ios';
  }

  /**
   * Store widget data for Android widget task handler to access
   */
  private static async storeWidgetData(data: WidgetData): Promise<void> {
    const level = getLevel(data.totalXP);
    const xpInCurrentLevel = getCurrentLevelXP(data.totalXP);
    const xpNeededForLevel = getXPNeededForLevel(level);

    const storedData: StoredWidgetData = {
      completedToday: data.completedToday,
      totalToday: data.totalToday,
      currentStreak: data.currentStreak,
      bestStreak: data.bestStreak,
      streakHabitName: data.streakHabitName,
      totalXP: data.totalXP,
      level,
      xpInCurrentLevel,
      xpNeededForLevel,
      lastUpdated: Date.now(),
    };

    try {
      await AsyncStorage.setItem(WIDGET_DATA_KEY, JSON.stringify(storedData));
    } catch (error) {
      console.error('[WidgetService] Error storing widget data:', error);
    }
  }

  /**
   * Update all widgets with the latest data
   */
  static async updateAllWidgets(data: WidgetData): Promise<void> {
    console.log('[WidgetService] Updating all widgets');

    if (this.isAndroid()) {
      await this.updateAndroidWidgets(data);
    } else if (this.isIOS()) {
      // iOS widgets handled by expo-widgets (when iOS widget branch is merged)
      console.log('[WidgetService] iOS widgets - handled by expo-widgets');
    } else {
      console.log('[WidgetService] Widgets not supported on this platform');
    }
  }

  /**
   * Update Android widgets
   */
  private static async updateAndroidWidgets(data: WidgetData): Promise<void> {
    if (!requestWidgetUpdate) {
      console.log('[WidgetService] Android widget updates not available');
      return;
    }

    try {
      // Store data for widget task handler
      await this.storeWidgetData(data);

      // Request updates for all widget types
      requestWidgetUpdate('HabitProgressWidget');
      requestWidgetUpdate('StreakWidget');
      requestWidgetUpdate('LevelWidget');

      console.log('[WidgetService] Android widgets updated successfully');
    } catch (error) {
      console.error('[WidgetService] Error updating Android widgets:', error);
    }
  }

  /**
   * Convenience method to update widgets after a habit completion
   */
  static async onHabitCompleted(data: WidgetData): Promise<void> {
    await this.updateAllWidgets(data);
  }

  /**
   * Convenience method to update widgets on app foreground
   */
  static async onAppForeground(data: WidgetData): Promise<void> {
    await this.updateAllWidgets(data);
  }

  /**
   * Get stored widget data (for debugging or other purposes)
   */
  static async getStoredData(): Promise<StoredWidgetData | null> {
    try {
      const stored = await AsyncStorage.getItem(WIDGET_DATA_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('[WidgetService] Error reading widget data:', error);
    }
    return null;
  }
}

export default WidgetService;
