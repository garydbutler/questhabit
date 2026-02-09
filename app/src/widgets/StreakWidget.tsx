import { Text, VStack, HStack, Image } from '@expo/ui/swift-ui';
import {
  font,
  foregroundStyle,
  frame,
  padding,
  background,
} from '@expo/ui/swift-ui/modifiers';
import { WidgetBase } from 'expo-widgets';

export type StreakWidgetProps = {
  currentStreak: number;
  bestStreak: number;
  habitName?: string;
};

/**
 * Streak Widget - Shows current streak count with fire emoji
 * Supports: systemSmall, accessoryCircular
 */
export const StreakWidget = (props: WidgetBase<StreakWidgetProps>) => {
  const { currentStreak, bestStreak, habitName, family } = props;

  // Colors
  const bgColor = '#0F0F0F';
  const textPrimary = '#FFFFFF';
  const textSecondary = '#A1A1A1';
  const streakOrange = '#F97316';
  const streakRed = '#EF4444';

  // Determine streak intensity color
  const getStreakColor = (streak: number) => {
    if (streak >= 30) return '#EF4444'; // Red hot
    if (streak >= 14) return '#F97316'; // Orange
    if (streak >= 7) return '#FBBF24'; // Yellow
    return '#6366F1'; // Default purple
  };

  const streakColor = getStreakColor(currentStreak);

  // Lock screen circular widget
  if (family === 'accessoryCircular') {
    return (
      <VStack
        modifiers={[
          frame({ maxWidth: 'infinity', maxHeight: 'infinity' }),
        ]}
      >
        <Text
          modifiers={[
            font({ size: 20, weight: 'bold' }),
            foregroundStyle(textPrimary),
          ]}
        >
          {currentStreak}
        </Text>
        <Text
          modifiers={[
            font({ size: 10 }),
            foregroundStyle(textSecondary),
          ]}
        >
          streak
        </Text>
      </VStack>
    );
  }

  // systemSmall - main home screen widget
  return (
    <VStack
      modifiers={[
        padding({ all: 12 }),
        background(bgColor),
        frame({ maxWidth: 'infinity', maxHeight: 'infinity' }),
      ]}
    >
      {/* Title */}
      <Text
        modifiers={[
          font({ size: 12, weight: 'medium' }),
          foregroundStyle(textSecondary),
        ]}
      >
        {habitName || 'Best Streak'}
      </Text>

      {/* Fire emoji and streak count */}
      <VStack modifiers={[padding({ top: 8 })]}>
        <HStack>
          <Text
            modifiers={[
              font({ size: 32 }),
            ]}
          >
            {currentStreak > 0 ? '🔥' : '❄️'}
          </Text>
        </HStack>
        <Text
          modifiers={[
            font({ size: 36, weight: 'bold' }),
            foregroundStyle(currentStreak > 0 ? streakColor : textSecondary),
            padding({ top: 4 }),
          ]}
        >
          {currentStreak}
        </Text>
        <Text
          modifiers={[
            font({ size: 14, weight: 'medium' }),
            foregroundStyle(textPrimary),
          ]}
        >
          day{currentStreak !== 1 ? 's' : ''}
        </Text>
      </VStack>

      {/* Best streak comparison */}
      {bestStreak > currentStreak && (
        <Text
          modifiers={[
            font({ size: 11 }),
            foregroundStyle(textSecondary),
            padding({ top: 8 }),
          ]}
        >
          Best: {bestStreak} days
        </Text>
      )}

      {currentStreak >= bestStreak && currentStreak > 0 && (
        <Text
          modifiers={[
            font({ size: 11, weight: 'semibold' }),
            foregroundStyle('#22C55E'),
            padding({ top: 8 }),
          ]}
        >
          Personal best!
        </Text>
      )}
    </VStack>
  );
};

export default StreakWidget;
