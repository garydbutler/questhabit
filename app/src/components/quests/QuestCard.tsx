import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ActiveQuest } from '../../types';
import { getQuestTierInfo } from '../../lib/quests';
import { Colors, Typography, Spacing, Radius, Shadows, Icons } from '../../constants/design';

interface QuestCardProps {
  quest: ActiveQuest;
  onClaim?: () => void;
  onPress?: () => void;
  compact?: boolean;
}

export function QuestCard({ quest, onClaim, onPress, compact = false }: QuestCardProps) {
  const tierInfo = getQuestTierInfo(quest.tier);
  const progress = Math.min(quest.progress / quest.requirement.target, 1);
  const isCompleted = quest.status === 'completed';
  const isActive = quest.status === 'active';
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  useEffect(() => {
    if (isCompleted) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.02,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isCompleted]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const timeRemaining = getTimeRemaining(quest.expiresAt);

  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.compactContainer, { borderColor: tierInfo.borderColor }]}
        onPress={isCompleted ? onClaim : onPress}
        activeOpacity={0.8}
      >
        <View style={[styles.compactIcon, { backgroundColor: tierInfo.bgColor }]}>
          <Text style={[styles.compactIconText, { color: quest.color }]}>{quest.icon}</Text>
        </View>
        <View style={styles.compactContent}>
          <Text style={styles.compactName} numberOfLines={1}>{quest.name}</Text>
          <View style={styles.compactProgressTrack}>
            <Animated.View
              style={[
                styles.compactProgressFill,
                {
                  width: progressWidth,
                  backgroundColor: isCompleted ? Colors.semantic.success : quest.color,
                },
              ]}
            />
          </View>
        </View>
        <Text style={[styles.compactProgress, { color: isCompleted ? Colors.semantic.success : Colors.text.tertiary }]}>
          {isCompleted ? Icons.check : `${quest.progress}/${quest.requirement.target}`}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <Animated.View style={[styles.cardOuter, { transform: [{ scale: pulseAnim }] }]}>
      <TouchableOpacity
        style={[
          styles.card,
          { borderColor: isCompleted ? Colors.semantic.success + '40' : tierInfo.borderColor },
          isCompleted && styles.cardCompleted,
        ]}
        onPress={isCompleted ? onClaim : onPress}
        activeOpacity={0.85}
      >
        {/* Tier Badge */}
        <View style={styles.header}>
          <View style={[styles.tierBadge, { backgroundColor: tierInfo.bgColor, borderColor: tierInfo.borderColor }]}>
            <Text style={[styles.tierIcon, { color: tierInfo.color }]}>{tierInfo.icon}</Text>
            <Text style={[styles.tierLabel, { color: tierInfo.color }]}>{tierInfo.label}</Text>
          </View>
          {isActive && (
            <Text style={styles.timeRemaining}>{timeRemaining}</Text>
          )}
          {isCompleted && (
            <View style={styles.claimBadge}>
              <Text style={styles.claimBadgeText}>CLAIM</Text>
            </View>
          )}
        </View>

        {/* Quest Info */}
        <View style={styles.body}>
          <View style={[styles.questIcon, { backgroundColor: quest.color + '15' }]}>
            <Text style={[styles.questIconText, { color: quest.color }]}>{quest.icon}</Text>
          </View>
          <View style={styles.questInfo}>
            <Text style={styles.questName}>{quest.name}</Text>
            <Text style={styles.questDescription}>{quest.description}</Text>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={[styles.progressValue, isCompleted && { color: Colors.semantic.success }]}>
              {quest.progress}/{quest.requirement.target}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressWidth,
                  backgroundColor: isCompleted ? Colors.semantic.success : quest.color,
                },
              ]}
            />
          </View>
        </View>

        {/* Reward */}
        <View style={styles.rewardSection}>
          <View style={styles.rewardItem}>
            <Text style={styles.rewardIcon}>{Icons.xp}</Text>
            <Text style={styles.rewardText}>{quest.reward.xp} XP</Text>
          </View>
          {quest.reward.streakFreezes && quest.reward.streakFreezes > 0 && (
            <View style={styles.rewardItem}>
              <Text style={styles.rewardIcon}>{Icons.shield}</Text>
              <Text style={styles.rewardText}>{quest.reward.streakFreezes} Freeze{quest.reward.streakFreezes > 1 ? 's' : ''}</Text>
            </View>
          )}
          {quest.reward.badge && (
            <View style={styles.rewardItem}>
              <Text style={styles.rewardIcon}>{Icons.trophy}</Text>
              <Text style={styles.rewardText}>Badge</Text>
            </View>
          )}
        </View>

        {/* Claim Button (when completed) */}
        {isCompleted && (
          <TouchableOpacity
            style={styles.claimButton}
            onPress={onClaim}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.semantic.success, '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.claimButtonGradient}
            >
              <Text style={styles.claimButtonIcon}>{Icons.xp}</Text>
              <Text style={styles.claimButtonText}>Claim {quest.reward.xp} XP</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

function getTimeRemaining(expiresAt: string): string {
  const now = new Date();
  const expires = new Date(expiresAt);
  const diff = expires.getTime() - now.getTime();

  if (diff <= 0) return 'Expired';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h left`;
  }
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
}

const styles = StyleSheet.create({
  cardOuter: {
    marginBottom: Spacing.md,
  },
  card: {
    backgroundColor: Colors.bg.elevated,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  cardCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.04)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: Radius.full,
    borderWidth: 1,
    gap: 4,
  },
  tierIcon: {
    fontSize: 10,
    fontWeight: '700',
  },
  tierLabel: {
    ...Typography.label,
    fontSize: 10,
  },
  timeRemaining: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  claimBadge: {
    backgroundColor: Colors.semantic.successMuted,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: Radius.full,
  },
  claimBadgeText: {
    ...Typography.label,
    fontSize: 10,
    color: Colors.semantic.success,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  questIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questIconText: {
    fontSize: 22,
    fontWeight: '700',
  },
  questInfo: {
    flex: 1,
  },
  questName: {
    ...Typography.h3,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  questDescription: {
    ...Typography.caption,
    color: Colors.text.tertiary,
  },
  progressSection: {
    marginBottom: Spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  progressLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  progressValue: {
    ...Typography.captionMedium,
    color: Colors.text.secondary,
  },
  progressTrack: {
    height: 6,
    backgroundColor: Colors.bg.subtle,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  rewardSection: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardIcon: {
    fontSize: 12,
    color: Colors.xp.primary,
    fontWeight: '700',
  },
  rewardText: {
    ...Typography.caption,
    color: Colors.xp.primary,
  },
  claimButton: {
    marginTop: Spacing.md,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  claimButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  claimButtonIcon: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '700',
  },
  claimButtonText: {
    ...Typography.bodySemibold,
    color: Colors.white,
  },

  // Compact styles
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.elevated,
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.sm,
    marginBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  compactIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactIconText: {
    fontSize: 14,
    fontWeight: '700',
  },
  compactContent: {
    flex: 1,
    gap: 4,
  },
  compactName: {
    ...Typography.captionMedium,
    color: Colors.text.primary,
  },
  compactProgressTrack: {
    height: 3,
    backgroundColor: Colors.bg.subtle,
    borderRadius: 2,
    overflow: 'hidden',
  },
  compactProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  compactProgress: {
    ...Typography.captionMedium,
    minWidth: 35,
    textAlign: 'right',
  },
});
