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
import { XP_VALUES, CATEGORY_COLORS } from '../../constants';
import { ChipTag } from '../ui/ChipTag';
import { Colors, Typography, Spacing, Radius, Shadows, Icons } from '../../constants/design';

interface HabitCardProps {
  habit: HabitWithStreak;
  onPress: () => void;
  onComplete: () => void;
}

export function HabitCard({ habit, onPress, onComplete }: HabitCardProps) {
  const scale = useSharedValue(1);
  const checkScale = useSharedValue(habit.completedToday ? 1 : 0);
  const categoryColor = CATEGORY_COLORS[habit.category] || Colors.accent.primary;

  const handleComplete = async () => {
    if (habit.completedToday) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSequence(
      withSpring(0.97, { damping: 10 }),
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
    <Animated.View style={[animatedCardStyle, styles.wrapper]}>
      <Pressable
        style={[styles.card, habit.completedToday && styles.cardCompleted]}
        onPress={onPress}
      >
        {/* Category accent bar */}
        <View style={[styles.accentBar, { backgroundColor: categoryColor }]} />

        {/* Checkbox */}
        <TouchableOpacity
          style={[
            styles.checkbox,
            { borderColor: categoryColor },
            habit.completedToday && { backgroundColor: categoryColor, borderColor: categoryColor },
          ]}
          onPress={handleComplete}
          activeOpacity={0.7}
        >
          {habit.completedToday && (
            <Animated.Text style={[styles.checkmark, animatedCheckStyle]}>
              {Icons.check}
            </Animated.Text>
          )}
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.content}>
          <Text
            style={[styles.name, habit.completedToday && styles.nameCompleted]}
            numberOfLines={1}
          >
            {habit.name}
          </Text>
          <View style={styles.footer}>
            <ChipTag
              label={`+${baseXP} XP`}
              color={Colors.xp.primary}
              icon={Icons.xp}
              size="sm"
            />
            {currentStreak > 0 && (
              <ChipTag
                label={`${currentStreak}`}
                color={Colors.streak.primary}
                icon={Icons.streak}
                size="sm"
              />
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.bg.elevated,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    paddingLeft: Spacing.md + 4, // Account for accent bar
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.primary,
    overflow: 'hidden',
  },
  cardCompleted: {
    opacity: 0.6,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderTopLeftRadius: Radius.lg,
    borderBottomLeftRadius: Radius.lg,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: Radius.sm,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  checkmark: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  name: {
    ...Typography.bodySemibold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  nameCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.text.tertiary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
});
