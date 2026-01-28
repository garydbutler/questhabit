import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getLevelProgress } from '../../lib/xp';
import { ProgressBar } from '../ui/ProgressBar';

interface LevelBadgeProps {
  totalXP: number;
  compact?: boolean;
}

export function LevelBadge({ totalXP, compact = false }: LevelBadgeProps) {
  const { currentLevel, currentLevelXP, nextLevelXP, progress } = getLevelProgress(totalXP);

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={styles.levelCircle}>
          <Text style={styles.levelText}>{currentLevel}</Text>
        </View>
        <Text style={styles.compactXP}>{totalXP} XP</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.levelCircle}>
          <Text style={styles.levelText}>{currentLevel}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.title}>Level {currentLevel}</Text>
          <Text style={styles.xpText}>
            {currentLevelXP} / {nextLevelXP} XP
          </Text>
        </View>
      </View>
      
      <ProgressBar
        progress={progress}
        color="#FBBF24"
        height={6}
        style={styles.progressBar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  levelText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  xpText: {
    fontSize: 14,
    color: '#A1A1A1',
  },
  progressBar: {
    marginTop: 4,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  compactXP: {
    color: '#FBBF24',
    fontSize: 14,
    fontWeight: '600',
  },
});
