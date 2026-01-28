import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from '../ui/ProgressBar';

interface DailyProgressProps {
  completed: number;
  total: number;
}

export function DailyProgress({ completed, total }: DailyProgressProps) {
  const progress = total > 0 ? completed / total : 0;
  const percentage = Math.round(progress * 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Progress</Text>
        <Text style={styles.count}>
          {completed}/{total} habits
        </Text>
      </View>
      
      <ProgressBar
        progress={progress}
        color={progress === 1 ? '#22C55E' : '#6366F1'}
        height={12}
        style={styles.progressBar}
      />
      
      <Text style={styles.percentage}>
        {percentage}% {progress === 1 && '🎉'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  count: {
    fontSize: 14,
    color: '#A1A1A1',
  },
  progressBar: {
    marginBottom: 8,
  },
  percentage: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
    textAlign: 'right',
  },
});
