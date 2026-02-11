# QuestHabit Android Home Screen Widgets

Add QuestHabit widgets to your Android home screen for quick habit progress tracking!

## Available Widgets

### 1. Daily Progress Widget
**Sizes:** 2x2 (small), 4x2 (wide)

Shows your daily habit completion at a glance:
- Circular progress indicator with percentage
- Completed habits count (e.g., "3/5 habits")
- Level and XP progress (wide size only)
- Motivational message

### 2. Streak Tracker Widget
**Size:** 2x2

Keep an eye on your habit streaks:
- Current streak count with fire indicator
- Streak tier colors (Bronze < 7, Green 7+, Amber 14+, Gold 30+)
- Personal best comparison
- Habit name with longest streak

### 3. Level Progress Widget
**Sizes:** 2x2 (small), 4x2 (wide)

Track your XP and level progression:
- Level badge with tier colors (Bronze/Silver/Gold/Diamond)
- XP progress bar to next level
- Total XP count (wide size only)
- Today's XP gains (wide size only)

## How to Add Widgets

1. Long press on your Android home screen
2. Tap "Widgets"
3. Scroll to find "QuestHabit"
4. Drag your preferred widget to the home screen
5. Resize if desired (Progress and Level widgets)

## Widget Updates

Widgets update automatically:
- After completing or uncompleting a habit
- When opening the app
- Every 30 minutes in the background

## Technical Notes

**Minimum Android Version:** Android 8.0 (API 26)

**Permissions:** No additional permissions required

**Battery Impact:** Minimal - widgets update on user actions and at 30-minute intervals

## Development

Widgets are built with `react-native-android-widget` and use React components for UI.

### Key Files

- `widget-task-handler.tsx` - Main entry point for widget rendering
- `HabitProgressWidget.tsx` - Daily progress widget component
- `StreakWidget.tsx` - Streak tracker widget component
- `LevelWidget.tsx` - Level progress widget component
- `theme.ts` - Shared color palette and utilities

### Data Storage

Widget data is stored in AsyncStorage under key `questhabit_widget_data` and includes:
- Completed habits count
- Total habits for today
- Current/best streaks
- Total XP and level info
- Last update timestamp

### Testing

Widgets require a development build (not Expo Go):

```bash
# Build development client
npx expo run:android

# Or create a preview build
eas build --profile preview --platform android
```
