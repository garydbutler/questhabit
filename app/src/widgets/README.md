# QuestHabit iOS Home Screen Widgets

This module provides iOS Home Screen Widgets for QuestHabit, allowing users to see their habit progress, streaks, and level directly on their home screen without opening the app.

## Features

### 1. Daily Progress Widget
- **Sizes:** Small, Medium
- **Shows:** Today's habit completion (X of Y), Level, XP progress
- **Updates:** After each habit completion

### 2. Streak Widget
- **Sizes:** Small, Lock Screen Circular
- **Shows:** Current best streak with fire emoji, Best streak comparison
- **Updates:** After each habit completion

### 3. Level Widget
- **Sizes:** Small, Medium
- **Shows:** Current level, XP progress bar, Recent XP gains
- **Updates:** After each habit completion

## Requirements

- **iOS 17+** (for modern widget support)
- **Development build** (widgets don't work in Expo Go)
- **Expo SDK 55+**

## Configuration

Widgets are configured in `app.json`:

```json
{
  "expo": {
    "plugins": [
      ["expo-widgets", {
        "groupIdentifier": "group.com.questhabit.app",
        "widgets": [
          {
            "name": "HabitProgressWidget",
            "displayName": "Daily Progress",
            "description": "Track your daily habit completion at a glance",
            "supportedFamilies": ["systemSmall", "systemMedium"]
          }
        ]
      }]
    ]
  }
}
```

## Usage

The widgets are automatically updated when:
1. User completes a habit
2. User uncompletes a habit
3. App launches / comes to foreground
4. Habits are refreshed

### Manual Update

```typescript
import { useHabitStore } from './stores/habitStore';

// Update widgets with optional recent XP gain highlight
useHabitStore.getState().updateWidgets(25); // +25 XP
```

## Architecture

```
src/widgets/
├── index.ts              # Exports
├── WidgetService.ts      # Main service for updating widgets
├── HabitProgressWidget.tsx  # Daily progress widget
├── StreakWidget.tsx      # Streak tracking widget
├── LevelWidget.tsx       # Level/XP widget
└── README.md             # This file
```

## Building

To test widgets, you need a development build:

```bash
# Create development build
npx expo prebuild
npx expo run:ios

# Or use EAS Build
eas build --profile development --platform ios
```

## Design Notes

- Uses QuestHabit's dark theme colors
- Matches the app's gamification aesthetic
- Fire emoji for streaks, gold for XP
- Level colors tier up: Indigo -> Green -> Blue -> Purple -> Red

## Troubleshooting

### Widgets not appearing
- Widgets require a development build, not Expo Go
- Make sure app group identifier matches
- Try removing and re-adding the widget

### Data not updating
- Check console for WidgetService errors
- Ensure Supabase connection is active
- Widget updates are async and non-blocking

## Future Improvements

- [ ] Android widget support (when expo-widgets adds it)
- [ ] Lock screen widgets for iOS
- [ ] Interactive widgets (complete habits from widget)
- [ ] Live Activities for active quests
