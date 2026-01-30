import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressRing } from '../ui/ProgressRing';
import { Colors, Typography, Spacing, Radius } from '../../constants/design';

interface DailyProgressProps {
  completed: number;
  total: number;
}

export function DailyProgress({ completed, total }: DailyProgressProps) {
  const progress = total > 0 ? completed / total : 0;
  const isComplete = progress >= 1;

  return (
    <View style={styles.container}>
      <ProgressRing
        progress={progress}
        size={100}
        strokeWidth={7}
        label={`${completed}/${total}`}
        sublabel="quests"
      />
      <View style={styles.info}>
        <Text style={styles.title}>Today's Progress</Text>
        <Text style={styles.subtitle}>
          {total === 0
            ? 'No quests scheduled'
            : isComplete
            ? 'All quests complete!'
            : `${total - completed} remaining`}
        </Text>
        {isComplete && total > 0 && (
          <View style={styles.completeBadge}>
            <Text style={styles.completeText}>Perfect Day</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.elevated,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    gap: Spacing.lg,
  },
  info: {
    flex: 1,
  },
  title: {
    ...Typography.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.xxs,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.text.tertiary,
  },
  completeBadge: {
    marginTop: Spacing.xs,
    backgroundColor: Colors.semantic.successMuted,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  completeText: {
    ...Typography.captionMedium,
    color: Colors.semantic.success,
  },
});
