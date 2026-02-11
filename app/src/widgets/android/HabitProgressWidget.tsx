import React from 'react';
import {
  FlexWidget,
  TextWidget,
  OverlapWidget,
  SvgWidget,
} from 'react-native-android-widget';
import { WidgetTheme, getProgressColor, getMotivationalMessage } from './theme';

export interface HabitProgressWidgetProps {
  completedCount: number;
  totalCount: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  isLarge?: boolean;
}

/**
 * Create a circular progress indicator SVG
 */
function createProgressCircle(progress: number, size: number, color: string): string {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference * (1 - progress);
  const cx = size / 2;
  const cy = size / 2;

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <!-- Background circle -->
      <circle 
        cx="${cx}" 
        cy="${cy}" 
        r="${radius}" 
        fill="none" 
        stroke="${WidgetTheme.bg.tertiary}" 
        stroke-width="${strokeWidth}"
      />
      <!-- Progress circle -->
      <circle 
        cx="${cx}" 
        cy="${cy}" 
        r="${radius}" 
        fill="none" 
        stroke="${color}" 
        stroke-width="${strokeWidth}"
        stroke-dasharray="${strokeDasharray}"
        stroke-dashoffset="${strokeDashoffset}"
        stroke-linecap="round"
        transform="rotate(-90 ${cx} ${cy})"
      />
    </svg>
  `;
}

/**
 * Habit Progress Widget for Android
 * Shows daily habit completion percentage with level info
 */
export function HabitProgressWidget({
  completedCount,
  totalCount,
  level,
  xp,
  xpToNextLevel,
  isLarge = false,
}: HabitProgressWidgetProps) {
  const progress = totalCount > 0 ? completedCount / totalCount : 0;
  const percentage = Math.round(progress * 100);
  const progressColor = getProgressColor(progress);
  const circleSize = isLarge ? 70 : 60;

  if (!isLarge) {
    // Small widget - compact view
    return (
      <FlexWidget
        style={{
          height: 'match_parent',
          width: 'match_parent',
          backgroundColor: WidgetTheme.bg.primary,
          borderRadius: WidgetTheme.radius.lg,
          padding: 12,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        clickAction="OPEN_APP"
      >
        {/* Title */}
        <TextWidget
          text="Today's Progress"
          style={{
            fontSize: 12,
            fontWeight: '500',
            color: WidgetTheme.text.secondary,
            marginBottom: 8,
          }}
        />

        {/* Progress Circle */}
        <OverlapWidget
          style={{
            width: circleSize,
            height: circleSize,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SvgWidget
            svg={createProgressCircle(progress, circleSize, progressColor)}
            style={{
              width: circleSize,
              height: circleSize,
            }}
          />
          <TextWidget
            text={`${percentage}%`}
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: WidgetTheme.text.primary,
            }}
          />
        </OverlapWidget>

        {/* Count */}
        <TextWidget
          text={`${completedCount}/${totalCount} habits`}
          style={{
            fontSize: 13,
            fontWeight: '600',
            color: WidgetTheme.text.primary,
            marginTop: 8,
          }}
        />
      </FlexWidget>
    );
  }

  // Large widget - detailed view with XP
  const xpProgress = xpToNextLevel > 0 ? (xp / xpToNextLevel) * 100 : 0;

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: WidgetTheme.bg.primary,
        borderRadius: WidgetTheme.radius.lg,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
      }}
      clickAction="OPEN_APP"
    >
      {/* Left side - Progress Circle */}
      <FlexWidget
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          width: 100,
        }}
      >
        <TextWidget
          text="Today's Progress"
          style={{
            fontSize: 11,
            fontWeight: '500',
            color: WidgetTheme.text.secondary,
            marginBottom: 6,
          }}
        />

        <OverlapWidget
          style={{
            width: circleSize,
            height: circleSize,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SvgWidget
            svg={createProgressCircle(progress, circleSize, progressColor)}
            style={{
              width: circleSize,
              height: circleSize,
            }}
          />
          <TextWidget
            text={`${percentage}%`}
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: progress >= 1 ? WidgetTheme.accent.success : WidgetTheme.text.primary,
            }}
          />
        </OverlapWidget>

        <TextWidget
          text={`${completedCount} of ${totalCount}`}
          style={{
            fontSize: 12,
            fontWeight: '500',
            color: WidgetTheme.text.primary,
            marginTop: 4,
          }}
        />
      </FlexWidget>

      {/* Right side - Level & XP */}
      <FlexWidget
        style={{
          flex: 1,
          flexDirection: 'column',
          marginLeft: 16,
          justifyContent: 'center',
        }}
      >
        {/* Level */}
        <TextWidget
          text={`Level ${level}`}
          style={{
            fontSize: 14,
            fontWeight: 'bold',
            color: WidgetTheme.accent.primary,
            marginBottom: 8,
          }}
        />

        {/* XP Progress Bar */}
        <FlexWidget
          style={{
            width: 'match_parent',
            height: 8,
            backgroundColor: WidgetTheme.bg.tertiary,
            borderRadius: 4,
          }}
        >
          <FlexWidget
            style={{
              width: `${Math.max(4, xpProgress)}%`,
              height: 8,
              backgroundColor: WidgetTheme.accent.xp,
              borderRadius: 4,
            }}
          />
        </FlexWidget>

        <TextWidget
          text={`${xp} / ${xpToNextLevel} XP`}
          style={{
            fontSize: 11,
            color: WidgetTheme.text.secondary,
            marginTop: 4,
          }}
        />

        {/* Motivational message */}
        <TextWidget
          text={getMotivationalMessage(progress)}
          style={{
            fontSize: 11,
            fontWeight: '500',
            color: progressColor,
            marginTop: 8,
          }}
        />
      </FlexWidget>
    </FlexWidget>
  );
}

export default HabitProgressWidget;
