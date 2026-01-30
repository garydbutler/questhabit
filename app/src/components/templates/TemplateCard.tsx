/**
 * TemplateCard — Compact card for browsing habit templates.
 *
 * Shows icon, name, difficulty badge, and one-tap "Add" action.
 * Matches the premium dark design system.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { HabitTemplate } from '../../lib/templates';
import { Colors, Typography, Spacing, Radius, Shadows, Icons } from '../../constants/design';
import { DIFFICULTY_LABELS, XP_VALUES } from '../../constants';

interface TemplateCardProps {
  template: HabitTemplate;
  onAdd: (template: HabitTemplate) => void;
  onPreview?: (template: HabitTemplate) => void;
}

const difficultyColor: Record<string, string> = {
  easy: '#10B981',
  medium: '#F59E0B',
  hard: '#EF4444',
};

export function TemplateCard({ template, onAdd, onPreview }: TemplateCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPreview?.(template)}
      activeOpacity={0.7}
    >
      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: `${template.color}15` }]}>
        <Text style={[styles.icon, { color: template.color }]}>{template.icon}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{template.name}</Text>
        <Text style={styles.description} numberOfLines={1}>{template.description}</Text>
        <View style={styles.meta}>
          <View style={[styles.diffBadge, { backgroundColor: `${difficultyColor[template.difficulty]}18` }]}>
            <Text style={[styles.diffText, { color: difficultyColor[template.difficulty] }]}>
              {DIFFICULTY_LABELS[template.difficulty]}
            </Text>
          </View>
          <Text style={styles.xpText}>
            {Icons.xp} +{XP_VALUES[template.difficulty]}
          </Text>
          <Text style={styles.freqText}>
            {template.frequencyType === 'daily' ? 'Daily' :
             template.frequencyType === 'weekdays' ? 'Weekdays' : 'Weekends'}
          </Text>
        </View>
      </View>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => onAdd(template)}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Text style={styles.addIcon}>{Icons.add}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.elevated,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  icon: {
    fontSize: 22,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  name: {
    ...Typography.bodySemibold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  description: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    marginBottom: Spacing.xs,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  diffBadge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  diffText: {
    fontSize: 11,
    fontWeight: '600',
  },
  xpText: {
    ...Typography.caption,
    color: Colors.xp.primary,
    fontWeight: '600',
  },
  freqText: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accent.ghost,
    borderWidth: 1,
    borderColor: Colors.accent.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    fontSize: 18,
    color: Colors.accent.primary,
    fontWeight: '600',
  },
});
