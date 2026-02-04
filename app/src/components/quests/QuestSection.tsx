import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ActiveQuest } from '../../types';
import { QuestCard } from './QuestCard';
import { SectionHeader } from '../ui/SectionHeader';
import { Colors, Typography, Spacing, Radius, Icons } from '../../constants/design';

interface QuestSectionProps {
  quests: ActiveQuest[];
  onClaim: (questId: string) => void;
  isPro?: boolean;
}

export function QuestSection({ quests, onClaim, isPro }: QuestSectionProps) {
  const router = useRouter();

  const dailyQuests = quests.filter(q => q.tier === 'daily');
  const weeklyQuests = quests.filter(q => q.tier === 'weekly');
  const legendaryQuests = quests.filter(q => q.tier === 'legendary');
  const claimable = quests.filter(q => q.status === 'completed');

  if (quests.length === 0) return null;

  return (
    <View style={styles.container}>
      <SectionHeader
        title="Active Quests"
        subtitle={claimable.length > 0 ? `${claimable.length} ready to claim!` : undefined}
        actionLabel="All"
        onAction={() => router.push('/quests')}
      />

      {/* Claimable quests shown first with emphasis */}
      {claimable.length > 0 && (
        <View style={styles.claimableSection}>
          <View style={styles.claimableBanner}>
            <Text style={styles.claimableIcon}>{Icons.trophy}</Text>
            <Text style={styles.claimableText}>
              {claimable.length} quest{claimable.length > 1 ? 's' : ''} completed!
            </Text>
          </View>
          {claimable.map(quest => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onClaim={() => onClaim(quest.id)}
            />
          ))}
        </View>
      )}

      {/* Daily Quests — compact view on home screen */}
      {dailyQuests.filter(q => q.status === 'active').length > 0 && (
        <View style={styles.tierSection}>
          <View style={styles.tierHeader}>
            <View style={[styles.tierDot, { backgroundColor: '#06B6D4' }]} />
            <Text style={styles.tierTitle}>Daily Quests</Text>
          </View>
          {dailyQuests
            .filter(q => q.status === 'active')
            .map(quest => (
              <QuestCard
                key={quest.id}
                quest={quest}
                compact
                onPress={() => router.push('/quests')}
              />
            ))}
        </View>
      )}

      {/* Weekly Quest */}
      {weeklyQuests.filter(q => q.status === 'active').length > 0 && (
        <View style={styles.tierSection}>
          <View style={styles.tierHeader}>
            <View style={[styles.tierDot, { backgroundColor: '#8B5CF6' }]} />
            <Text style={styles.tierTitle}>Weekly Quest</Text>
          </View>
          {weeklyQuests
            .filter(q => q.status === 'active')
            .map(quest => (
              <QuestCard
                key={quest.id}
                quest={quest}
                compact
                onPress={() => router.push('/quests')}
              />
            ))}
        </View>
      )}

      {/* Legendary Quest (Pro) */}
      {legendaryQuests.filter(q => q.status === 'active').length > 0 && (
        <View style={styles.tierSection}>
          <View style={styles.tierHeader}>
            <View style={[styles.tierDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.tierTitle}>Legendary Quest</Text>
            <View style={styles.proBadge}>
              <Text style={styles.proLabel}>PRO</Text>
            </View>
          </View>
          {legendaryQuests
            .filter(q => q.status === 'active')
            .map(quest => (
              <QuestCard
                key={quest.id}
                quest={quest}
                compact
                onPress={() => router.push('/quests')}
              />
            ))}
        </View>
      )}

      {/* Legendary teaser for non-Pro users */}
      {!isPro && legendaryQuests.length === 0 && (
        <TouchableOpacity
          style={styles.legendaryTeaser}
          onPress={() => router.push('/pro')}
          activeOpacity={0.8}
        >
          <View style={styles.teaserContent}>
            <Text style={styles.teaserIcon}>{'\u2666'}</Text>
            <View style={styles.teaserText}>
              <Text style={styles.teaserTitle}>Unlock Legendary Quests</Text>
              <Text style={styles.teaserSubtitle}>Epic challenges with massive XP rewards</Text>
            </View>
          </View>
          <Text style={styles.teaserArrow}>{Icons.chevronRight}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
  },
  claimableSection: {
    marginBottom: Spacing.md,
  },
  claimableBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.semantic.successMuted,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  claimableIcon: {
    fontSize: 14,
    color: Colors.semantic.success,
    fontWeight: '700',
  },
  claimableText: {
    ...Typography.captionMedium,
    color: Colors.semantic.success,
  },
  tierSection: {
    marginBottom: Spacing.md,
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: Spacing.xs,
  },
  tierDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  tierTitle: {
    ...Typography.captionMedium,
    color: Colors.text.tertiary,
  },
  proBadge: {
    backgroundColor: Colors.pro.bg,
    borderWidth: 1,
    borderColor: Colors.pro.border,
    borderRadius: Radius.full,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  proLabel: {
    ...Typography.label,
    fontSize: 8,
    color: Colors.pro.primary,
  },
  legendaryTeaser: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.pro.bg,
    borderWidth: 1,
    borderColor: Colors.pro.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  teaserContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  teaserIcon: {
    fontSize: 20,
    color: Colors.pro.primary,
    fontWeight: '700',
  },
  teaserText: {
    flex: 1,
  },
  teaserTitle: {
    ...Typography.captionMedium,
    color: Colors.pro.primary,
  },
  teaserSubtitle: {
    ...Typography.caption,
    color: Colors.text.muted,
    marginTop: 1,
  },
  teaserArrow: {
    fontSize: 16,
    color: Colors.pro.primary,
    fontWeight: '700',
  },
});
