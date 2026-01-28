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
        <Text style={styles.authTitle}>Join HabitHero</Text>
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
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(user.displayName || user.email)[0].toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{user.displayName || 'Hero'}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* Level Card */}
      <View style={styles.section}>
        <LevelBadge totalXP={user.totalXp} />
      </View>

      {/* Pro Status */}
      <View style={styles.section}>
        <Card>
          <View style={styles.proCard}>
            <View>
              <Text style={styles.proTitle}>
                {user.isPro ? '✨ Pro Member' : 'Upgrade to Pro'}
              </Text>
              <Text style={styles.proSubtitle}>
                {user.isPro
                  ? 'Thank you for supporting HabitHero!'
                  : 'Unlimited habits, AI coach, and more'}
              </Text>
            </View>
            {!user.isPro && (
              <TouchableOpacity style={styles.upgradeButton}>
                <Text style={styles.upgradeText}>$4.99/mo</Text>
              </TouchableOpacity>
            )}
          </View>
        </Card>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <Card>
          <SettingsItem
            icon="🔔"
            title="Notifications"
            subtitle="Manage reminders"
          />
          <SettingsItem
            icon="🎨"
            title="Appearance"
            subtitle="Dark mode (default)"
          />
          <SettingsItem
            icon="🌍"
            title="Timezone"
            subtitle={user.timezone}
          />
          <SettingsItem
            icon="📤"
            title="Export Data"
            subtitle="Download your data"
            isLast
          />
        </Card>
      </View>

      {/* Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <Card>
          <SettingsItem icon="❓" title="Help & FAQ" />
          <SettingsItem icon="💬" title="Send Feedback" />
          <SettingsItem icon="⭐" title="Rate HabitHero" isLast />
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
      <Text style={styles.version}>HabitHero v1.0.0</Text>
    </ScrollView>
  );
}

function SettingsItem({
  icon,
  title,
  subtitle,
  isLast,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  isLast?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.settingsItem, !isLast && styles.settingsItemBorder]}
    >
      <Text style={styles.settingsIcon}>{icon}</Text>
      <View style={styles.settingsContent}>
        <Text style={styles.settingsTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingsSubtitle}>{subtitle}</Text>}
      </View>
      <Text style={styles.settingsChevron}>›</Text>
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
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  proCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  proTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  proSubtitle: {
    fontSize: 14,
    color: '#A1A1A1',
  },
  upgradeButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  upgradeText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
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
  settingsChevron: {
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
