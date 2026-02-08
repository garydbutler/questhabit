/**
 * StreakCard — Beautiful shareable card showing a habit's streak
 * 
 * Designed for social sharing on Instagram/Twitter/etc.
 * Features:
 * - Habit name + streak count
 * - 7-day completion dots
 * - XP and level info
 * - QuestHabit branding
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius } from '../../constants/design';
import { HabitWithStreak } from '../../types';

interface StreakCardProps {
  habit: HabitWithStreak;
  weekCompletions: boolean[]; // 7 booleans, Mon-Sun
  userLevel: number;
  totalXp: number;
  isPro?: boolean;
}

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function StreakCard({
  habit,
  weekCompletions,
  userLevel,
  totalXp,
  isPro = false,
}: StreakCardProps) {
  const currentStreak = habit.streak?.currentStreak || 0;
  const bestStreak = habit.streak?.bestStreak || 0;
  const categoryColor = getCategoryColor(habit.category);

  return (
    <View style={styles.cardWrapper}>
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#0F172A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Top accent bar */}
        <LinearGradient
          colors={[categoryColor, adjustAlpha(categoryColor, 0.3)]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.accentBar}
        />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.habitInfo}>
            <View style={[styles.categoryDot, { backgroundColor: categoryColor }]} />
            <Text style={styles.habitName} numberOfLines={1}>
              {habit.name}
            </Text>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Lv.{userLevel}</Text>
          </View>
        </View>

        {/* Streak Display */}
        <View style={styles.streakSection}>
          <Text style={styles.streakNumber}>{currentStreak}</Text>
          <Text style={styles.streakLabel}>day streak</Text>
        </View>

        {/* Week Grid */}
        <View style={styles.weekGrid}>
          {DAY_LABELS.map((day, index) => {
            const completed = weekCompletions[index] || false;
            return (
              <View key={`${day}-${index}`} style={styles.dayColumn}>
                <Text style={styles.dayLabel}>{day}</Text>
                <View
                  style={[
                    styles.dayDot,
                    completed && { backgroundColor: categoryColor },
                    completed && styles.dayDotCompleted,
                  ]}
                >
                  {completed && <Text style={styles.checkmark}>{'\u2713'}</Text>}
                </View>
              </View>
            );
          })}
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.xp.primary }]}>
              {totalXp.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.streak.primary }]}>
              {bestStreak}
            </Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: categoryColor }]}>
              {habit.difficulty}
            </Text>
            <Text style={styles.statLabel}>Difficulty</Text>
          </View>
        </View>

        {/* Branding Footer */}
        <View style={styles.footer}>
          <View style={styles.brandRow}>
            <View style={[styles.brandDot, { backgroundColor: Colors.accent.primary }]} />
            <Text style={styles.brandName}>QuestHabit</Text>
          </View>
          {!isPro && (
            <Text style={styles.watermark}>questhabit.com</Text>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    health: '#10B981',
    productivity: '#3B82F6',
    learning: '#8B5CF6',
    wellness: '#EC4899',
    custom: '#06B6D4',
  };
  return colors[category] || Colors.accent.primary;
}

function adjustAlpha(hex: string, alpha: number): string {
  return hex + Math.round(alpha * 255).toString(16).padStart(2, '0');
}

const styles = StyleSheet.create({
  cardWrapper: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
    // Shadow for elevated appearance
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
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    marginTop: Spacing.xs,
  },
  habitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.sm,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  habitName: {
    ...Typography.h3,
    color: Colors.text.primary,
    flex: 1,
  },
  levelBadge: {
    backgroundColor: Colors.accent.muted,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: Radius.full,
  },
  levelText: {
    ...Typography.captionMedium,
    color: Colors.accent.primary,
  },
  streakSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  streakNumber: {
    fontSize: 72,
    fontWeight: '800',
    color: Colors.text.primary,
    letterSpacing: -3,
    lineHeight: 80,
  },
  streakLabel: {
    ...Typography.captionMedium,
    color: Colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: -4,
  },
  weekGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.sm,
  },
  dayColumn: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dayLabel: {
    ...Typography.label,
    color: Colors.text.muted,
    fontSize: 10,
  },
  dayDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.bg.subtle,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayDotCompleted: {
    borderWidth: 0,
  },
  checkmark: {
    color: Colors.text.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    ...Typography.bodySemibold,
    fontSize: 18,
    textTransform: 'capitalize',
  },
  statLabel: {
    ...Typography.label,
    color: Colors.text.muted,
    fontSize: 9,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border.primary,
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
  },
  brandName: {
    ...Typography.captionMedium,
    color: Colors.text.muted,
    fontSize: 12,
  },
  watermark: {
    ...Typography.caption,
    color: Colors.text.muted,
    fontSize: 11,
  },
});
