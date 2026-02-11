import { useEffect, useRef } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet, Platform, AppState, AppStateStatus } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../stores/authStore';
import { useHabitStore } from '../stores/habitStore';
import { configureNotifications } from '../lib/notifications';
import { Colors } from '../constants/design';
import { WidgetService } from '../widgets';

// Register Android widget task handler
if (Platform.OS === 'android') {
  try {
    const { registerWidgetTaskHandler } = require('react-native-android-widget');
    const { widgetTaskHandler } = require('../widgets/android');
    registerWidgetTaskHandler(widgetTaskHandler);
  } catch (e) {
    console.log('[App] Android widget registration skipped:', e);
  }
}

// Configure notification behavior on import (before component mounts)
configureNotifications();

export default function RootLayout() {
  const { initialize, isInitialized, isLoading } = useAuthStore();
  const router = useRouter();
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  // Update widgets when app comes to foreground
  const updateWidgets = async () => {
    const habits = useHabitStore.getState().habits;
    const user = useAuthStore.getState().user;
    
    if (!habits.length) return;

    const todayHabits = habits.filter(h => !h.isArchived);
    const completedToday = todayHabits.filter(h => h.completedToday).length;

    // Find best streak across all habits
    let currentStreak = 0;
    let bestStreak = 0;
    let streakHabitName: string | undefined;

    todayHabits.forEach(habit => {
      const streak = habit.streak;
      if (streak) {
        if (streak.currentStreak > currentStreak) {
          currentStreak = streak.currentStreak;
          streakHabitName = habit.name;
        }
        if (streak.bestStreak > bestStreak) {
          bestStreak = streak.bestStreak;
        }
      }
    });

    await WidgetService.updateAllWidgets({
      completedToday,
      totalToday: todayHabits.length,
      currentStreak,
      bestStreak,
      streakHabitName,
      totalXP: user?.totalXp || 0,
    });
  };

  useEffect(() => {
    initialize();

    // Update widgets on app launch
    updateWidgets();

    // Listen for app state changes to update widgets
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        updateWidgets();
      }
    };
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    // Listen for incoming notifications (foreground)
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      // Could update badge count or show in-app toast
      console.log('Notification received:', notification.request.content.title);
    });

    // Listen for notification taps (background/killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      if (data?.type === 'habit_reminder' && data?.habitId) {
        // Navigate to the specific habit
        router.push(`/habit/${data.habitId}`);
      } else {
        // Default: go to Today tab
        router.push('/(tabs)');
      }
    });

    return () => {
      appStateSubscription.remove();
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  if (!isInitialized || isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.accent.primary} />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.bg.primary,
          },
          headerTintColor: Colors.text.primary,
          headerTitleStyle: { fontWeight: '600' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: Colors.bg.primary },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen
          name="habit/new"
          options={{
            title: 'New Quest',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="habit/[id]"
          options={{
            title: 'Edit Quest',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="templates"
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="achievements"
          options={{
            title: 'Achievements',
          }}
        />
        <Stack.Screen
          name="quests"
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="pro"
          options={{
            title: 'QuestHabit Pro',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="subscription-success"
          options={{
            headerShown: false,
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="subscription-cancel"
          options={{
            headerShown: false,
            animation: 'fade',
          }}
        />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
