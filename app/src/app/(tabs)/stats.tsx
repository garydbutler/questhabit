import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { format, subDays } from 'date-fns';
import { useAuthStore } from '../../stores/authStore';
import { useHabitStore } from '../../stores/habitStore';
import { LevelBadge } from '../../components/gamification/LevelBadge';
import { CalendarHeatmap } from '../../components/stats/CalendarHeatmap';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { IconBadge } from '../../components/ui/IconBadge';
import { ChipTag } from '../../components/ui/ChipTag';
import { supabase } from '../../lib/supabase';
import { Colors, Typography, Spacing, Radius, Icons } from '../../constants/design';
import { CATEGORY_COLORS } from '../../constants';

export default function StatsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { habits } = useHabitStore();
  const [heatmapData, setHeatmapData] = useState<Array<{ date: string; count: number; total: number }>>([]);

  useEffect(() => {
    if (user) {
      loadHeatmapData();
    }
  }, [user, habits]);

  const loadHeatmapData = async () => {
    if (!user) return;
    try {
      const startDate = format(subDays(new Date(), 16 * 7), 'yyyy-MM-dd');
      const { data: completions } = await supabase
        .from('completions')
        .select('completed_date')
        .eq('user_id', user.id)
        .gte('completed_date', startDate);

      const countByDate = new Map<string, number>();
      completions?.forEach((c: any) => {
        const date = c.completed_date;
        countByDate.set(date, (countByDate.get(date) || 0) + 1);
      });

      const activeHabits = habits.filter(h => !h.isArchived);
      const total = activeHabits.length;

      const data = Array.from(countByDate.entries()).map(([date, count]) => ({
        date,
        count,
        total: total || 1,
      }));

      setHeatmapData(data);
    } catch (error) {
      console.error('Failed to load heatmap data:', error);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Sign in to view your stats</Text>
      </View>
    );
  }

  const activeHabits = habits.filter(h => !h.isArchived);
  const bestStreak = Math.max(...habits.map(h => h.streak?.bestStreak || 0), 0);
  const currentStreaks = habits.map(h => h.streak?.currentStreak || 0);
  const avgStreak = currentStreaks.length > 0
    ? Math.round(currentStreaks.reduce((a, b) => a + b, 0) / currentStreaks.length)
    : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Share Progress */}
      <View style={styles.shareRow}>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => router.push('/share-preview?type=weekly' as any)}
          activeOpacity={0.7}
        >
          <Text style={styles.shareIcon}>{'\u2197'}</Text>
          <Text style={styles.shareText}>Share Progress</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.exportButton}
          onPress={() => router.push('/data-export' as any)}
          activeOpacity={0.7}
        >
          <Text style={styles.exportIcon}>{'\u2191'}</Text>
          <Text style={styles.exportText}>Export</Text>
        </TouchableOpacity>
      </View>

      {/* Level Card */}
      <View style={styles.section}>
        <SectionHeader title="Your Progress" />
        <LevelBadge totalXP={user.totalXp} />
      </View>

      {/* Calendar Heatmap */}
      <View style={styles.section}>
        <SectionHeader title="Activity" />
        <CalendarHeatmap
          data={heatmapData}
          weeks={16}
          onDayPress={(date, data) => {
            if (data) {
              Alert.alert(
                format(new Date(date + 'T12:00:00'), 'MMMM d, yyyy'),
                `${data.count}/${data.total} habits completed`
              );
            }
          }}
        />
      </View>

      {/* Stats Grid */}
      <View style={styles.section}>
        <SectionHeader title="Statistics" />
        <View style={styles.grid}>
          <StatCard
            value={user.totalXp.toLocaleString()}
            label="Total XP"
            color={Colors.xp.primary}
            icon={Icons.xp}
          />
          <StatCard
            value={user.level}
            label="Level"
            color={Colors.accent.primary}
            icon={Icons.level}
          />
        </View>
        <View style={[styles.grid, { marginTop: Spacing.sm }]}>
          <StatCard
            value={activeHabits.length}
            label="Active Habits"
            color={Colors.semantic.info}
            icon={Icons.today}
          />
          <StatCard
            value={bestStreak}
            label="Best Streak"
            color={Colors.streak.primary}
            icon={Icons.streak}
          />
        </View>
      </View>

      {/* Habits Overview */}
      <View style={styles.section}>
        <SectionHeader title="Habits Overview" />
        {activeHabits.length === 0 ? (
          <Card>
            <Text style={styles.emptyText}>
              No habits yet. Create your first habit to see stats!
            </Text>
          </Card>
        ) : (
          activeHabits.map(habit => (
            <Card key={habit.id} style={styles.habitStat}>
              <View style={styles.habitHeader}>
                <View style={[styles.habitDot, { backgroundColor: CATEGORY_COLORS[habit.category] }]} />
                <Text style={styles.habitName} numberOfLines={1}>
                  {habit.name}
                </Text>
              </View>
              <View style={styles.habitStats}>
                <View style={styles.habitStatItem}>
                  <ChipTag
                    label={`${habit.streak?.currentStreak || 0}`}
                    color={Colors.streak.primary}
                    icon={Icons.streak}
                    size="sm"
                  />
                  <Text style={styles.habitStatLabel}>Current</Text>
                </View>
                <View style={styles.habitStatItem}>
                  <ChipTag
                    label={`${habit.streak?.bestStreak || 0}`}
                    color={Colors.xp.primary}
                    icon={Icons.trophy}
                    size="sm"
                  />
                  <Text style={styles.habitStatLabel}>Best</Text>
                </View>
              </View>
            </Card>
          ))
        )}
      </View>
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
  section: {
    marginBottom: Spacing.xl,
  },
  shareRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent.muted,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    gap: 6,
  },
  shareIcon: {
    fontSize: 16,
    color: Colors.accent.primary,
    fontWeight: '600',
  },
  shareText: {
    ...Typography.captionMedium,
    color: Colors.accent.primary,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bg.elevated,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    gap: 6,
  },
  exportIcon: {
    fontSize: 16,
    color: Colors.text.tertiary,
    fontWeight: '600',
  },
  exportText: {
    ...Typography.captionMedium,
    color: Colors.text.tertiary,
  },
  grid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  habitStat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.sm,
  },
  habitDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  habitName: {
    ...Typography.bodyMedium,
    color: Colors.text.primary,
    flex: 1,
  },
  habitStats: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  habitStatItem: {
    alignItems: 'center',
    gap: 4,
  },
  habitStatLabel: {
    ...Typography.label,
    color: Colors.text.muted,
    fontSize: 9,
  },
  emptyText: {
    color: Colors.text.tertiary,
    textAlign: 'center',
    paddingVertical: Spacing.lg,
    ...Typography.caption,
  },
  message: {
    color: Colors.text.tertiary,
    textAlign: 'center',
    marginTop: Spacing['3xl'],
    ...Typography.body,
  },
});
