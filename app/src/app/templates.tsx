/**
 * Templates Screen — Browse and add habit templates.
 *
 * Organized by category with a "Popular" section at top.
 * Horizontal scrollable category chips to filter.
 * Full-screen route accessible from Home and New Habit screens.
 */

import React, { useState, useCallback } from 'react';
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
import { TemplateCard } from '../components/templates/TemplateCard';
import { TemplatePreview } from '../components/templates/TemplatePreview';
import { useHabitStore } from '../stores/habitStore';
import {
  HabitTemplate,
  TEMPLATE_COLLECTIONS,
  ALL_TEMPLATES,
  POPULAR_TEMPLATES,
  templateToInput,
} from '../lib/templates';
import { Colors, Typography, Spacing, Radius, Icons } from '../constants/design';

type FilterCategory = 'all' | 'popular' | 'health' | 'productivity' | 'learning' | 'wellness';

const FILTERS: { key: FilterCategory; label: string; color: string }[] = [
  { key: 'all', label: 'All', color: Colors.accent.primary },
  { key: 'popular', label: 'Popular', color: '#F59E0B' },
  { key: 'health', label: 'Health', color: '#10B981' },
  { key: 'productivity', label: 'Productivity', color: '#3B82F6' },
  { key: 'learning', label: 'Learning', color: '#8B5CF6' },
  { key: 'wellness', label: 'Wellness', color: '#EC4899' },
];

export default function TemplatesScreen() {
  const router = useRouter();
  const { createHabit } = useHabitStore();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [previewTemplate, setPreviewTemplate] = useState<HabitTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);

  const filteredTemplates = getFilteredTemplates(activeFilter);

  const handleAdd = useCallback(async (template: HabitTemplate) => {
    setAddingId(template.id);
    try {
      const input = templateToInput(template);
      const result = await createHabit(input);
      if (result.success) {
        setShowPreview(false);
        Alert.alert(
          'Quest Added!',
          `"${template.name}" has been added to your quests.`,
          [
            { text: 'Add More', style: 'cancel' },
            { text: 'Go to Today', onPress: () => router.replace('/(tabs)') },
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to add quest');
      }
    } finally {
      setAddingId(null);
    }
  }, [createHabit, router]);

  const handlePreview = useCallback((template: HabitTemplate) => {
    setPreviewTemplate(template);
    setShowPreview(true);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0B0F1A', '#111827']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.backIcon}>{Icons.back}</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Quest Templates</Text>
          <Text style={styles.subtitle}>{ALL_TEMPLATES.length} templates to get you started</Text>
        </View>
      </View>

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
        style={styles.filterScroll}
      >
        {FILTERS.map(filter => {
          const isActive = activeFilter === filter.key;
          return (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterChip,
                isActive && { backgroundColor: `${filter.color}20`, borderColor: filter.color },
              ]}
              onPress={() => setActiveFilter(filter.key)}
            >
              <Text
                style={[
                  styles.filterText,
                  isActive && { color: filter.color },
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Template List */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {activeFilter === 'all' ? (
          // Show by collection
          TEMPLATE_COLLECTIONS.map(collection => (
            <View key={collection.id} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionIcon, { color: collection.color }]}>
                  {collection.icon}
                </Text>
                <View>
                  <Text style={styles.sectionTitle}>{collection.title}</Text>
                  <Text style={styles.sectionSubtitle}>{collection.subtitle}</Text>
                </View>
              </View>
              {collection.templates.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onAdd={handleAdd}
                  onPreview={handlePreview}
                />
              ))}
            </View>
          ))
        ) : (
          // Show filtered list
          <View style={styles.section}>
            {filteredTemplates.map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                onAdd={handleAdd}
                onPreview={handlePreview}
              />
            ))}
            {filteredTemplates.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No templates in this category yet</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Preview Modal */}
      <TemplatePreview
        template={previewTemplate}
        visible={showPreview}
        onClose={() => setShowPreview(false)}
        onAdd={handleAdd}
      />
    </View>
  );
}

function getFilteredTemplates(filter: FilterCategory): HabitTemplate[] {
  switch (filter) {
    case 'all':
      return ALL_TEMPLATES;
    case 'popular':
      return POPULAR_TEMPLATES;
    default:
      return ALL_TEMPLATES.filter(t => t.category === filter);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bg.elevated,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 18,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  title: {
    ...Typography.h2,
    color: Colors.text.primary,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  filterScroll: {
    maxHeight: 44,
  },
  filterContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    backgroundColor: Colors.bg.elevated,
    borderWidth: 1.5,
    borderColor: Colors.border.primary,
  },
  filterText: {
    ...Typography.captionMedium,
    color: Colors.text.tertiary,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing['5xl'],
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    paddingTop: Spacing.sm,
  },
  sectionIcon: {
    fontSize: 22,
    fontWeight: '700',
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
  },
  sectionSubtitle: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    marginTop: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
  },
  emptyText: {
    ...Typography.body,
    color: Colors.text.muted,
  },
});
