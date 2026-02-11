/**
 * Android Home Screen Widgets for QuestHabit
 *
 * Three widgets are available:
 *
 * 1. HabitProgressWidget
 *    - Shows daily habit completion percentage
 *    - Displays current level and XP progress (large size)
 *    - Sizes: 2x2, resizable to 4x2
 *
 * 2. StreakWidget
 *    - Shows current best streak with fire indicator
 *    - Compares to personal best
 *    - Size: 2x2 (fixed)
 *
 * 3. LevelWidget
 *    - Shows level badge with tier colors
 *    - XP progress bar to next level
 *    - Sizes: 2x2, resizable to 4x2
 *
 * Widgets update automatically after:
 * - Habit completion/uncompletion
 * - App launch/refresh
 * - Every 30 minutes (background refresh)
 */

export { HabitProgressWidget } from './HabitProgressWidget';
export { StreakWidget } from './StreakWidget';
export { LevelWidget } from './LevelWidget';
export { widgetTaskHandler } from './widget-task-handler';
export { WidgetTheme, getLevelTierColor, getLevelTierName } from './theme';
export type { StoredWidgetData } from './widget-task-handler';
