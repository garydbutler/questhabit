import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../stores/authStore';
import { LevelBadge } from '../../components/gamification/LevelBadge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.authContainer}>
        <Text style={styles.authTitle}>Join QuestHabit</Text>
        <Text style={styles.authSubtitle}>
          Sign in to sync your habits and track your progress
        </Text>
        <Button
          title="Sign In"
          onPress={() => router.push('/(auth)/login')}
          style={styles.authButton}
        />
        <Button
          title="Create Account"
          variant="outline"
          onPress={() => router.push('/(auth)/signup')}
          style={styles.authButton}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, user.isPro && styles.avatarPro]}>
            <Text style={styles.avatarText}>
              {(user.displayName || user.email)[0].toUpperCase()}
            </Text>
          </View>
          {user.isPro && (
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeText}>PRO</Text>
            </View>
          )}
        </View>
        <Text style={styles.name}>{user.displayName || 'Hero'}</Text>
        <Text style={styles.email}>{user.email}</Text>
        {user.isPro && (
          <View style={styles.proTag}>
            <Text style={styles.proTagText}>👑 Pro Member</Text>
          </View>
        )}
      </View>

      {/* Level Card */}
      <View style={styles.section}>
        <LevelBadge totalXP={user.totalXp} />
      </View>

      {/* Pro Banner - Show if NOT Pro */}
      {!user.isPro && (
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.proBanner}
            onPress={() => router.push('/pro')}
            activeOpacity={0.8}
          >
            <View style={styles.proBannerLeft}>
              <Text style={styles.proBannerEmoji}>⚔️</Text>
              <View style={styles.proBannerTextContainer}>
                <Text style={styles.proBannerTitle}>Upgrade to Pro</Text>
                <Text style={styles.proBannerSubtitle}>
                  Unlimited habits, AI coach, streak freezes & more
                </Text>
              </View>
            </View>
            <View style={styles.proBannerCta}>
              <Text style={styles.proBannerCtaText}>$4.99/mo</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Pro Status - Show if Pro */}
      {user.isPro && (
        <View style={styles.section}>
          <Card>
            <TouchableOpacity
              style={styles.proStatusCard}
              onPress={() => router.push('/pro')}
              activeOpacity={0.7}
            >
              <View style={styles.proStatusLeft}>
                <Text style={styles.proStatusIcon}>👑</Text>
                <View>
                  <Text style={styles.proStatusTitle}>Pro Member</Text>
                  <Text style={styles.proStatusSubtitle}>
                    {user.streakFreezesRemaining > 0
                      ? `${user.streakFreezesRemaining} streak freezes remaining`
                      : 'Tap to view your benefits'}
                  </Text>
                </View>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </Card>
        </View>
      )}

      {/* Stats Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Adventure Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statValue}>Lv.{user.level}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>✨</Text>
            <Text style={styles.statValue}>{user.totalXp.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🧊</Text>
            <Text style={styles.statValue}>{user.streakFreezesRemaining}</Text>
            <Text style={styles.statLabel}>Freezes</Text>
          </View>
        </View>
      </View>

      {/* Quick Links */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Links</Text>
        <Card>
          <QuickLink
            icon="⚙️"
            title="Settings"
            subtitle="Account, notifications, data"
            onPress={() => router.push('/(tabs)/settings')}
          />
          <QuickLink
            icon="📊"
            title="Detailed Stats"
            subtitle="View your full progress"
            onPress={() => router.push('/(tabs)/stats')}
          />
          <QuickLink
            icon="🤖"
            title="AI Coach"
            subtitle="Get personalized advice"
            onPress={() => router.push('/(tabs)/coach')}
          />
          <QuickLink
            icon={user.isPro ? '👑' : '🔓'}
            title={user.isPro ? 'Pro Benefits' : 'Go Pro'}
            subtitle={user.isPro ? 'View your Pro features' : 'Unlock unlimited potential'}
            onPress={() => router.push('/pro')}
            isLast
          />
        </Card>
      </View>

      {/* Sign Out */}
      <View style={styles.section}>
        <Button
          title="Sign Out"
          variant="ghost"
          onPress={handleSignOut}
          textStyle={{ color: '#EF4444' }}
        />
      </View>

      {/* Version */}
      <Text style={styles.version}>QuestHabit v1.0.0</Text>
    </ScrollView>
  );
}

function QuickLink({
  icon,
  title,
  subtitle,
  isLast,
  onPress,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  isLast?: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.quickLink, !isLast && styles.quickLinkBorder]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.quickLinkIcon}>{icon}</Text>
      <View style={styles.quickLinkContent}>
        <Text style={styles.quickLinkTitle}>{title}</Text>
        {subtitle && <Text style={styles.quickLinkSubtitle}>{subtitle}</Text>}
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPro: {
    borderWidth: 3,
    borderColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  proBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  proBadgeText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#A1A1A1',
  },
  proTag: {
    marginTop: 8,
    backgroundColor: '#1A1A2E',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  proTagText: {
    color: '#A78BFA',
    fontSize: 13,
    fontWeight: '600',
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

  // Pro Banner (for non-Pro users)
  proBanner: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  proBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  proBannerEmoji: {
    fontSize: 32,
    marginRight: 14,
  },
  proBannerTextContainer: {
    flex: 1,
  },
  proBannerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  proBannerSubtitle: {
    fontSize: 13,
    color: '#A1A1A1',
    lineHeight: 18,
  },
  proBannerCta: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  proBannerCtaText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },

  // Pro Status (for Pro users)
  proStatusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  proStatusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  proStatusIcon: {
    fontSize: 28,
  },
  proStatusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  proStatusSubtitle: {
    fontSize: 13,
    color: '#A1A1A1',
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B6B6B',
    fontWeight: '500',
  },

  // Quick Links
  quickLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  quickLinkBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#252525',
  },
  quickLinkIcon: {
    fontSize: 20,
    marginRight: 14,
  },
  quickLinkContent: {
    flex: 1,
  },
  quickLinkTitle: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  quickLinkSubtitle: {
    fontSize: 12,
    color: '#6B6B6B',
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
    color: '#6B6B6B',
  },

  version: {
    textAlign: 'center',
    color: '#6B6B6B',
    fontSize: 12,
    marginTop: 20,
  },
  authContainer: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  authSubtitle: {
    fontSize: 16,
    color: '#A1A1A1',
    textAlign: 'center',
    marginBottom: 32,
  },
  authButton: {
    width: '100%',
    marginBottom: 12,
  },
});
