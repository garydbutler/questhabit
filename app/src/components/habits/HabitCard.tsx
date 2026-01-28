import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { HabitWithStreak } from '../../types';
import { XP_VALUES } from '../../constants';

interface HabitCardProps {
  habit: HabitWithStreak;
  onPress: () => void;
  onComplete: () => void;
}

export function HabitCard({ habit, onPress, onComplete }: HabitCardProps) {
  const scale = useSharedValue(1);
  const checkScale = useSharedValue(habit.completedToday ? 1 : 0);

  const handleComplete = async () => {
    if (habit.completedToday) return;
    
    // Haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Animate
    scale.value = withSequence(
      withSpring(0.95, { damping: 10 }),
      withSpring(1, { damping: 10 })
    );
    checkScale.value = withSpring(1, { damping: 12 });
    
    onComplete();
  };

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedCheckStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkScale.value,
  }));

  const currentStreak = habit.streak?.currentStreak || 0;
  const baseXP = XP_VALUES[habit.difficulty];

  return (
    <Animated.View style={animatedCardStyle}>
      <Pressable
        style={[styles.card, habit.completedToday && styles.cardCompleted]}
        onPress={onPress}
      >
        <TouchableOpacity
          style={[
            styles.checkbox,
            { borderColor: habit.color },
            habit.completedToday && { backgroundColor: habit.color },
          ]}
          onPress={handleComplete}
          activeOpacity={0.7}
        >
          {habit.completedToday && (
            <Animated.Text style={[styles.checkmark, animatedCheckStyle]}>✓</Animated.Text>
          )}
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.icon}>{habit.icon}</Text>
            <Text
              style={[styles.name, habit.completedToday && styles.nameCompleted]}
              numberOfLines={1}
            >
              {habit.name}
            </Text>
          </View>
          
          <View style={styles.footer}>
            <View style={styles.xpBadge}>
              <Text style={styles.xpText}>+{baseXP} XP</Text>
            </View>
            
            {currentStreak > 0 && (
              <View style={styles.streakBadge}>
                <Text style={styles.streakText}>🔥 {currentStreak}</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardCompleted: {
    opacity: 0.7,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  nameCompleted: {
    textDecorationLine: 'line-through',
    color: '#A1A1A1',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  xpBadge: {
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  xpText: {
    color: '#FBBF24',
    fontSize: 12,
    fontWeight: '600',
  },
  streakBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  streakText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },
});
