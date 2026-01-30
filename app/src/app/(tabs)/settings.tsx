import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../stores/authStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { IconBadge } from '../../components/ui/IconBadge';
import { GradientCard } from '../../components/ui/GradientCard';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Colors, Typography, Spacing, Radius, Icons } from '../../constants/design';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dailyReminderTime, setDailyReminderTime] = useState('09:00');

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

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Your data export will be prepared and sent to your email. This may take a few minutes.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: () => {
            Alert.alert('Coming Soon', 'Data export will be available in a future update.');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action is permanent and cannot be undone. All your habits, streaks, achievements, and progress will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete My Account',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Coming Soon', 'Account deletion will be available in a future update. Contact support@questhabit.app for assistance.');
          },
        },
      ]
    );
  };

  const handleRateApp = () => {
    Alert.alert('Thank You!', 'Thanks for wanting to rate QuestHabit! App Store rating will be available once the app is published.');
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://questhabit.app/privacy').catch(() => {
      Alert.alert('Privacy Policy', 'Visit questhabit.app/privacy for our privacy policy.');
    });
  };

  const handleTerms = () => {
    Linking.openURL('https://questhabit.app/terms').catch(() => {
      Alert.alert('Terms of Service', 'Visit questhabit.app/terms for our terms of service.');
    });
  };

  if (!user) {
    return (
      <View style={styles.authContainer}>
        <View style={styles.authIconWrap}>
          <Text style={styles.authIconText}>{Icons.settings}</Text>
        </View>
        <Text style={styles.authTitle}>Settings</Text>
        <Text style={styles.authSubtitle}>Sign in to manage your settings</Text>
        <Button
          title="Sign In"
          onPress={() => router.push('/(auth)/login')}
          style={styles.authButton}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Section */}
      <View style={styles.section}>
        <SectionHeader title="Profile" />
        <Card>
          <TouchableOpacity style={styles.profileRow} onPress={() => router.push('/(tabs)/profile')}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(user.displayName || user.email)[0].toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.displayName || 'Hero'}</Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
            </View>
            <Text style={styles.chevron}>{Icons.chevronRight}</Text>
          </TouchableOpacity>
        </Card>
      </View>

      {/* Pro Status */}
      {!user.isPro && (
        <View style={styles.section}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/pro')}
          >
            <GradientCard variant="gold">
              <View style={styles.proBannerContent}>
                <IconBadge symbol={Icons.crown} color={Colors.pro.primary} size="md" />
                <View style={styles.proBannerText}>
                  <Text style={styles.proBannerTitle}>Upgrade to Pro</Text>
                  <Text style={styles.proBannerSubtitle}>
                    Unlimited habits, AI coach & more
                  </Text>
                </View>
                <Text style={[styles.chevron, { color: Colors.pro.primary }]}>{Icons.chevronRight}</Text>
              </View>
            </GradientCard>
          </TouchableOpacity>
        </View>
      )}

      {/* App Settings */}
      <View style={styles.section}>
        <SectionHeader title="App Settings" />
        <Card>
          <View style={[styles.settingsItem, styles.settingsItemBorder]}>
            <IconBadge symbol={'\u266A'} color={Colors.accent.primary} size="sm" />
            <View style={styles.settingsContent}>
              <Text style={styles.settingsTitle}>Notifications</Text>
              <Text style={styles.settingsSubtitle}>Habit reminders</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: Colors.border.primary, true: Colors.accent.muted }}
              thumbColor={notificationsEnabled ? Colors.accent.primary : Colors.text.muted}
              ios_backgroundColor={Colors.border.primary}
            />
          </View>
          <SettingsItem
            symbol={'\u23F0'}
            symbolColor={Colors.semantic.warning}
            title="Default Reminder"
            subtitle={dailyReminderTime}
            onPress={() => {
              Alert.alert('Coming Soon', 'Custom reminder time picker will be available in a future update.');
            }}
          />
          <SettingsItem
            symbol={'\u25CF'}
            symbolColor={Colors.accent.primary}
            title="Theme"
            subtitle="Dark (default)"
            onPress={() => {
              Alert.alert('Theme', 'Dark mode is the default theme. More themes coming with Pro!');
            }}
          />
          <SettingsItem
            symbol={'\u2609'}
            symbolColor={Colors.semantic.info}
            title="Timezone"
            subtitle={user.timezone}
            isLast
            onPress={() => {
              Alert.alert('Timezone', `Your timezone is set to ${user.timezone}. This is detected automatically.`);
            }}
          />
        </Card>
      </View>

      {/* Data */}
      <View style={styles.section}>
        <SectionHeader title="Data" />
        <Card>
          <SettingsItem
            symbol={'\u2191'}
            symbolColor={Colors.semantic.success}
            title="Export Data"
            subtitle="Download your habits & progress"
            onPress={handleExportData}
          />
          <SettingsItem
            symbol={'\u2716'}
            symbolColor={Colors.semantic.error}
            title="Delete Account"
            subtitle="Permanently delete all data"
            isLast
            destructive
            onPress={handleDeleteAccount}
          />
        </Card>
      </View>

      {/* About */}
      <View style={styles.section}>
        <SectionHeader title="About" />
        <Card>
          <SettingsItem
            symbol={'\u2605'}
            symbolColor={Colors.xp.primary}
            title="Rate QuestHabit"
            subtitle="Help us with a review"
            onPress={handleRateApp}
          />
          <SettingsItem
            symbol={'\u25A0'}
            symbolColor={Colors.text.tertiary}
            title="Privacy Policy"
            onPress={handlePrivacyPolicy}
          />
          <SettingsItem
            symbol={'\u25A1'}
            symbolColor={Colors.text.tertiary}
            title="Terms of Service"
            onPress={handleTerms}
          />
          <SettingsItem
            symbol={'\u2709'}
            symbolColor={Colors.accent.primary}
            title="Send Feedback"
            subtitle="We'd love to hear from you"
            onPress={() => {
              Linking.openURL('mailto:support@questhabit.app?subject=QuestHabit Feedback').catch(() => {
                Alert.alert('Feedback', 'Send feedback to support@questhabit.app');
              });
            }}
          />
          <View style={styles.settingsItem}>
            <IconBadge symbol={Icons.info} color={Colors.text.muted} size="sm" />
            <View style={styles.settingsContent}>
              <Text style={styles.settingsTitle}>Version</Text>
              <Text style={styles.settingsSubtitle}>1.0.0</Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Sign Out */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut} activeOpacity={0.7}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: Spacing['3xl'] }} />
    </ScrollView>
  );
}

function SettingsItem({
  symbol,
  symbolColor,
  title,
  subtitle,
  isLast,
  destructive,
  onPress,
}: {
  symbol: string;
  symbolColor: string;
  title: string;
  subtitle?: string;
  isLast?: boolean;
  destructive?: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.settingsItem, !isLast && styles.settingsItemBorder]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <IconBadge
        symbol={symbol}
        color={destructive ? Colors.semantic.error : symbolColor}
        size="sm"
      />
      <View style={styles.settingsContent}>
        <Text style={[styles.settingsTitle, destructive && styles.destructiveText]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.settingsSubtitle, destructive && styles.destructiveSubtext]}>
            {subtitle}
          </Text>
        )}
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
  section: {
    marginBottom: Spacing.xl,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.accent.muted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.accent.primary,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...Typography.bodySemibold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  profileEmail: {
    ...Typography.caption,
    color: Colors.text.tertiary,
  },
  chevron: {
    fontSize: 20,
    color: Colors.text.muted,
  },
  proBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  proBannerText: {
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
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: Spacing.sm,
  },
  settingsItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  settingsContent: {
    flex: 1,
  },
  settingsTitle: {
    ...Typography.bodyMedium,
    color: Colors.text.primary,
  },
  settingsSubtitle: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    marginTop: 1,
  },
  destructiveText: {
    color: Colors.semantic.error,
  },
  destructiveSubtext: {
    color: Colors.semantic.error,
    opacity: 0.7,
  },
  signOutButton: {
    backgroundColor: Colors.bg.elevated,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.semantic.errorMuted,
    alignItems: 'center',
  },
  signOutText: {
    color: Colors.semantic.error,
    ...Typography.bodySemibold,
  },
  authContainer: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
    padding: Spacing['3xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  authIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Colors.accent.ghost,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  authIconText: {
    fontSize: 28,
    color: Colors.accent.primary,
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
  },
});
