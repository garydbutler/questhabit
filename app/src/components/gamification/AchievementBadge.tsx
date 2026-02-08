import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { AchievementType } from '../../types';
import { ACHIEVEMENTS } from '../../constants';
import { Colors, Typography, Spacing, Radius, Shadows, Icons, AchievementIcons } from '../../constants/design';
import { format, parseISO } from 'date-fns';

interface AchievementBadgeProps {
  type: AchievementType;
  unlockedAt?: string;
  progress?: { current: number; target: number };
  compact?: boolean;
  style?: ViewStyle;
}

export function AchievementBadge({
  type,
  unlockedAt,
  progress,
  compact = false,
  style,
}: AchievementBadgeProps) {
  const info = ACHIEVEMENTS[type];
  const iconInfo = AchievementIcons[type];
  const isUnlocked = !!unlockedAt;

  if (compact) {
    return (
      <View style={[styles.compactContainer, style]}>
        <View
          style={[
            styles.compactIconWrap,
            {
              backgroundColor: isUnlocked ? `${iconInfo.color}20` : Colors.bg.subtle,
            },
            isUnlocked && Shadows.glow(iconInfo.color),
          ]}
        >
          <Text
            style={[
              styles.compactIcon,
              { color: isUnlocked ? iconInfo.color : Colors.text.muted },
            ]}
          >
            {isUnlocked ? iconInfo.symbol : Icons.lock}
          </Text>
        </View>
        <Text
          style={[
            styles.compactName,
            { color: isUnlocked ? Colors.text.primary : Colors.text.muted },
          ]}
          numberOfLines={1}
        >
          {info.name}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        isUnlocked && Shadows.glow(iconInfo.color),
        style,
      ]}
    >
      {/* Icon */}
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: isUnlocked ? `${iconInfo.color}20` : Colors.bg.subtle,
            borderColor: isUnlocked ? `${iconInfo.color}30` : Colors.border.subtle,
          },
        ]}
      >
        <Text
          style={[
            styles.icon,
            { color: isUnlocked ? iconInfo.color : Colors.text.muted },
          ]}
        >
          {isUnlocked ? iconInfo.symbol : Icons.lock}
        </Text>
      </View>

      {/* Info */}
      <Text
        style={[
          styles.name,
          { color: isUnlocked ? Colors.text.primary : Colors.text.muted },
        ]}
        numberOfLines={1}
      >
        {info.name}
      </Text>
      <Text
        style={[
          styles.description,
          { color: isUnlocked ? Colors.text.tertiary : Colors.text.muted },
        ]}
        numberOfLines={2}
      >
        {info.description}
      </Text>

      {/* Progress or unlock info */}
      {isUnlocked ? (
        <View style={styles.unlockedRow}>
          <Text style={styles.xpBadgeText}>
            {Icons.xp} +{info.xpBonus}
          </Text>
          <Text style={styles.unlockDate}>
            {format(parseISO(unlockedAt), 'MMM d')}
          </Text>
        </View>
      ) : progress ? (
        <View style={styles.progressWrap}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min((progress.current / progress.target) * 100, 100)}%`,
                  backgroundColor: iconInfo.color,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {progress.current}/{progress.target}
          </Text>
        </View>
      ) : (
        <View style={styles.lockedRow}>
          <Text style={styles.lockedText}>
            {Icons.xp} +{info.xpBonus} XP
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.elevated,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: Spacing.xxs,
  },
  icon: {
    fontSize: 22,
    fontWeight: '700',
  },
  name: {
    ...Typography.captionMedium,
    textAlign: 'center',
  },
  description: {
    ...Typography.caption,
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 15,
  },
  unlockedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: Spacing.xxs,
  },
  xpBadgeText: {
    color: Colors.xp.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  unlockDate: {
    ...Typography.caption,
    color: Colors.text.muted,
    fontSize: 10,
  },
  progressWrap: {
    width: '100%',
    marginTop: Spacing.xxs,
    gap: 3,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border.primary,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    ...Typography.caption,
    color: Colors.text.muted,
    fontSize: 10,
    textAlign: 'right',
  },
  lockedRow: {
    marginTop: Spacing.xxs,
  },
  lockedText: {
    color: Colors.text.muted,
    fontSize: 11,
    fontWeight: '600',
  },

  // Compact
  compactContainer: {
    alignItems: 'center',
    width: 68,
    gap: Spacing.xxs,
  },
  compactIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactIcon: {
    fontSize: 20,
    fontWeight: '700',
  },
  compactName: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
});
