/**
 * QuestHabit Home Screen Widgets
 *
 * Cross-platform widget support for iOS and Android.
 *
 * iOS Widgets (via expo-widgets):
 * - Handled in separate feature/ios-home-widgets branch
 * - Uses SwiftUI for native iOS widget rendering
 *
 * Android Widgets (via react-native-android-widget):
 * - Three widget types: Progress, Streak, Level
 * - Automatic updates on habit actions
 * - Background refresh every 30 minutes
 */

export { WidgetService, type WidgetData, type StoredWidgetData } from './WidgetService';

// Android widget exports
export {
  HabitProgressWidget,
  StreakWidget,
  LevelWidget,
  widgetTaskHandler,
  WidgetTheme,
} from './android';
