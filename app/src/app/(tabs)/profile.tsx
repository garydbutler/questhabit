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
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../stores/authStore';
import { LevelBadge } from '../../components/gamification/LevelBadge';
import { Card } from '../../components/ui/Card';
import { GradientCard } from '../../components/ui/GradientCard';
import { IconBadge } from '../../components/ui/IconBadge';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Colors, Typography, Spacing, Radius, Shadows, Icons } from '../../constants/design';

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
        <View style={styles.authIconWrap}>
          <Text style={styles.authIcon}>{Icons.profile}</Text>
        </View>
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
          <LinearGradient
            colors={user.isPro ? ['#F59E0B', '#D97706'] : ['#06B6D4', '#0891B2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarRing}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(user.displayName || user.email)[0].toUpperCase()}
              </Text>
            </View>
          </LinearGradient>
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
            <Text style={styles.proTagIcon}>{Icons.crown}</Text>
            <Text style={styles.proTagText}>Pro Member</Text>
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
            activeOpacity={0.8}
            onPress={() => router.push('/pro')}
          >
            <GradientCard variant="gold">
              <View style={styles.proBannerInner}>
                <View style={styles.proBannerLeft}>
                  <IconBadge symbol={Icons.crown} color={Colors.pro.primary} size="lg" />
                  <View style={styles.proBannerTextContainer}>
                    <Text style={styles.proBannerTitle}>Upgrade to Pro</Text>
                    <Text style={styles.proBannerSubtitle}>
                      Unlimited habits, AI coach, streak freezes
                    </Text>
                  </View>
                </View>
                <View style={styles.proBannerCta}>
                  <Text style={styles.proBannerCtaText}>$4.99/mo</Text>
                </View>
              </View>
            </GradientCard>
          </TouchableOpacity>
        </View>
      )}

      {/* Pro Status - Show if Pro */}
      {user.isPro && (
        <View style={styles.section}>
          <TouchableOpacity onPress={() => router.push('/pro')} activeOpacity={0.7}>
            <GradientCard variant="gold">
              <View style={styles.proStatusInner}>
                <View style={styles.proStatusLeft}>
                  <IconBadge symbol={Icons.crown} color={Colors.pro.primary} size="md" />
                  <View>
                    <Text style={styles.proStatusTitle}>Pro Member</Text>
                    <Text style={styles.proStatusSubtitle}>
                      {user.streakFreezesRemaining > 0
                        ? `${user.streakFreezesRemaining} streak freezes remaining`
                        : 'Tap to view your benefits'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.chevron}>{Icons.chevronRight}</Text>
              </View>
            </GradientCard>
          </TouchableOpacity>
        </View>
      )}

      {/* Stats Overview */}
      <View style={styles.section}>
        <SectionHeader title="Adventure Stats" />
        <View style={styles.statsGrid}>
          <StatCard
            value={`Lv.${user.level}`}
            label="Level"
            color={Colors.accent.primary}
            icon={Icons.level}
          />
          <StatCard
            value={user.totalXp.toLocaleString()}
            label="Total XP"
            color={Colors.xp.primary}
            icon={Icons.xp}
          />
          <StatCard
            value={user.streakFreezesRemaining}
            label="Freezes"
            color={Colors.semantic.info}
            icon={Icons.shield}
          />
        </View>
      </View>

      {/* Quick Links */}
      <View style={styles.section}>
        <SectionHeader title="Quick Links" />
        <Card>
          <QuickLink
            icon={'\u2197'}
            iconColor={Colors.accent.primary}
            title="Share Progress"
            subtitle="Share your streak cards"
            onPress={() => router.push('/share-preview' as any)}
          />
          <QuickLink
            icon={Icons.settings}
            iconColor={Colors.text.tertiary}
            title="Settings"
            subtitle="Account, notifications, data"
            onPress={() => router.push('/(tabs)/settings')}
          />
          <QuickLink
            icon={Icons.stats}
            iconColor={Colors.semantic.info}
            title="Detailed Stats"
            subtitle="View your full progress"
            onPress={() => router.push('/(tabs)/stats')}
          />
          <QuickLink
            icon={Icons.coach}
            iconColor={Colors.semantic.success}
            title="AI Coach"
            subtitle="Get personalized advice"
            onPress={() => router.push('/(tabs)/coach')}
          />
          <QuickLink
            icon={user.isPro ? Icons.crown : Icons.unlock}
            iconColor={user.isPro ? Colors.pro.primary : Colors.accent.primary}
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
          textStyle={{ color: Colors.semantic.error }}
        />
      </View>

      <Text style={styles.version}>QuestHabit v1.0.0</Text>
    </ScrollView>
  );
}

function QuickLink({
  icon,
  iconColor,
  title,
  subtitle,
  isLast,
  onPress,
}: {
  icon: string;
  iconColor: string;
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
      <IconBadge symbol={icon} color={iconColor} size="sm" />
      <View style={styles.quickLinkContent}>
        <Text style={styles.quickLinkTitle}>{title}</Text>
        {subtitle && <Text style={styles.quickLinkSubtitle}>{subtitle}</Text>}
      </View>
      <Text style={styles.chevron}>{Icons.chevronRight}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing['3xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.sm,
  },
  avatarRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.bg.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  proBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Colors.pro.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    ...Shadows.glow(Colors.pro.primary),
  },
  proBadgeText: {
    color: Colors.text.inverse,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  name: {
    ...Typography.h2,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  email: {
    ...Typography.caption,
    color: Colors.text.tertiary,
  },
  proTag: {
    marginTop: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.pro.bg,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.pro.border,
    gap: 4,
  },
  proTagIcon: {
    color: Colors.pro.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  proTagText: {
    color: Colors.pro.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    marginBottom: Spacing.xl,
  },

  // Pro Banner
  proBannerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  proBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Spacing.sm,
    gap: Spacing.sm,
  },
  proBannerTextContainer: {
    flex: 1,
  },
  proBannerTitle: {
    ...Typography.bodySemibold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  proBannerSubtitle: {
    ...Typography.caption,
    color: Colors.text.tertiary,
  },
  proBannerCta: {
    backgroundColor: Colors.pro.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
  },
  proBannerCtaText: {
    color: Colors.text.inverse,
    fontWeight: '700',
    fontSize: 14,
  },

  // Pro Status
  proStatusInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  proStatusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  proStatusTitle: {
    ...Typography.bodySemibold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  proStatusSubtitle: {
    ...Typography.caption,
    color: Colors.text.tertiary,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },

  // Quick Links
  quickLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: Spacing.sm,
  },
  quickLinkBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  quickLinkContent: {
    flex: 1,
  },
  quickLinkTitle: {
    ...Typography.bodyMedium,
    color: Colors.text.primary,
  },
  quickLinkSubtitle: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    marginTop: 1,
  },
  chevron: {
    fontSize: 20,
    color: Colors.text.muted,
  },

  version: {
    textAlign: 'center',
    color: Colors.text.muted,
    fontSize: 12,
    marginTop: Spacing.lg,
  },
  authContainer: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
    padding: Spacing['3xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  authIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: Colors.accent.ghost,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  authIcon: {
    fontSize: 30,
    color: Colors.accent.primary,
    fontWeight: '700',
  },
  authTitle: {
    ...Typography.h1,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  authSubtitle: {
    ...Typography.body,
    color: Colors.text.tertiary,
    textAlign: 'center',
    marginBottom: Spacing['2xl'],
  },
  authButton: {
    width: '100%',
    marginBottom: Spacing.sm,
  },
});
