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
      '⚠️ Delete Account',
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
    Alert.alert('Thank You! ⭐', 'Thanks for wanting to rate QuestHabit! App Store rating will be available once the app is published.');
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
        <Text style={styles.sectionTitle}>Profile</Text>
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
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </Card>
      </View>

      {/* Pro Status */}
      {!user.isPro && (
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.proBanner}
            onPress={() => router.push('/pro')}
            activeOpacity={0.8}
          >
            <View style={styles.proBannerContent}>
              <Text style={styles.proBannerIcon}>👑</Text>
              <View style={styles.proBannerText}>
                <Text style={styles.proBannerTitle}>Upgrade to Pro</Text>
                <Text style={styles.proBannerSubtitle}>
                  Unlimited habits, AI coach & more
                </Text>
              </View>
            </View>
            <Text style={styles.proBannerChevron}>›</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* App Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        <Card>
          <View style={[styles.settingsItem, styles.settingsItemBorder]}>
            <Text style={styles.settingsIcon}>🔔</Text>
            <View style={styles.settingsContent}>
              <Text style={styles.settingsTitle}>Notifications</Text>
              <Text style={styles.settingsSubtitle}>Habit reminders</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#252525', true: '#6366F1' }}
              thumbColor="#FFFFFF"
            />
          </View>
          <SettingsItem
            icon="⏰"
            title="Default Reminder"
            subtitle={dailyReminderTime}
            onPress={() => {
              Alert.alert('Coming Soon', 'Custom reminder time picker will be available in a future update.');
            }}
          />
          <SettingsItem
            icon="🎨"
            title="Theme"
            subtitle="Dark (default)"
            onPress={() => {
              Alert.alert('Theme', 'Dark mode is the default theme. More themes coming with Pro!');
            }}
          />
          <SettingsItem
            icon="🌍"
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
        <Text style={styles.sectionTitle}>Data</Text>
        <Card>
          <SettingsItem
            icon="📤"
            title="Export Data"
            subtitle="Download your habits & progress"
            onPress={handleExportData}
          />
          <SettingsItem
            icon="🗑️"
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
        <Text style={styles.sectionTitle}>About</Text>
        <Card>
          <SettingsItem
            icon="⭐"
            title="Rate QuestHabit"
            subtitle="Help us with a review"
            onPress={handleRateApp}
          />
          <SettingsItem
            icon="🔒"
            title="Privacy Policy"
            onPress={handlePrivacyPolicy}
          />
          <SettingsItem
            icon="📄"
            title="Terms of Service"
            onPress={handleTerms}
          />
          <SettingsItem
            icon="💬"
            title="Send Feedback"
            subtitle="We'd love to hear from you"
            onPress={() => {
              Linking.openURL('mailto:support@questhabit.app?subject=QuestHabit Feedback').catch(() => {
                Alert.alert('Feedback', 'Send feedback to support@questhabit.app');
              });
            }}
          />
          <View style={[styles.settingsItem]}>
            <Text style={styles.settingsIcon}>ℹ️</Text>
            <View style={styles.settingsContent}>
              <Text style={styles.settingsTitle}>Version</Text>
              <Text style={styles.settingsSubtitle}>1.0.0</Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Sign Out */}
      <View style={styles.section}>
        <Button
          title="Sign Out"
          variant="ghost"
          onPress={handleSignOut}
          textStyle={{ color: '#EF4444' }}
          style={styles.signOutButton}
        />
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function SettingsItem({
  icon,
  title,
  subtitle,
  isLast,
  destructive,
  onPress,
}: {
  icon: string;
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
      <Text style={styles.settingsIcon}>{icon}</Text>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 13,
    color: '#A1A1A1',
  },
  chevron: {
    fontSize: 24,
    color: '#6B6B6B',
  },
  proBanner: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  proBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  proBannerIcon: {
    fontSize: 28,
    marginRight: 14,
  },
  proBannerText: {
    flex: 1,
  },
  proBannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  proBannerSubtitle: {
    fontSize: 13,
    color: '#A1A1A1',
  },
  proBannerChevron: {
    fontSize: 24,
    color: '#6366F1',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  settingsItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#252525',
  },
  settingsIcon: {
    fontSize: 20,
    marginRight: 14,
  },
  settingsContent: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  settingsSubtitle: {
    fontSize: 12,
    color: '#6B6B6B',
    marginTop: 2,
  },
  destructiveText: {
    color: '#EF4444',
  },
  destructiveSubtext: {
    color: '#EF4444',
    opacity: 0.7,
  },
  signOutButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    paddingVertical: 16,
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
  },
});
