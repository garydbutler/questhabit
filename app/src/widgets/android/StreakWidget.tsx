import React from 'react';
import {
  FlexWidget,
  TextWidget,
} from 'react-native-android-widget';
import { WidgetTheme } from './theme';

export interface StreakWidgetProps {
  currentStreak: number;
  bestStreak: number;
  habitName?: string;
}

/**
 * Get streak tier color based on streak length
 */
function getStreakColor(streak: number): string {
  if (streak >= 30) return WidgetTheme.accent.xp;      // Gold for 30+ days
  if (streak >= 14) return WidgetTheme.accent.warning;  // Amber for 14+ days
  if (streak >= 7) return WidgetTheme.accent.success;   // Green for 7+ days
  if (streak >= 1) return WidgetTheme.accent.primary;   // Indigo for active
  return WidgetTheme.text.tertiary;                      // Grey for no streak
}

/**
 * Get streak status message
 */
function getStreakMessage(current: number, best: number): string {
  if (current === 0) return 'Start a streak!';
  if (current >= best && current > 1) return 'Personal best!';
  if (current >= 30) return 'Legendary!';
  if (current >= 14) return 'On fire!';
  if (current >= 7) return 'Week warrior!';
  return 'Keep going!';
}

/**
 * Streak Widget for Android
 * Shows current streak with comparison to personal best
 */
export function StreakWidget({
  currentStreak,
  bestStreak,
  habitName,
}: StreakWidgetProps) {
  const streakColor = getStreakColor(currentStreak);
  const isNewRecord = currentStreak >= bestStreak && currentStreak > 1;
  const message = getStreakMessage(currentStreak, bestStreak);

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: WidgetTheme.bg.primary,
        borderRadius: WidgetTheme.radius.lg,
        padding: 14,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      clickAction="OPEN_APP"
    >
      {/* Fire icon/emoji representation */}
      <FlexWidget
        style={{
          width: 50,
          height: 50,
          backgroundColor: WidgetTheme.bg.secondary,
          borderRadius: 25,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 8,
          borderWidth: currentStreak > 0 ? 2 : 0,
          borderColor: streakColor,
        }}
      >
        <TextWidget
          text={currentStreak > 0 ? '🔥' : '💤'}
          style={{
            fontSize: 24,
          }}
        />
      </FlexWidget>

      {/* Streak count */}
      <FlexWidget
        style={{
          flexDirection: 'row',
          alignItems: 'baseline',
        }}
      >
        <TextWidget
          text={`${currentStreak}`}
          style={{
            fontSize: 32,
            fontWeight: 'bold',
            color: streakColor,
          }}
        />
        <TextWidget
          text=" day"
          style={{
            fontSize: 14,
            fontWeight: '500',
            color: WidgetTheme.text.secondary,
          }}
        />
        <TextWidget
          text={currentStreak !== 1 ? 's' : ''}
          style={{
            fontSize: 14,
            fontWeight: '500',
            color: WidgetTheme.text.secondary,
          }}
        />
      </FlexWidget>

      {/* Message */}
      <TextWidget
        text={message}
        style={{
          fontSize: 12,
          fontWeight: '600',
          color: isNewRecord ? WidgetTheme.accent.xp : streakColor,
          marginTop: 4,
        }}
      />

      {/* Best streak comparison */}
      {bestStreak > 0 && currentStreak < bestStreak && (
        <TextWidget
          text={`Best: ${bestStreak} days`}
          style={{
            fontSize: 10,
            color: WidgetTheme.text.tertiary,
            marginTop: 4,
          }}
        />
      )}

      {/* Habit name if provided */}
      {habitName && (
        <TextWidget
          text={habitName}
          style={{
            fontSize: 10,
            color: WidgetTheme.text.tertiary,
            marginTop: 4,
          }}
          truncate="END"
          maxLines={1}
        />
      )}
    </FlexWidget>
  );
}

export default StreakWidget;
