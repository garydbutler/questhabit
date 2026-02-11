import AsyncStorage from '@react-native-async-storage/async-storage';

import { HabitProgressWidget } from './HabitProgressWidget';
import { StreakWidget } from './StreakWidget';
import { LevelWidget } from './LevelWidget';

const WIDGET_DATA_KEY = 'questhabit_widget_data';

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

const defaultWidgetData: StoredWidgetData = {
  completedToday: 0,
  totalToday: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalXP: 0,
  level: 1,
  xpInCurrentLevel: 0,
  xpNeededForLevel: 100,
  lastUpdated: Date.now(),
};

async function getWidgetData(): Promise<StoredWidgetData> {
  try {
    const stored = await AsyncStorage.getItem(WIDGET_DATA_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('[WidgetTaskHandler] Error reading widget data:', error);
  }
  return defaultWidgetData;
}

export async function widgetTaskHandler(props: {
  widgetName: string;
  widgetAction: string;
  clickAction?: string;
  clickActionData?: Record<string, unknown>;
  widgetInfo?: {
    widgetId: number;
    width: number;
    height: number;
  };
}) {
  const { widgetName, widgetAction, clickAction, widgetInfo } = props;

  console.log(`[WidgetTaskHandler] ${widgetName} - ${widgetAction}`);

  // Handle click actions
  if (widgetAction === 'WIDGET_CLICK') {
    if (clickAction === 'OPEN_APP') {
      // The app will be opened automatically by react-native-android-widget
      return;
    }
    return;
  }

  // Get stored widget data
  const data = await getWidgetData();
  const isLarge = widgetInfo && widgetInfo.width > 200;

  // Return the appropriate widget based on name
  switch (widgetName) {
    case 'HabitProgressWidget':
      return (
        <HabitProgressWidget
          completedCount={data.completedToday}
          totalCount={data.totalToday}
          level={data.level}
          xp={data.xpInCurrentLevel}
          xpToNextLevel={data.xpNeededForLevel}
          isLarge={isLarge}
        />
      );

    case 'StreakWidget':
      return (
        <StreakWidget
          currentStreak={data.currentStreak}
          bestStreak={data.bestStreak}
          habitName={data.streakHabitName}
        />
      );

    case 'LevelWidget':
      return (
        <LevelWidget
          level={data.level}
          currentXP={data.xpInCurrentLevel}
          xpToNextLevel={data.xpNeededForLevel}
          totalXP={data.totalXP}
          isLarge={isLarge}
        />
      );

    default:
      console.warn(`[WidgetTaskHandler] Unknown widget: ${widgetName}`);
      return null;
  }
}
