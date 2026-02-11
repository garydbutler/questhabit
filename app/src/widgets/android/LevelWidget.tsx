import React from 'react';
import {
  FlexWidget,
  TextWidget,
} from 'react-native-android-widget';
import { WidgetTheme, getLevelTierColor, getLevelTierName } from './theme';

export interface LevelWidgetProps {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  recentXPGain?: number;
  isLarge?: boolean;
}

/**
 * Level Widget for Android
 * Shows level badge with XP progress bar
 */
export function LevelWidget({
  level,
  currentXP,
  xpToNextLevel,
  totalXP,
  recentXPGain,
  isLarge = false,
}: LevelWidgetProps) {
  const tierColor = getLevelTierColor(level);
  const tierName = getLevelTierName(level);
  const xpProgress = xpToNextLevel > 0 ? (currentXP / xpToNextLevel) * 100 : 0;

  if (!isLarge) {
    // Small widget - compact view
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
        {/* Level badge */}
        <FlexWidget
          style={{
            width: 60,
            height: 60,
            backgroundColor: WidgetTheme.bg.secondary,
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 3,
            borderColor: tierColor,
          }}
        >
          <TextWidget
            text={`${level}`}
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: tierColor,
            }}
          />
        </FlexWidget>

        {/* Tier name */}
        <TextWidget
          text={tierName}
          style={{
            fontSize: 12,
            fontWeight: '600',
            color: tierColor,
            marginTop: 8,
          }}
        />

        {/* XP progress bar */}
        <FlexWidget
          style={{
            width: 'match_parent',
            height: 6,
            backgroundColor: WidgetTheme.bg.tertiary,
            borderRadius: 3,
            marginTop: 8,
          }}
        >
          <FlexWidget
            style={{
              width: `${Math.max(4, xpProgress)}%`,
              height: 6,
              backgroundColor: WidgetTheme.accent.xp,
              borderRadius: 3,
            }}
          />
        </FlexWidget>

        {/* XP text */}
        <TextWidget
          text={`${currentXP} / ${xpToNextLevel} XP`}
          style={{
            fontSize: 10,
            color: WidgetTheme.text.secondary,
            marginTop: 4,
          }}
        />
      </FlexWidget>
    );
  }

  // Large widget - detailed view
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
      {/* Left side - Level badge */}
      <FlexWidget
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          width: 90,
        }}
      >
        <FlexWidget
          style={{
            width: 64,
            height: 64,
            backgroundColor: WidgetTheme.bg.secondary,
            borderRadius: 32,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 3,
            borderColor: tierColor,
          }}
        >
          <TextWidget
            text={`${level}`}
            style={{
              fontSize: 30,
              fontWeight: 'bold',
              color: tierColor,
            }}
          />
        </FlexWidget>

        <TextWidget
          text={tierName}
          style={{
            fontSize: 12,
            fontWeight: '600',
            color: tierColor,
            marginTop: 6,
          }}
        />
      </FlexWidget>

      {/* Right side - XP details */}
      <FlexWidget
        style={{
          flex: 1,
          flexDirection: 'column',
          marginLeft: 16,
          justifyContent: 'center',
        }}
      >
        {/* Total XP */}
        <FlexWidget
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <TextWidget
            text="Total XP: "
            style={{
              fontSize: 12,
              color: WidgetTheme.text.secondary,
            }}
          />
          <TextWidget
            text={`${totalXP.toLocaleString()}`}
            style={{
              fontSize: 14,
              fontWeight: 'bold',
              color: WidgetTheme.accent.xp,
            }}
          />
        </FlexWidget>

        {/* Progress to next level */}
        <TextWidget
          text={`Level ${level + 1} Progress`}
          style={{
            fontSize: 11,
            color: WidgetTheme.text.secondary,
            marginTop: 12,
          }}
        />

        {/* XP Progress Bar */}
        <FlexWidget
          style={{
            width: 'match_parent',
            height: 10,
            backgroundColor: WidgetTheme.bg.tertiary,
            borderRadius: 5,
            marginTop: 6,
          }}
        >
          <FlexWidget
            style={{
              width: `${Math.max(4, xpProgress)}%`,
              height: 10,
              backgroundColor: WidgetTheme.accent.xp,
              borderRadius: 5,
            }}
          />
        </FlexWidget>

        <FlexWidget
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 4,
          }}
        >
          <TextWidget
            text={`${currentXP} XP`}
            style={{
              fontSize: 10,
              color: WidgetTheme.text.secondary,
            }}
          />
          <TextWidget
            text={`${xpToNextLevel} XP`}
            style={{
              fontSize: 10,
              color: WidgetTheme.text.secondary,
            }}
          />
        </FlexWidget>

        {/* Recent XP gain */}
        {recentXPGain && recentXPGain > 0 && (
          <TextWidget
            text={`+${recentXPGain} XP today`}
            style={{
              fontSize: 11,
              fontWeight: '600',
              color: WidgetTheme.accent.success,
              marginTop: 6,
            }}
          />
        )}
      </FlexWidget>
    </FlexWidget>
  );
}

export default LevelWidget;
