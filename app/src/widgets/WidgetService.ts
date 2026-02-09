import { Platform } from 'react-native';
import { updateWidgetSnapshot } from 'expo-widgets';
import { HabitProgressWidget, HabitProgressWidgetProps } from './HabitProgressWidget';
import { StreakWidget, StreakWidgetProps } from './StreakWidget';
import { LevelWidget, LevelWidgetProps } from './LevelWidget';

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
    // After level 10, double each time
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

/**
 * Service for updating iOS Home Screen Widgets
 * Widgets only work on iOS and require a development build (not Expo Go)
 */
export class WidgetService {
  private static isSupported(): boolean {
    return Platform.OS === 'ios';
  }

  /**
   * Update all widgets with the latest data
   */
  static updateAllWidgets(data: WidgetData): void {
    if (!this.isSupported()) {
      console.log('[WidgetService] Widgets not supported on this platform');
      return;
    }

    try {
      this.updateHabitProgressWidget(data);
      this.updateStreakWidget(data);
      this.updateLevelWidget(data);
      console.log('[WidgetService] All widgets updated successfully');
    } catch (error) {
      console.error('[WidgetService] Error updating widgets:', error);
    }
  }

  /**
   * Update the Daily Progress widget
   */
  static updateHabitProgressWidget(data: WidgetData): void {
    if (!this.isSupported()) return;

    const level = getLevel(data.totalXP);
    const xpInCurrentLevel = getCurrentLevelXP(data.totalXP);
    const xpNeededForLevel = getXPNeededForLevel(level);

    const props: HabitProgressWidgetProps = {
      completedCount: data.completedToday,
      totalCount: data.totalToday,
      level,
      xp: xpInCurrentLevel,
      xpToNextLevel: xpNeededForLevel,
    };

    try {
      updateWidgetSnapshot('HabitProgressWidget', HabitProgressWidget, props);
    } catch (error) {
      console.error('[WidgetService] Error updating HabitProgressWidget:', error);
    }
  }

  /**
   * Update the Streak widget
   */
  static updateStreakWidget(data: WidgetData): void {
    if (!this.isSupported()) return;

    const props: StreakWidgetProps = {
      currentStreak: data.currentStreak,
      bestStreak: data.bestStreak,
      habitName: data.streakHabitName,
    };

    try {
      updateWidgetSnapshot('StreakWidget', StreakWidget, props);
    } catch (error) {
      console.error('[WidgetService] Error updating StreakWidget:', error);
    }
  }

  /**
   * Update the Level widget
   */
  static updateLevelWidget(data: WidgetData): void {
    if (!this.isSupported()) return;

    const level = getLevel(data.totalXP);
    const xpInCurrentLevel = getCurrentLevelXP(data.totalXP);
    const xpNeededForLevel = getXPNeededForLevel(level);

    const props: LevelWidgetProps = {
      level,
      currentXP: xpInCurrentLevel,
      xpToNextLevel: xpNeededForLevel,
      totalXP: data.totalXP,
      recentXPGain: data.recentXPGain,
    };

    try {
      updateWidgetSnapshot('LevelWidget', LevelWidget, props);
    } catch (error) {
      console.error('[WidgetService] Error updating LevelWidget:', error);
    }
  }

  /**
   * Convenience method to update widgets after a habit completion
   */
  static onHabitCompleted(data: WidgetData): void {
    this.updateAllWidgets(data);
  }

  /**
   * Convenience method to update widgets on app foreground
   */
  static onAppForeground(data: WidgetData): void {
    this.updateAllWidgets(data);
  }
}
