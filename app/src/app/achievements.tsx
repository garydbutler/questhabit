import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AchievementType } from '../types';
import { ACHIEVEMENTS } from '../constants';
import { useAchievementStore } from '../stores/achievementStore';
import { useHabitStore } from '../stores/habitStore';
import { AchievementBadge } from '../components/gamification/AchievementBadge';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { Colors, Typography, Spacing, Radius, Icons } from '../constants/design';

type FilterType = 'all' | 'unlocked' | 'locked';

const ALL_TYPES = Object.keys(ACHIEVEMENTS) as AchievementType[];

// Achievement progress helpers
function getAchievementProgress(
  type: AchievementType,
  ctx: { maxStreak: number; habitCount: number; level: number; completionCount: number },
): { current: number; target: number } | undefined {
  switch (type) {
    case 'week_warrior':
      return { current: Math.min(ctx.maxStreak, 7), target: 7 };
    case 'fortnight_fighter':
      return { current: Math.min(ctx.maxStreak, 14), target: 14 };
    case 'monthly_master':
      return { current: Math.min(ctx.maxStreak, 30), target: 30 };
    case 'habit_collector':
      return { current: Math.min(ctx.habitCount, 5), target: 5 };
    case 'level_5':
      return { current: Math.min(ctx.level, 5), target: 5 };
    case 'level_10':
      return { current: Math.min(ctx.level, 10), target: 10 };
    default:
      return undefined;
  }
}

export default function AchievementsScreen() {
  const router = useRouter();
  const { achievements, unlockedCount, totalPossible, totalBonusXP, fetchAchievements } =
    useAchievementStore();
  const { habits } = useHabitStore();
  const { user } = require('../stores/authStore').useAuthStore();
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    fetchAchievements();
  }, []);

  const unlockedSet = useMemo(
    () => new Set(achievements.map(a => a.achievementType)),
    [achievements],
  );

  const unlockedMap = useMemo(
    () => new Map(achievements.map(a => [a.achievementType, a.unlockedAt])),
    [achievements],
  );

  // Progress context
  const progressCtx = useMemo(() => {
    const maxStreak = Math.max(0, ...habits.map(h => h.streak?.currentStreak || 0));
    return {
      maxStreak,
      habitCount: habits.filter(h => !h.isArchived).length,
      level: user?.level || 1,
      completionCount: 0,
    };
  }, [habits, user]);

  const filteredTypes = useMemo(() => {
    let types = ALL_TYPES;
    if (filter === 'unlocked') {
      types = types.filter(t => unlockedSet.has(t));
    } else if (filter === 'locked') {
      types = types.filter(t => !unlockedSet.has(t));
    }
    // Unlocked first, then locked
    return types.sort((a, b) => {
      const aUnlocked = unlockedSet.has(a) ? 0 : 1;
      const bUnlocked = unlockedSet.has(b) ? 0 : 1;
      return aUnlocked - bUnlocked;
    });
  }, [filter, unlockedSet]);

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'unlocked', label: 'Unlocked' },
    { key: 'locked', label: 'Locked' },
  ];

  const renderPair = (_: any, index: number) => {
    if (index % 2 !== 0) return null;
    const left = filteredTypes[index];
    const right = filteredTypes[index + 1];
    return (
      <View style={styles.row} key={left}>
        <AchievementBadge
          type={left}
          unlockedAt={unlockedMap.get(left)}
          progress={!unlockedSet.has(left) ? getAchievementProgress(left, progressCtx) : undefined}
        />
        {right ? (
          <AchievementBadge
            type={right}
            unlockedAt={unlockedMap.get(right)}
            progress={!unlockedSet.has(right) ? getAchievementProgress(right, progressCtx) : undefined}
          />
        ) : (
          <View style={{ flex: 1 }} />
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Stats Header */}
      <View style={styles.statsRow}>
        <StatCard
          value={`${unlockedCount}/${totalPossible}`}
          label="Unlocked"
          color={Colors.accent.primary}
          icon={Icons.trophy}
        />
        <StatCard
          value={totalBonusXP.toLocaleString()}
          label="Bonus XP"
          color={Colors.xp.primary}
          icon={Icons.xp}
        />
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        {filters.map(f => {
          const active = filter === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setFilter(f.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Achievement Grid */}
      <View style={styles.grid}>
        {filteredTypes.map((type, index) => {
          if (index % 2 !== 0) return null;
          const left = filteredTypes[index];
          const right = filteredTypes[index + 1];
          return (
            <View style={styles.row} key={left}>
              <AchievementBadge
                type={left}
                unlockedAt={unlockedMap.get(left)}
                progress={
                  !unlockedSet.has(left)
                    ? getAchievementProgress(left, progressCtx)
                    : undefined
                }
              />
              {right ? (
                <AchievementBadge
                  type={right}
                  unlockedAt={unlockedMap.get(right)}
                  progress={
                    !unlockedSet.has(right)
                      ? getAchievementProgress(right, progressCtx)
                      : undefined
                  }
                />
              ) : (
                <View style={{ flex: 1 }} />
              )}
            </View>
          );
        })}
      </View>

      {filteredTypes.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>{Icons.trophy}</Text>
          <Text style={styles.emptyTitle}>
            {filter === 'unlocked' ? 'No achievements yet' : 'All achievements unlocked!'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {filter === 'unlocked'
              ? 'Complete habits to earn your first badge'
              : 'You\u2019ve conquered them all!'}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing['3xl'],
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    backgroundColor: Colors.bg.elevated,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  chipActive: {
    backgroundColor: Colors.accent.ghost,
    borderColor: Colors.accent.primary,
  },
  chipText: {
    ...Typography.captionMedium,
    color: Colors.text.tertiary,
  },
  chipTextActive: {
    color: Colors.accent.primary,
  },
  grid: {
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
  },
  emptyIcon: {
    fontSize: 32,
    color: Colors.text.muted,
    marginBottom: Spacing.sm,
  },
  emptyTitle: {
    ...Typography.h3,
    color: Colors.text.secondary,
    marginBottom: Spacing.xxs,
  },
  emptySubtitle: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
});
