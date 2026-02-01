/**
 * SharePreview — Full-screen share card preview & share
 * 
 * Accessible from Stats and Profile screens.
 * Allows user to:
 * 1. Choose card type (streak, weekly, milestone)
 * 2. Pick which habit (for streak cards)
 * 3. Preview the rendered card
 * 4. Share via system share sheet
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ViewShot from 'react-native-view-shot';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { useAuthStore } from '../stores/authStore';
import { useHabitStore } from '../stores/habitStore';
import { StreakCard, WeeklySummaryCard, MilestoneCard, ShareButton } from '../components/sharing';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SectionHeader } from '../components/ui/SectionHeader';
import { supabase } from '../lib/supabase';
import { Colors, Typography, Spacing, Radius, Icons } from '../constants/design';

type CardType = 'streak' | 'weekly' | 'milestone';

interface WeeklyStats {
  totalCompletions: number;
  totalPossible: number;
  xpEarned: number;
  perfectDays: number;
  longestActiveStreak: number;
  topHabitName: string;
  topHabitCompletions: number;
  weekLabel: string;
}

export default function SharePreviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string; habitId?: string }>();
  const { user } = useAuthStore();
  const { habits, completions } = useHabitStore();
  const viewShotRef = useRef<ViewShot>(null);

  const [cardType, setCardType] = useState<CardType>(
    (params.type as CardType) || 'streak'
  );
  const [selectedHabitId, setSelectedHabitId] = useState<string>(
    params.habitId || habits[0]?.id || ''
  );
  const [weekCompletions, setWeekCompletions] = useState<boolean[]>([
    false, false, false, false, false, false, false,
  ]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats>({
    totalCompletions: 0,
    totalPossible: 0,
    xpEarned: 0,
    perfectDays: 0,
    longestActiveStreak: 0,
    topHabitName: '',
    topHabitCompletions: 0,
    weekLabel: '',
  });

  const selectedHabit = habits.find(h => h.id === selectedHabitId);
  const activeHabits = habits.filter(h => !h.isArchived);

  // Load week completions for selected habit
  const loadWeekCompletions = useCallback(async () => {
    if (!user || !selectedHabitId) return;

    try {
      const now = new Date();
      const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
      const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
      const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

      const startStr = format(weekStart, 'yyyy-MM-dd');
      const endStr = format(weekEnd, 'yyyy-MM-dd');

      const { data } = await supabase
        .from('completions')
        .select('completed_date')
        .eq('user_id', user.id)
        .eq('habit_id', selectedHabitId)
        .gte('completed_date', startStr)
        .lte('completed_date', endStr);

      const completedDates = new Set(data?.map((c: any) => c.completed_date) || []);
      const result = days.map(d => completedDates.has(format(d, 'yyyy-MM-dd')));
      setWeekCompletions(result);
    } catch (error) {
      console.error('Failed to load week completions:', error);
    }
  }, [user, selectedHabitId]);

  // Load weekly summary stats
  const loadWeeklyStats = useCallback(async () => {
    if (!user) return;

    try {
      const now = new Date();
      const weekStart = startOfWeek(now, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
      const startStr = format(weekStart, 'yyyy-MM-dd');
      const endStr = format(weekEnd, 'yyyy-MM-dd');

      const { data: weekCompletions } = await supabase
        .from('completions')
        .select('completed_date, habit_id, xp_earned')
        .eq('user_id', user.id)
        .gte('completed_date', startStr)
        .lte('completed_date', endStr);

      const comps = weekCompletions || [];
      const totalCompletions = comps.length;
      const totalPossible = activeHabits.length * 7;
      const xpEarned = comps.reduce((sum: number, c: any) => sum + (c.xp_earned || 0), 0);

      // Count completions per day
      const countByDate = new Map<string, number>();
      comps.forEach((c: any) => {
        countByDate.set(c.completed_date, (countByDate.get(c.completed_date) || 0) + 1);
      });
      const perfectDays = Array.from(countByDate.values()).filter(
        count => count >= activeHabits.length
      ).length;

      // Top habit
      const countByHabit = new Map<string, number>();
      comps.forEach((c: any) => {
        countByHabit.set(c.habit_id, (countByHabit.get(c.habit_id) || 0) + 1);
      });
      let topHabitId = '';
      let topCount = 0;
      countByHabit.forEach((count, habitId) => {
        if (count > topCount) {
          topCount = count;
          topHabitId = habitId;
        }
      });
      const topHabit = habits.find(h => h.id === topHabitId);

      // Longest active streak
      const longestActiveStreak = Math.max(
        ...habits.map(h => h.streak?.currentStreak || 0),
        0
      );

      const weekLabel = `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}`;

      setWeeklyStats({
        totalCompletions,
        totalPossible,
        xpEarned,
        perfectDays,
        longestActiveStreak,
        topHabitName: topHabit?.name || '',
        topHabitCompletions: topCount,
        weekLabel,
      });
    } catch (error) {
      console.error('Failed to load weekly stats:', error);
    }
  }, [user, habits, activeHabits.length]);

  useEffect(() => {
    loadWeekCompletions();
    loadWeeklyStats();
  }, [loadWeekCompletions, loadWeeklyStats]);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Sign in to share your progress</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>{Icons.back}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Share Progress</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Card Type Selector */}
        <View style={styles.section}>
          <SectionHeader title="Card Type" />
          <View style={styles.typeRow}>
            <TypePill
              label="Streak"
              active={cardType === 'streak'}
              onPress={() => setCardType('streak')}
            />
            <TypePill
              label="Weekly"
              active={cardType === 'weekly'}
              onPress={() => setCardType('weekly')}
            />
            <TypePill
              label="Milestone"
              active={cardType === 'milestone'}
              onPress={() => setCardType('milestone')}
            />
          </View>
        </View>

        {/* Habit Selector (for streak cards) */}
        {cardType === 'streak' && activeHabits.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Select Habit" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.habitScroll}
            >
              {activeHabits.map(habit => (
                <TouchableOpacity
                  key={habit.id}
                  style={[
                    styles.habitChip,
                    selectedHabitId === habit.id && styles.habitChipActive,
                  ]}
                  onPress={() => setSelectedHabitId(habit.id)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.habitChipText,
                      selectedHabitId === habit.id && styles.habitChipTextActive,
                    ]}
                    numberOfLines={1}
                  >
                    {habit.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Card Preview */}
        <View style={styles.section}>
          <SectionHeader title="Preview" />
          <View style={styles.previewContainer}>
            <ViewShot
              ref={viewShotRef}
              options={{
                format: 'png',
                quality: 1.0,
                result: 'tmpfile',
              }}
            >
              {cardType === 'streak' && selectedHabit && (
                <StreakCard
                  habit={selectedHabit}
                  weekCompletions={weekCompletions}
                  userLevel={user.level}
                  totalXp={user.totalXp}
                  isPro={user.isPro}
                />
              )}

              {cardType === 'weekly' && (
                <WeeklySummaryCard
                  stats={weeklyStats}
                  userLevel={user.level}
                  displayName={user.displayName || ''}
                  isPro={user.isPro}
                />
              )}

              {cardType === 'milestone' && (
                <MilestoneCard
                  type="streak"
                  streakCount={
                    selectedHabit?.streak?.bestStreak ||
                    Math.max(...habits.map(h => h.streak?.bestStreak || 0), 0)
                  }
                  habitName={selectedHabit?.name || habits[0]?.name}
                  displayName={user.displayName || ''}
                  isPro={user.isPro}
                />
              )}
            </ViewShot>
          </View>
        </View>

        {/* Share Actions */}
        <View style={styles.actions}>
          <ShareButton
            viewShotRef={viewShotRef}
            label="Share Card"
            variant="primary"
            size="lg"
            style={styles.shareButton}
            message="Check out my QuestHabit progress!"
            onShareComplete={(success) => {
              if (success) {
                // Could track analytics here
              }
            }}
          />
          <Button
            title="Back to Stats"
            variant="ghost"
            onPress={() => router.back()}
            style={styles.backLink}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function TypePill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.typePill, active && styles.typePillActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.typePillText, active && styles.typePillTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing['3xl'],
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing['4xl'],
  },
  section: {
    marginBottom: Spacing.xl,
  },
  typeRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  typePill: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    backgroundColor: Colors.bg.elevated,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    alignItems: 'center',
  },
  typePillActive: {
    backgroundColor: Colors.accent.muted,
    borderColor: Colors.accent.primary,
  },
  typePillText: {
    ...Typography.captionMedium,
    color: Colors.text.tertiary,
  },
  typePillTextActive: {
    color: Colors.accent.primary,
  },
  habitScroll: {
    gap: Spacing.xs,
    paddingVertical: Spacing.xxs,
  },
  habitChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    backgroundColor: Colors.bg.elevated,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  habitChipActive: {
    backgroundColor: Colors.accent.muted,
    borderColor: Colors.accent.primary,
  },
  habitChipText: {
    ...Typography.captionMedium,
    color: Colors.text.tertiary,
    maxWidth: 120,
  },
  habitChipTextActive: {
    color: Colors.accent.primary,
  },
  previewContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  actions: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  shareButton: {
    width: '100%',
  },
  backLink: {
    width: '100%',
  },
  emptyText: {
    color: Colors.text.tertiary,
    textAlign: 'center',
    marginTop: Spacing['3xl'],
    ...Typography.body,
  },
});
