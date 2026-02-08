import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';
import { useAuthStore } from '../../stores/authStore';
import { useHabitStore } from '../../stores/habitStore';
import { useQuestStore } from '../../stores/questStore';
import { HabitCard } from '../../components/habits/HabitCard';
import { DailyProgress } from '../../components/habits/DailyProgress';
import { LevelBadge } from '../../components/gamification/LevelBadge';
import { XPPopup } from '../../components/gamification/XPPopup';
import { QuestSection } from '../../components/quests/QuestSection';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { GradientButton } from '../../components/ui/GradientButton';
import { Colors, Typography, Spacing, Radius, Shadows, Icons } from '../../constants/design';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { habits, fetchHabits, completeHabit, getTodayHabits, isLoading } = useHabitStore();
  const { activeQuests, refreshQuests, claimQuestReward, checkAndProgressQuests } = useQuestStore();
  const [refreshing, setRefreshing] = useState(false);
  const [xpPopup, setXpPopup] = useState<{ show: boolean; xp: number }>({
    show: false,
    xp: 0,
  });

  const todayHabits = getTodayHabits();
  const completedCount = todayHabits.filter(h => h.completedToday).length;

  useEffect(() => {
    if (user) {
      fetchHabits();
      refreshQuests();
    }
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHabits();
    await refreshQuests();
    setRefreshing(false);
  };

  const handleCompleteHabit = async (habitId: string) => {
    const habit = todayHabits.find(h => h.id === habitId);
    const result = await completeHabit(habitId);
    if (result.success && result.xpEarned) {
      setXpPopup({ show: true, xp: result.xpEarned });
      if (result.leveledUp) {
        console.log('Level up!', result.newLevel);
      }

      // Progress quests based on this completion
      const newCompletedCount = todayHabits.filter(h => h.completedToday || h.id === habitId).length;
      await checkAndProgressQuests({
        type: 'habit_completed',
        habitCategory: habit?.category,
        habitDifficulty: habit?.difficulty,
        completionHour: new Date().getHours(),
        totalCompletedToday: newCompletedCount,
        totalDueToday: todayHabits.length,
        currentStreak: habit?.streak ? habit.streak.currentStreak + 1 : 1,
        xpEarned: result.xpEarned,
      });
    }
  };

  const handleClaimQuest = async (questId: string) => {
    const result = await claimQuestReward(questId);
    if (result.success && result.xpEarned) {
      setXpPopup({ show: true, xp: result.xpEarned });
    }
  };

  if (!user) {
    return (
      <View style={styles.authPrompt}>
        <LinearGradient
          colors={['#0B0F1A', '#111827']}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.authIconContainer}>
          <Text style={styles.authIcon}>{Icons.shield}</Text>
        </View>
        <Text style={styles.authTitle}>Welcome to QuestHabit</Text>
        <Text style={styles.authSubtitle}>
          Build lasting habits through the power of gamification
        </Text>
        <GradientButton
          title="Get Started"
          onPress={() => router.push('/(auth)/login')}
          size="lg"
          fullWidth
        />
      </View>
    );
  }

  const today = new Date();
  const dateString = format(today, 'EEEE, MMMM d');
  const greeting = getGreeting();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.accent.primary}
          />
        }
      >
        {/* Hero Header */}
        <LinearGradient
          colors={['#0B0F1A', '#111827', '#0F172A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.heroGradient}
        >
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>{greeting}, {user.displayName || 'Hero'}</Text>
              <Text style={styles.date}>{dateString}</Text>
            </View>
            <LevelBadge totalXP={user.totalXp} compact />
          </View>

          {/* Daily Progress Ring Section */}
          <DailyProgress completed={completedCount} total={todayHabits.length} />
        </LinearGradient>

        {/* Habits List */}
        <View style={styles.section}>
          <SectionHeader
            title="Today's Quests"
            subtitle={todayHabits.length > 0 ? `${completedCount} of ${todayHabits.length} complete` : undefined}
            actionLabel="New"
            onAction={() => router.push('/habit/new')}
          />

          {todayHabits.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Text style={styles.emptyIcon}>{Icons.sparkle}</Text>
              </View>
              <Text style={styles.emptyTitle}>No quests yet</Text>
              <Text style={styles.emptySubtitle}>
                Create your first habit to start earning XP
              </Text>
              <GradientButton
                title="Browse Templates"
                icon={Icons.trophy}
                onPress={() => router.push('/templates')}
                style={{ marginTop: Spacing.lg }}
              />
              <TouchableOpacity
                style={styles.createCustomLink}
                onPress={() => router.push('/habit/new')}
              >
                <Text style={styles.createCustomText}>or create a custom quest</Text>
              </TouchableOpacity>
            </View>
          ) : (
            todayHabits.map(habit => (
              <View key={habit.id} style={styles.habitWrapper}>
                <HabitCard
                  habit={habit}
                  onPress={() => router.push(`/habit/${habit.id}`)}
                  onComplete={() => handleCompleteHabit(habit.id)}
                />
              </View>
            ))
          )}
        </View>

        {/* Quest Challenges Section */}
        <View style={styles.section}>
          <QuestSection
            quests={activeQuests}
            onClaim={handleClaimQuest}
            isPro={user?.isPro}
          />
        </View>
      </ScrollView>

      {/* XP Popup (positioned globally) */}
      {xpPopup.show && (
        <XPPopup
          xp={xpPopup.xp}
          onComplete={() => setXpPopup({ show: false, xp: 0 })}
        />
      )}

      {/* FAB */}
      {todayHabits.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/habit/new')}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#06B6D4', '#0891B2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fabGradient}
          >
            <Text style={styles.fabText}>{Icons.add}</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  heroGradient: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    ...Typography.h1,
    color: Colors.text.primary,
    marginBottom: Spacing.xxs,
  },
  date: {
    ...Typography.caption,
    color: Colors.text.tertiary,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  habitWrapper: {
    position: 'relative',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
    backgroundColor: Colors.bg.elevated,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Colors.accent.ghost,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  emptyIcon: {
    fontSize: 28,
    color: Colors.accent.primary,
    fontWeight: '700',
  },
  emptyTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  emptySubtitle: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    textAlign: 'center',
    paddingHorizontal: Spacing['3xl'],
  },
  createCustomLink: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  createCustomText: {
    ...Typography.captionMedium,
    color: Colors.accent.primary,
    textDecorationLine: 'underline',
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    ...Shadows.accentGlow,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: '300',
    marginTop: -2,
  },
  authPrompt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['3xl'],
  },
  authIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.accent.ghost,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  authIcon: {
    fontSize: 36,
    color: Colors.accent.primary,
    fontWeight: '700',
  },
  authTitle: {
    ...Typography.h1,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  authSubtitle: {
    ...Typography.body,
    color: Colors.text.tertiary,
    marginBottom: Spacing['2xl'],
    textAlign: 'center',
    lineHeight: 24,
  },
});
