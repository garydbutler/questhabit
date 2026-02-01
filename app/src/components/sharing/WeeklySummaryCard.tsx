/**
 * WeeklySummaryCard — End-of-week progress summary for social sharing
 * 
 * Shows:
 * - Completion percentage ring
 * - Total completions / habits completed
 * - XP earned this week
 * - Streak highlights
 * - QuestHabit branding
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius } from '../../constants/design';

interface WeeklyStats {
  totalCompletions: number;
  totalPossible: number;
  xpEarned: number;
  perfectDays: number;
  longestActiveStreak: number;
  topHabitName: string;
  topHabitCompletions: number;
  weekLabel: string; // e.g., "Jan 27 - Feb 2"
}

interface WeeklySummaryCardProps {
  stats: WeeklyStats;
  userLevel: number;
  displayName: string;
  isPro?: boolean;
}

export function WeeklySummaryCard({
  stats,
  userLevel,
  displayName,
  isPro = false,
}: WeeklySummaryCardProps) {
  const completionPct = stats.totalPossible > 0
    ? Math.round((stats.totalCompletions / stats.totalPossible) * 100)
    : 0;

  const ringColor = completionPct >= 80
    ? Colors.semantic.success
    : completionPct >= 50
      ? Colors.accent.primary
      : Colors.semantic.warning;

  return (
    <View style={styles.cardWrapper}>
      <LinearGradient
        colors={['#0F172A', '#162031', '#0F172A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Decorative top gradient */}
        <LinearGradient
          colors={[ringColor, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.decorGradient}
        />

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Weekly Summary</Text>
            <Text style={styles.headerDate}>{stats.weekLabel}</Text>
          </View>
          <View style={styles.levelPill}>
            <Text style={styles.levelText}>Lv.{userLevel}</Text>
          </View>
        </View>

        {/* Big Percentage Display */}
        <View style={styles.percentSection}>
          <View style={[styles.percentRing, { borderColor: ringColor }]}>
            <Text style={[styles.percentNumber, { color: ringColor }]}>
              {completionPct}
            </Text>
            <Text style={styles.percentSign}>%</Text>
          </View>
          <Text style={styles.percentLabel}>completion rate</Text>
          <Text style={styles.percentDetail}>
            {stats.totalCompletions} of {stats.totalPossible} habits completed
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.gridItem}>
            <Text style={[styles.gridValue, { color: Colors.xp.primary }]}>
              +{stats.xpEarned.toLocaleString()}
            </Text>
            <Text style={styles.gridLabel}>XP Earned</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={[styles.gridValue, { color: Colors.semantic.success }]}>
              {stats.perfectDays}
            </Text>
            <Text style={styles.gridLabel}>Perfect Days</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={[styles.gridValue, { color: Colors.streak.primary }]}>
              {stats.longestActiveStreak}
            </Text>
            <Text style={styles.gridLabel}>Best Streak</Text>
          </View>
        </View>

        {/* Top Habit */}
        {stats.topHabitName && (
          <View style={styles.topHabit}>
            <Text style={styles.topHabitLabel}>MOST CONSISTENT</Text>
            <Text style={styles.topHabitName} numberOfLines={1}>
              {stats.topHabitName}
            </Text>
            <Text style={styles.topHabitDetail}>
              {stats.topHabitCompletions}/7 days this week
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
  },
  decorGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    opacity: 0.06,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.text.primary,
  },
  headerDate: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  levelPill: {
    backgroundColor: Colors.accent.muted,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: Radius.full,
  },
  levelText: {
    ...Typography.captionMedium,
    color: Colors.accent.primary,
  },
  percentSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  percentRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    flexDirection: 'row',
  },
  percentNumber: {
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -2,
  },
  percentSign: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.tertiary,
    marginTop: 8,
  },
  percentLabel: {
    ...Typography.captionMedium,
    color: Colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  percentDetail: {
    ...Typography.caption,
    color: Colors.text.muted,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  gridItem: {
    alignItems: 'center',
    flex: 1,
  },
  gridValue: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  gridLabel: {
    ...Typography.label,
    color: Colors.text.muted,
    fontSize: 9,
    marginTop: 4,
  },
  topHabit: {
    backgroundColor: 'rgba(6, 182, 212, 0.06)',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.12)',
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  topHabitLabel: {
    ...Typography.label,
    color: Colors.accent.primary,
    fontSize: 10,
    marginBottom: 4,
  },
  topHabitName: {
    ...Typography.bodySemibold,
    color: Colors.text.primary,
    fontSize: 17,
  },
  topHabitDetail: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
