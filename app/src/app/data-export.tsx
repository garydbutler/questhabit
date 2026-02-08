/**
 * DataExport — Export your QuestHabit data as JSON or CSV
 * 
 * Accessible from Settings screen.
 * Respects data ownership — users should always be able to export their data.
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { useAuthStore } from '../stores/authStore';
import { useHabitStore } from '../stores/habitStore';
import { buildExportData, exportAsJSON, exportAsCSV, ExportData } from '../lib/export';
import { supabase } from '../lib/supabase';
import { Card } from '../components/ui/Card';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Colors, Typography, Spacing, Radius, Icons } from '../constants/design';

export default function DataExportScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { habits } = useHabitStore();
  const [exporting, setExporting] = useState<'json' | 'csv' | null>(null);
  const [allCompletions, setAllCompletions] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadAllCompletions();
  }, [user]);

  const loadAllCompletions = async () => {
    if (!user) {
      setLoadingData(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('completions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_date', { ascending: false });

      if (error) throw error;

      setAllCompletions(
        (data || []).map((c: any) => ({
          id: c.id,
          habitId: c.habit_id,
          userId: c.user_id,
          completedAt: c.completed_at,
          completedDate: c.completed_date,
          xpEarned: c.xp_earned,
          streakBonus: c.streak_bonus,
          timeBonus: c.time_bonus,
        }))
      );
    } catch (error) {
      console.error('Failed to load completions:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleExport = async (format: 'json' | 'csv') => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to export your data.');
      return;
    }

    setExporting(format);
    try {
      const exportData = buildExportData(habits, allCompletions, {
        level: user.level,
        totalXp: user.totalXp,
        createdAt: user.createdAt,
      });

      const success = format === 'json'
        ? await exportAsJSON(exportData)
        : await exportAsCSV(exportData);

      if (success) {
        // Success handled by share sheet
      }
    } catch (error) {
      Alert.alert('Export Failed', 'Something went wrong. Please try again.');
      console.error('Export error:', error);
    } finally {
      setExporting(null);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Sign in to export your data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>{Icons.back}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Export Data</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Banner */}
        <Card style={styles.infoBanner}>
          <View style={styles.infoBannerInner}>
            <Text style={styles.infoIcon}>{Icons.info}</Text>
            <View style={styles.infoTextWrap}>
              <Text style={styles.infoTitle}>Your data, your choice</Text>
              <Text style={styles.infoText}>
                Export all your habits, streaks, completions, and stats.
                We believe you should always have access to your data.
              </Text>
            </View>
          </View>
        </Card>

        {/* Data Summary */}
        <View style={styles.section}>
          <SectionHeader title="What's Included" />
          <Card>
            {loadingData ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color={Colors.accent.primary} />
                <Text style={styles.loadingText}>Loading your data...</Text>
              </View>
            ) : (
              <>
                <DataRow
                  label="Habits"
                  value={`${habits.length} habits`}
                  icon={Icons.today}
                  color={Colors.accent.primary}
                />
                <DataRow
                  label="Completions"
                  value={`${allCompletions.length} records`}
                  icon={Icons.check}
                  color={Colors.semantic.success}
                />
                <DataRow
                  label="Total XP"
                  value={`${user.totalXp.toLocaleString()} XP`}
                  icon={Icons.xp}
                  color={Colors.xp.primary}
                />
                <DataRow
                  label="Member Since"
                  value={format(new Date(user.createdAt), 'MMM d, yyyy')}
                  icon={Icons.profile}
                  color={Colors.semantic.info}
                  isLast
                />
              </>
            )}
          </Card>
        </View>

        {/* Export Options */}
        <View style={styles.section}>
          <SectionHeader title="Export Format" />

          <TouchableOpacity
            style={styles.exportOption}
            onPress={() => handleExport('json')}
            disabled={exporting !== null || loadingData}
            activeOpacity={0.7}
          >
            <View style={[styles.exportIconWrap, { backgroundColor: Colors.accent.ghost }]}>
              <Text style={[styles.exportIcon, { color: Colors.accent.primary }]}>
                {'{ }'}
              </Text>
            </View>
            <View style={styles.exportInfo}>
              <Text style={styles.exportTitle}>JSON</Text>
              <Text style={styles.exportDesc}>
                Structured data format. Best for developers or importing into other apps.
              </Text>
            </View>
            {exporting === 'json' ? (
              <ActivityIndicator size="small" color={Colors.accent.primary} />
            ) : (
              <Text style={styles.exportArrow}>{Icons.chevronRight}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.exportOption}
            onPress={() => handleExport('csv')}
            disabled={exporting !== null || loadingData}
            activeOpacity={0.7}
          >
            <View style={[styles.exportIconWrap, { backgroundColor: Colors.semantic.successMuted }]}>
              <Text style={[styles.exportIcon, { color: Colors.semantic.success }]}>
                {Icons.stats}
              </Text>
            </View>
            <View style={styles.exportInfo}>
              <Text style={styles.exportTitle}>CSV</Text>
              <Text style={styles.exportDesc}>
                Spreadsheet format. Opens in Excel, Google Sheets, or Numbers.
              </Text>
            </View>
            {exporting === 'csv' ? (
              <ActivityIndicator size="small" color={Colors.semantic.success} />
            ) : (
              <Text style={styles.exportArrow}>{Icons.chevronRight}</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Privacy Note */}
        <View style={styles.section}>
          <Card style={styles.privacyCard}>
            <Text style={styles.privacyTitle}>Privacy Note</Text>
            <Text style={styles.privacyText}>
              Your exported file contains only your data. It is generated
              locally on your device and shared via your chosen method.
              We never share your data with third parties.
            </Text>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

function DataRow({
  label,
  value,
  icon,
  color,
  isLast,
}: {
  label: string;
  value: string;
  icon: string;
  color: string;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.dataRow, !isLast && styles.dataRowBorder]}>
      <View style={[styles.dataIcon, { backgroundColor: color + '15' }]}>
        <Text style={[styles.dataIconText, { color }]}>{icon}</Text>
      </View>
      <Text style={styles.dataLabel}>{label}</Text>
      <Text style={styles.dataValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing['3xl'],
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing['4xl'],
  },
  section: {
    marginBottom: Spacing.xl,
  },
  infoBanner: {
    marginBottom: Spacing.xl,
    borderColor: Colors.accent.primary + '30',
  },
  infoBannerInner: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  infoIcon: {
    fontSize: 18,
    color: Colors.accent.primary,
    marginTop: 2,
  },
  infoTextWrap: {
    flex: 1,
  },
  infoTitle: {
    ...Typography.bodySemibold,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  infoText: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    lineHeight: 18,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  loadingText: {
    ...Typography.caption,
    color: Colors.text.tertiary,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: Spacing.sm,
  },
  dataRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  dataIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataIconText: {
    fontSize: 14,
    fontWeight: '700',
  },
  dataLabel: {
    ...Typography.bodyMedium,
    color: Colors.text.primary,
    flex: 1,
  },
  dataValue: {
    ...Typography.captionMedium,
    color: Colors.text.tertiary,
  },
  exportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.elevated,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  exportIconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportIcon: {
    fontSize: 16,
    fontWeight: '700',
  },
  exportInfo: {
    flex: 1,
  },
  exportTitle: {
    ...Typography.bodySemibold,
    color: Colors.text.primary,
  },
  exportDesc: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  exportArrow: {
    fontSize: 20,
    color: Colors.text.muted,
  },
  privacyCard: {
    borderColor: Colors.border.subtle,
  },
  privacyTitle: {
    ...Typography.captionMedium,
    color: Colors.text.tertiary,
    marginBottom: 4,
  },
  privacyText: {
    ...Typography.caption,
    color: Colors.text.muted,
    lineHeight: 18,
  },
  emptyText: {
    color: Colors.text.tertiary,
    textAlign: 'center',
    marginTop: Spacing['3xl'],
    ...Typography.body,
  },
});
