import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../stores/authStore';
import { useQuestStore } from '../stores/questStore';
import { QuestCard } from '../components/quests/QuestCard';
import { XPPopup } from '../components/gamification/XPPopup';
import { Colors, Typography, Spacing, Radius, Shadows, Icons, Gradients } from '../constants/design';
import { ActiveQuest, QuestTier } from '../types';
import { getQuestTierInfo } from '../lib/quests';

type TabFilter = 'all' | 'daily' | 'weekly' | 'legendary';

export default function QuestsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    activeQuests,
    recentCompletions,
    isLoading,
    refreshQuests,
    claimQuestReward,
    fetchRecentCompletions,
  } = useQuestStore();

  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [xpPopup, setXpPopup] = useState<{ show: boolean; xp: number }>({ show: false, xp: 0 });

  useEffect(() => {
    if (user) {
      refreshQuests();
      fetchRecentCompletions(10);
    }
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshQuests();
    await fetchRecentCompletions(10);
    setRefreshing(false);
  };

  const handleClaim = async (questId: string) => {
    const result = await claimQuestReward(questId);
    if (result.success && result.xpEarned) {
      setXpPopup({ show: true, xp: result.xpEarned });
    } else if (result.error) {
      Alert.alert('Error', result.error);
    }
  };

  const filteredQuests = activeTab === 'all'
    ? activeQuests
    : activeQuests.filter(q => q.tier === activeTab);

  const claimableCount = activeQuests.filter(q => q.status === 'completed').length;
  const totalActiveXP = activeQuests
    .filter(q => q.status === 'active' || q.status === 'completed')
    .reduce((sum, q) => sum + q.reward.xp, 0);

  const tabs: { key: TabFilter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: activeQuests.length },
    { key: 'daily', label: 'Daily', count: activeQuests.filter(q => q.tier === 'daily').length },
    { key: 'weekly', label: 'Weekly', count: activeQuests.filter(q => q.tier === 'weekly').length },
    { key: 'legendary', label: 'Legendary', count: activeQuests.filter(q => q.tier === 'legendary').length },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.accent.primary}
          />
        }
      >
        {/* Hero Header */}
        <LinearGradient
          colors={['#0B0F1A', '#111827', '#0F172A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.heroGradient}
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>{Icons.back} Back</Text>
          </TouchableOpacity>

          <Text style={styles.heroTitle}>Quest Board</Text>
          <Text style={styles.heroSubtitle}>Complete quests for bonus XP and rewards</Text>

          {/* Stats Summary */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{activeQuests.filter(q => q.status === 'active').length}</Text>
              <Text style={styles.statLabel}>ACTIVE</Text>
            </View>
            <View style={[styles.statCard, styles.statCardAccent]}>
              <Text style={[styles.statValue, { color: Colors.semantic.success }]}>{claimableCount}</Text>
              <Text style={styles.statLabel}>CLAIMABLE</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: Colors.xp.primary }]}>{totalActiveXP}</Text>
              <Text style={styles.statLabel}>XP AVAIL</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Tab Filter */}
        <View style={styles.tabContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
            {tabs.map(tab => (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, activeTab === tab.key && styles.tabActive]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                  {tab.label}
                </Text>
                {tab.count > 0 && (
                  <View style={[styles.tabCount, activeTab === tab.key && styles.tabCountActive]}>
                    <Text style={[styles.tabCountText, activeTab === tab.key && styles.tabCountTextActive]}>
                      {tab.count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quest List */}
        <View style={styles.questList}>
          {filteredQuests.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>{Icons.sparkle}</Text>
              <Text style={styles.emptyTitle}>
                {activeTab === 'legendary' && !user?.isPro
                  ? 'Legendary Quests are Pro Only'
                  : 'No quests available'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {activeTab === 'legendary' && !user?.isPro
                  ? 'Upgrade to Pro to unlock epic challenges with massive rewards'
                  : 'Pull down to refresh or check back later'}
              </Text>
              {activeTab === 'legendary' && !user?.isPro && (
                <TouchableOpacity
                  style={styles.upgradeButton}
                  onPress={() => router.push('/pro')}
                >
                  <LinearGradient
                    colors={[Colors.pro.primary, Colors.pro.secondary]}
                    style={styles.upgradeGradient}
                  >
                    <Text style={styles.upgradeText}>Upgrade to Pro</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            filteredQuests.map(quest => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onClaim={() => handleClaim(quest.id)}
              />
            ))
          )}
        </View>

        {/* Recent Completions */}
        {recentCompletions.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.historyTitle}>Recent Completions</Text>
            {recentCompletions.map(completion => {
              const tierInfo = getQuestTierInfo(completion.tier);
              return (
                <View key={completion.id} style={styles.historyItem}>
                  <View style={[styles.historyDot, { backgroundColor: tierInfo.color }]} />
                  <View style={styles.historyContent}>
                    <Text style={styles.historyName}>{completion.questName}</Text>
                    <Text style={styles.historyDate}>
                      {new Date(completion.completedAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={styles.historyXP}>+{completion.xpEarned} XP</Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* XP Popup */}
      {xpPopup.show && (
        <XPPopup
          xp={xpPopup.xp}
          onComplete={() => setXpPopup({ show: false, xp: 0 })}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  heroGradient: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 56,
    paddingBottom: Spacing.xl,
  },
  backButton: {
    marginBottom: Spacing.md,
    alignSelf: 'flex-start',
  },
  backText: {
    ...Typography.bodyMedium,
    color: Colors.accent.primary,
  },
  heroTitle: {
    ...Typography.h1,
    color: Colors.text.primary,
    marginBottom: Spacing.xxs,
  },
  heroSubtitle: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    marginBottom: Spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.bg.elevated,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  statCardAccent: {
    borderColor: Colors.semantic.success + '30',
  },
  statValue: {
    ...Typography.h2,
    color: Colors.text.primary,
  },
  statLabel: {
    ...Typography.label,
    color: Colors.text.muted,
    marginTop: 2,
  },
  tabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  tabScroll: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    gap: 6,
    backgroundColor: Colors.bg.elevated,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  tabActive: {
    backgroundColor: Colors.accent.ghost,
    borderColor: Colors.accent.primary + '40',
  },
  tabText: {
    ...Typography.captionMedium,
    color: Colors.text.tertiary,
  },
  tabTextActive: {
    color: Colors.accent.primary,
  },
  tabCount: {
    backgroundColor: Colors.bg.subtle,
    borderRadius: Radius.full,
    paddingHorizontal: 6,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
  },
  tabCountActive: {
    backgroundColor: Colors.accent.primary + '20',
  },
  tabCountText: {
    ...Typography.label,
    fontSize: 9,
    color: Colors.text.muted,
  },
  tabCountTextActive: {
    color: Colors.accent.primary,
  },
  questList: {
    padding: Spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
    backgroundColor: Colors.bg.elevated,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  emptyIcon: {
    fontSize: 28,
    color: Colors.text.muted,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  emptySubtitle: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    textAlign: 'center',
    paddingHorizontal: Spacing['3xl'],
  },
  upgradeButton: {
    marginTop: Spacing.lg,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  upgradeGradient: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
  },
  upgradeText: {
    ...Typography.bodySemibold,
    color: Colors.text.inverse,
  },
  historySection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  historyTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
    gap: Spacing.sm,
  },
  historyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  historyContent: {
    flex: 1,
  },
  historyName: {
    ...Typography.captionMedium,
    color: Colors.text.secondary,
  },
  historyDate: {
    ...Typography.caption,
    color: Colors.text.muted,
    marginTop: 1,
  },
  historyXP: {
    ...Typography.captionMedium,
    color: Colors.xp.primary,
  },
});
