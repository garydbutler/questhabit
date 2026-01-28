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
import { format } from 'date-fns';
import { useAuthStore } from '../../stores/authStore';
import { useHabitStore } from '../../stores/habitStore';
import { HabitCard } from '../../components/habits/HabitCard';
import { DailyProgress } from '../../components/habits/DailyProgress';
import { LevelBadge } from '../../components/gamification/LevelBadge';
import { XPPopup } from '../../components/gamification/XPPopup';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { habits, fetchHabits, completeHabit, getTodayHabits, isLoading } = useHabitStore();
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
    }
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHabits();
    setRefreshing(false);
  };

  const handleCompleteHabit = async (habitId: string) => {
    const result = await completeHabit(habitId);
    if (result.success && result.xpEarned) {
      setXpPopup({ show: true, xp: result.xpEarned });
      
      if (result.leveledUp) {
        // TODO: Show level up celebration
        console.log('Level up!', result.newLevel);
      }
    }
  };

  if (!user) {
    return (
      <View style={styles.authPrompt}>
        <Text style={styles.authTitle}>Welcome to HabitHero! 🦸</Text>
        <Text style={styles.authSubtitle}>
          Sign in to start building habits
        </Text>
        <TouchableOpacity
          style={styles.authButton}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.authButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const today = new Date();
  const dateString = format(today, 'EEEE, MMMM d');

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6366F1"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Hello, {user.displayName || 'Hero'}! 👋
            </Text>
            <Text style={styles.date}>{dateString}</Text>
          </View>
          <LevelBadge totalXP={user.totalXp} compact />
        </View>

        {/* Daily Progress */}
        <DailyProgress completed={completedCount} total={todayHabits.length} />

        {/* Habits List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Habits</Text>
            <TouchableOpacity onPress={() => router.push('/habit/new')}>
              <Text style={styles.addButton}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {todayHabits.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🌟</Text>
              <Text style={styles.emptyTitle}>No habits yet</Text>
              <Text style={styles.emptySubtitle}>
                Create your first habit to start earning XP!
              </Text>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => router.push('/habit/new')}
              >
                <Text style={styles.createButtonText}>Create Habit</Text>
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
                {xpPopup.show && (
                  <XPPopup
                    xp={xpPopup.xp}
                    onComplete={() => setXpPopup({ show: false, xp: 0 })}
                  />
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/habit/new')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#A1A1A1',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  addButton: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '600',
  },
  habitWrapper: {
    position: 'relative',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#A1A1A1',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 40,
  },
  createButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '300',
    marginTop: -2,
  },
  authPrompt: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  authSubtitle: {
    fontSize: 16,
    color: '#A1A1A1',
    marginBottom: 32,
    textAlign: 'center',
  },
  authButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
