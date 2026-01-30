import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getLevelProgress } from '../../lib/xp';
import { ProgressBar } from '../ui/ProgressBar';
import { Colors, Typography, Spacing, Radius, Icons } from '../../constants/design';

interface LevelBadgeProps {
  totalXP: number;
  compact?: boolean;
}

export function LevelBadge({ totalXP, compact = false }: LevelBadgeProps) {
  const { currentLevel, currentLevelXP, nextLevelXP, progress } = getLevelProgress(totalXP);

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={styles.compactLevelCircle}>
          <Text style={styles.compactLevelText}>{currentLevel}</Text>
        </View>
        <Text style={styles.compactXP}>{totalXP} XP</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.levelCircle}>
          <Text style={styles.levelText}>{currentLevel}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.title}>Level {currentLevel}</Text>
          <Text style={styles.xpText}>
            {currentLevelXP} / {nextLevelXP} XP
          </Text>
        </View>
        <View style={styles.xpBadge}>
          <Text style={styles.xpIcon}>{Icons.xp}</Text>
          <Text style={styles.xpBadgeText}>{totalXP}</Text>
        </View>
      </View>
      
      <ProgressBar
        progress={progress}
        color={Colors.xp.primary}
        backgroundColor={Colors.border.primary}
        height={6}
        style={styles.progressBar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg.elevated,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  levelCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.accent.muted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  levelText: {
    color: Colors.accent.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  title: {
    ...Typography.h3,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  xpText: {
    ...Typography.caption,
    color: Colors.text.tertiary,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.xp.muted,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: Radius.full,
    gap: 4,
  },
  xpIcon: {
    fontSize: 12,
    color: Colors.xp.primary,
    fontWeight: '700',
  },
  xpBadgeText: {
    color: Colors.xp.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  progressBar: {
    marginTop: Spacing.xxs,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  compactLevelCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.accent.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactLevelText: {
    color: Colors.accent.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  compactXP: {
    color: Colors.xp.primary,
    ...Typography.captionMedium,
  },
});
