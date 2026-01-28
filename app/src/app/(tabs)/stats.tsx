import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useAuthStore } from '../../stores/authStore';
import { useHabitStore } from '../../stores/habitStore';
import { LevelBadge } from '../../components/gamification/LevelBadge';
import { Card } from '../../components/ui/Card';

export default function StatsScreen() {
  const { user } = useAuthStore();
  const { habits } = useHabitStore();

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Sign in to view your stats</Text>
      </View>
    );
  }

  const activeHabits = habits.filter(h => !h.isArchived);
  const totalCompletions = habits.reduce((sum, h) => sum + (h.completedToday ? 1 : 0), 0);
  const bestStreak = Math.max(...habits.map(h => h.streak?.bestStreak || 0), 0);
  const currentStreaks = habits.map(h => h.streak?.currentStreak || 0);
  const avgStreak = currentStreaks.length > 0
    ? Math.round(currentStreaks.reduce((a, b) => a + b, 0) / currentStreaks.length)
    : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Level Card */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Progress</Text>
        <LevelBadge totalXP={user.totalXp} />
      </View>

      {/* Stats Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.grid}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{user.totalXp}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{user.level}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{activeHabits.length}</Text>
            <Text style={styles.statLabel}>Active Habits</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{bestStreak}</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </Card>
        </View>
      </View>

      {/* Habits Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Habits Overview</Text>
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
                <Text style={styles.habitIcon}>{habit.icon}</Text>
                <Text style={styles.habitName} numberOfLines={1}>
                  {habit.name}
                </Text>
              </View>
              <View style={styles.habitStats}>
                <View style={styles.habitStatItem}>
                  <Text style={styles.habitStatValue}>
                    🔥 {habit.streak?.currentStreak || 0}
                  </Text>
                  <Text style={styles.habitStatLabel}>Current</Text>
                </View>
                <View style={styles.habitStatItem}>
                  <Text style={styles.habitStatValue}>
                    ⭐ {habit.streak?.bestStreak || 0}
                  </Text>
                  <Text style={styles.habitStatLabel}>Best</Text>
                </View>
              </View>
            </Card>
          ))
        )}
      </View>

      {/* Coming Soon */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Coming Soon</Text>
        <Card>
          <View style={styles.comingSoon}>
            <Text style={styles.comingSoonIcon}>📊</Text>
            <Text style={styles.comingSoonText}>
              Calendar heatmap, detailed analytics, and more stats coming in the next update!
            </Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '47%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#6366F1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#A1A1A1',
  },
  habitStat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  habitName: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
  habitStats: {
    flexDirection: 'row',
    gap: 16,
  },
  habitStatItem: {
    alignItems: 'center',
  },
  habitStatValue: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  habitStatLabel: {
    fontSize: 10,
    color: '#6B6B6B',
  },
  emptyText: {
    color: '#A1A1A1',
    textAlign: 'center',
    paddingVertical: 20,
  },
  comingSoon: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  comingSoonIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  comingSoonText: {
    color: '#A1A1A1',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  message: {
    color: '#A1A1A1',
    textAlign: 'center',
    marginTop: 40,
  },
});
