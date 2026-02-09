import { Text, VStack, HStack, ZStack } from '@expo/ui/swift-ui';
import {
  font,
  foregroundStyle,
  frame,
  padding,
  background,
  cornerRadius,
} from '@expo/ui/swift-ui/modifiers';
import { WidgetBase } from 'expo-widgets';

export type LevelWidgetProps = {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  recentXPGain?: number;
};

/**
 * Level Widget - Shows current level and XP progress
 * Supports: systemSmall, systemMedium
 */
export const LevelWidget = (props: WidgetBase<LevelWidgetProps>) => {
  const { level, currentXP, xpToNextLevel, totalXP, recentXPGain, family } = props;
  const progress = xpToNextLevel > 0 ? currentXP / xpToNextLevel : 0;
  const percentage = Math.round(progress * 100);

  // Colors
  const bgColor = '#0F0F0F';
  const cardBg = '#1A1A1A';
  const accentColor = '#6366F1';
  const xpGold = '#FBBF24';
  const textPrimary = '#FFFFFF';
  const textSecondary = '#A1A1A1';

  // Get level badge color based on level tier
  const getLevelColor = (lvl: number) => {
    if (lvl >= 50) return '#EF4444'; // Red (legendary)
    if (lvl >= 25) return '#A855F7'; // Purple (epic)
    if (lvl >= 10) return '#3B82F6'; // Blue (rare)
    if (lvl >= 5) return '#22C55E'; // Green (uncommon)
    return '#6366F1'; // Indigo (common)
  };

  const levelColor = getLevelColor(level);

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
          Your Level
        </Text>

        {/* Level number */}
        <VStack modifiers={[padding({ top: 8 })]}>
          <Text
            modifiers={[
              font({ size: 12, weight: 'bold' }),
              foregroundStyle(textSecondary),
            ]}
          >
            LVL
          </Text>
          <Text
            modifiers={[
              font({ size: 48, weight: 'bold' }),
              foregroundStyle(levelColor),
            ]}
          >
            {level}
          </Text>
        </VStack>

        {/* XP Progress bar */}
        <VStack modifiers={[padding({ top: 8 }), frame({ maxWidth: 'infinity' })]}>
          <ZStack modifiers={[frame({ height: 6, maxWidth: 'infinity' })]}>
            <VStack
              modifiers={[
                frame({ height: 6, maxWidth: 'infinity' }),
                background('#252525'),
                cornerRadius(3),
              ]}
            />
            <HStack modifiers={[frame({ height: 6 })]}>
              <VStack
                modifiers={[
                  frame({
                    height: 6,
                    width: Math.max(4, progress * 100),
                  }),
                  background(xpGold),
                  cornerRadius(3),
                ]}
              />
            </HStack>
          </ZStack>
          <Text
            modifiers={[
              font({ size: 10 }),
              foregroundStyle(textSecondary),
              padding({ top: 2 }),
            ]}
          >
            {currentXP}/{xpToNextLevel} XP
          </Text>
        </VStack>
      </VStack>
    );
  }

  // systemMedium - more detailed layout
  return (
    <HStack
      modifiers={[
        padding({ all: 16 }),
        background(bgColor),
        frame({ maxWidth: 'infinity', maxHeight: 'infinity' }),
      ]}
    >
      {/* Left side - Level badge */}
      <VStack modifiers={[frame({ width: 90 })]}>
        <Text
          modifiers={[
            font({ size: 12, weight: 'medium' }),
            foregroundStyle(textSecondary),
          ]}
        >
          Your Level
        </Text>
        <VStack
          modifiers={[
            padding({ all: 8 }),
            background(cardBg),
            cornerRadius(12),
            frame({ width: 80, height: 80 }),
          ]}
        >
          <Text
            modifiers={[
              font({ size: 10, weight: 'bold' }),
              foregroundStyle(levelColor),
            ]}
          >
            LVL
          </Text>
          <Text
            modifiers={[
              font({ size: 36, weight: 'bold' }),
              foregroundStyle(levelColor),
            ]}
          >
            {level}
          </Text>
        </VStack>
      </VStack>

      {/* Right side - XP details */}
      <VStack modifiers={[frame({ maxWidth: 'infinity' }), padding({ leading: 16 })]}>
        {/* Total XP */}
        <HStack>
          <Text
            modifiers={[
              font({ size: 22, weight: 'bold' }),
              foregroundStyle(xpGold),
            ]}
          >
            {totalXP.toLocaleString()}
          </Text>
          <Text
            modifiers={[
              font({ size: 14, weight: 'medium' }),
              foregroundStyle(textSecondary),
              padding({ leading: 4 }),
            ]}
          >
            XP
          </Text>
        </HStack>

        {/* Progress to next level */}
        <VStack modifiers={[padding({ top: 12 })]}>
          <Text
            modifiers={[
              font({ size: 11 }),
              foregroundStyle(textSecondary),
            ]}
          >
            Next level: {xpToNextLevel - currentXP} XP needed
          </Text>

          <ZStack modifiers={[frame({ height: 8, maxWidth: 'infinity' }), padding({ top: 4 })]}>
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
                    width: Math.max(4, progress * 150),
                  }),
                  background(xpGold),
                  cornerRadius(4),
                ]}
              />
            </HStack>
          </ZStack>

          <Text
            modifiers={[
              font({ size: 12, weight: 'medium' }),
              foregroundStyle(textPrimary),
              padding({ top: 4 }),
            ]}
          >
            {percentage}% to Level {level + 1}
          </Text>
        </VStack>

        {/* Recent XP gain */}
        {recentXPGain && recentXPGain > 0 && (
          <Text
            modifiers={[
              font({ size: 11, weight: 'semibold' }),
              foregroundStyle('#22C55E'),
              padding({ top: 8 }),
            ]}
          >
            +{recentXPGain} XP today
          </Text>
        )}
      </VStack>
    </HStack>
  );
};

export default LevelWidget;
