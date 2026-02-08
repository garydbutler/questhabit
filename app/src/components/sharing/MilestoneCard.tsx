/**
 * MilestoneCard — Achievement/milestone shareable card
 * 
 * For sharing when a user:
 * - Reaches a streak milestone (7, 30, 100 days)
 * - Levels up
 * - Unlocks an achievement
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius, AchievementIcons } from '../../constants/design';

type MilestoneType = 'streak' | 'level' | 'achievement';

interface MilestoneCardProps {
  type: MilestoneType;
  // For streak milestones
  streakCount?: number;
  habitName?: string;
  // For level milestones
  level?: number;
  // For achievement milestones
  achievementType?: string;
  achievementTitle?: string;
  // Common
  displayName: string;
  isPro?: boolean;
}

const STREAK_MILESTONES: Record<number, { title: string; subtitle: string }> = {
  7: { title: 'One Week Strong', subtitle: '7 days without breaking the chain' },
  14: { title: 'Two Weeks Solid', subtitle: '14 days of consistent effort' },
  21: { title: 'Habit Formed', subtitle: '21 days -- science says it sticks now' },
  30: { title: 'Monthly Champion', subtitle: '30 days of pure dedication' },
  50: { title: 'Half Century', subtitle: '50 days -- this is who you are now' },
  100: { title: 'Century Club', subtitle: '100 days. Legendary.' },
  365: { title: 'One Year Legend', subtitle: '365 days. Unstoppable.' },
};

function getStreakInfo(count: number): { title: string; subtitle: string } {
  // Find the closest milestone at or below the count
  const milestones = Object.keys(STREAK_MILESTONES)
    .map(Number)
    .sort((a, b) => b - a);
  for (const m of milestones) {
    if (count >= m) return STREAK_MILESTONES[m];
  }
  return { title: 'Streak Growing', subtitle: 'Keep the chain going' };
}

function getMilestoneGradient(type: MilestoneType, streakCount?: number): [string, string] {
  if (type === 'streak') {
    if ((streakCount || 0) >= 100) return ['#F59E0B', '#D97706'];
    if ((streakCount || 0) >= 30) return ['#EF4444', '#DC2626'];
    return ['#F97316', '#EA580C'];
  }
  if (type === 'level') return ['#8B5CF6', '#7C3AED'];
  return ['#06B6D4', '#0891B2'];
}

export function MilestoneCard({
  type,
  streakCount,
  habitName,
  level,
  achievementType,
  achievementTitle,
  displayName,
  isPro = false,
}: MilestoneCardProps) {
  const gradientColors = getMilestoneGradient(type, streakCount);
  const streakInfo = type === 'streak' && streakCount ? getStreakInfo(streakCount) : null;
  const achIcon = achievementType ? AchievementIcons[achievementType] : null;

  return (
    <View style={styles.cardWrapper}>
      <LinearGradient
        colors={['#0F172A', '#1A2332', '#0F172A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Decorative glow */}
        <LinearGradient
          colors={[gradientColors[0] + '30', 'transparent']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.6 }}
          style={styles.glowOverlay}
        />

        {/* Milestone Icon */}
        <View style={styles.iconSection}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconRing}
          >
            <View style={styles.iconInner}>
              <Text style={[styles.iconText, { color: gradientColors[0] }]}>
                {type === 'streak' && '\u2B22'}
                {type === 'level' && '\u25C6'}
                {type === 'achievement' && (achIcon?.symbol || '\u2605')}
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Milestone Content */}
        {type === 'streak' && (
          <View style={styles.contentSection}>
            <Text style={styles.milestoneTitle}>
              {streakInfo?.title || 'Streak Milestone'}
            </Text>
            <View style={styles.bigNumberRow}>
              <Text style={[styles.bigNumber, { color: gradientColors[0] }]}>
                {streakCount}
              </Text>
              <Text style={styles.bigNumberUnit}>days</Text>
            </View>
            {habitName && (
              <Text style={styles.habitNameText} numberOfLines={1}>
                {habitName}
              </Text>
            )}
            <Text style={styles.milestoneSubtitle}>
              {streakInfo?.subtitle}
            </Text>
          </View>
        )}

        {type === 'level' && (
          <View style={styles.contentSection}>
            <Text style={styles.milestoneTitle}>Level Up!</Text>
            <View style={styles.bigNumberRow}>
              <Text style={[styles.bigNumber, { color: gradientColors[0] }]}>
                {level}
              </Text>
            </View>
            <Text style={styles.milestoneSubtitle}>
              New heights reached through dedication
            </Text>
          </View>
        )}

        {type === 'achievement' && (
          <View style={styles.contentSection}>
            <Text style={styles.milestoneTitle}>Achievement Unlocked</Text>
            <Text style={[styles.achievementName, { color: achIcon?.color || Colors.accent.primary }]}>
              {achievementTitle || achievementType}
            </Text>
          </View>
        )}

        {/* Branding Footer */}
        <View style={styles.footer}>
          <View style={styles.brandRow}>
            <View style={styles.brandDot} />
            <Text style={styles.brandName}>QuestHabit</Text>
          </View>
          <Text style={styles.userName}>
            {displayName ? `@${displayName}` : ''}
          </Text>
        </View>

        {!isPro && (
          <Text style={styles.watermark}>questhabit.com</Text>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  card: {
    padding: Spacing.xl,
    minWidth: 320,
    alignItems: 'center',
  },
  glowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
  },
  iconSection: {
    marginBottom: Spacing.lg,
    marginTop: Spacing.sm,
  },
  iconRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.bg.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 30,
    fontWeight: '700',
  },
  contentSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  milestoneTitle: {
    ...Typography.captionMedium,
    color: Colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  bigNumberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: Spacing.xs,
  },
  bigNumber: {
    fontSize: 64,
    fontWeight: '800',
    letterSpacing: -3,
    lineHeight: 72,
  },
  bigNumberUnit: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.text.tertiary,
  },
  habitNameText: {
    ...Typography.bodySemibold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    maxWidth: 260,
  },
  milestoneSubtitle: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    textAlign: 'center',
    maxWidth: 260,
  },
  achievementName: {
    ...Typography.h2,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent.primary,
  },
  brandName: {
    ...Typography.captionMedium,
    color: Colors.text.muted,
    fontSize: 12,
  },
  userName: {
    ...Typography.caption,
    color: Colors.text.muted,
    fontSize: 11,
  },
  watermark: {
    ...Typography.caption,
    color: Colors.text.muted,
    fontSize: 10,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});
