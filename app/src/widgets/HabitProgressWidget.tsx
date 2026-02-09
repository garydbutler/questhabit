import { Text, VStack, HStack, ZStack, Circle, GeometryReader } from '@expo/ui/swift-ui';
import {
  font,
  foregroundStyle,
  frame,
  padding,
  background,
  cornerRadius,
  overlay,
  opacity,
} from '@expo/ui/swift-ui/modifiers';
import { WidgetBase } from 'expo-widgets';

export type HabitProgressWidgetProps = {
  completedCount: number;
  totalCount: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
};

/**
 * Daily Progress Widget - Shows habit completion for today
 * Supports: systemSmall, systemMedium
 */
export const HabitProgressWidget = (
  props: WidgetBase<HabitProgressWidgetProps>
) => {
  const { completedCount, totalCount, level, xp, xpToNextLevel, family } = props;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;
  const percentage = Math.round(progress * 100);

  // Colors
  const bgColor = '#0F0F0F';
  const cardBg = '#1A1A1A';
  const accentColor = '#6366F1';
  const successColor = '#22C55E';
  const textPrimary = '#FFFFFF';
  const textSecondary = '#A1A1A1';
  const xpGold = '#FBBF24';

  if (family === 'systemSmall') {
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
          Today's Progress
        </Text>

        {/* Progress Circle */}
        <ZStack modifiers={[frame({ width: 70, height: 70 }), padding({ top: 8 })]}>
          {/* Background circle */}
          <Circle
            modifiers={[
              frame({ width: 60, height: 60 }),
              foregroundStyle('#252525'),
            ]}
          />
          {/* Progress indicator */}
          <Circle
            modifiers={[
              frame({ width: 60, height: 60 }),
              foregroundStyle(progress === 1 ? successColor : accentColor),
              opacity(0.3),
            ]}
          />
          {/* Center text */}
          <VStack>
            <Text
              modifiers={[
                font({ size: 20, weight: 'bold' }),
                foregroundStyle(textPrimary),
              ]}
            >
              {percentage}%
            </Text>
          </VStack>
        </ZStack>

        {/* Count */}
        <Text
          modifiers={[
            font({ size: 14, weight: 'semibold' }),
            foregroundStyle(textPrimary),
            padding({ top: 4 }),
          ]}
        >
          {completedCount}/{totalCount} habits
        </Text>
      </VStack>
    );
  }

  // systemMedium - horizontal layout with more details
  return (
    <HStack
      modifiers={[
        padding({ all: 16 }),
        background(bgColor),
        frame({ maxWidth: 'infinity', maxHeight: 'infinity' }),
      ]}
    >
      {/* Left side - Progress */}
      <VStack modifiers={[frame({ width: 100 })]}>
        <Text
          modifiers={[
            font({ size: 12, weight: 'medium' }),
            foregroundStyle(textSecondary),
          ]}
        >
          Today's Progress
        </Text>
        <ZStack modifiers={[frame({ width: 70, height: 70 }), padding({ top: 8 })]}>
          <Circle
            modifiers={[
              frame({ width: 60, height: 60 }),
              foregroundStyle('#252525'),
            ]}
          />
          <VStack>
            <Text
              modifiers={[
                font({ size: 24, weight: 'bold' }),
                foregroundStyle(progress === 1 ? successColor : textPrimary),
              ]}
            >
              {percentage}%
            </Text>
          </VStack>
        </ZStack>
        <Text
          modifiers={[
            font({ size: 13, weight: 'medium' }),
            foregroundStyle(textPrimary),
          ]}
        >
          {completedCount} of {totalCount}
        </Text>
      </VStack>

      {/* Right side - Level & XP */}
      <VStack modifiers={[frame({ maxWidth: 'infinity' }), padding({ leading: 16 })]}>
        <HStack>
          <Text
            modifiers={[
              font({ size: 14, weight: 'bold' }),
              foregroundStyle(accentColor),
            ]}
          >
            Level {level}
          </Text>
        </HStack>

        <VStack modifiers={[padding({ top: 8 })]}>
          {/* XP Progress bar background */}
          <ZStack modifiers={[frame({ height: 8, maxWidth: 'infinity' })]}>
            <VStack
              modifiers={[
                frame({ height: 8, maxWidth: 'infinity' }),
                background('#252525'),
                cornerRadius(4),
              ]}
            />
            <HStack modifiers={[frame({ height: 8 })]}>
              <VStack
                modifiers={[
                  frame({ 
                    height: 8, 
                    width: Math.max(4, (xp / xpToNextLevel) * 100) 
                  }),
                  background(xpGold),
                  cornerRadius(4),
                ]}
              />
            </HStack>
          </ZStack>

          <Text
            modifiers={[
              font({ size: 11 }),
              foregroundStyle(textSecondary),
              padding({ top: 4 }),
            ]}
          >
            {xp} / {xpToNextLevel} XP
          </Text>
        </VStack>

        {/* Motivational message */}
        <Text
          modifiers={[
            font({ size: 11, weight: 'medium' }),
            foregroundStyle(
              progress === 1 
                ? successColor 
                : progress >= 0.5 
                  ? accentColor 
                  : textSecondary
            ),
            padding({ top: 8 }),
          ]}
        >
          {progress === 1
            ? 'Perfect day!'
            : progress >= 0.5
              ? 'Keep it up!'
              : 'Start your quests!'}
        </Text>
      </VStack>
    </HStack>
  );
};

export default HabitProgressWidget;
