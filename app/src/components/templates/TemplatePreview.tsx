/**
 * TemplatePreview — Bottom sheet / modal showing full template details.
 *
 * Displayed when a user taps a TemplateCard.
 * Shows description, difficulty, XP, frequency, suggested time.
 * One-tap "Add to My Quests" button.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { HabitTemplate } from '../../lib/templates';
import { GradientButton } from '../ui/GradientButton';
import { Colors, Typography, Spacing, Radius, Icons } from '../../constants/design';
import { DIFFICULTY_LABELS, XP_VALUES, CATEGORY_LABELS } from '../../constants';

interface TemplatePreviewProps {
  template: HabitTemplate | null;
  visible: boolean;
  onClose: () => void;
  onAdd: (template: HabitTemplate) => void;
}

const difficultyColor: Record<string, string> = {
  easy: '#10B981',
  medium: '#F59E0B',
  hard: '#EF4444',
};

export function TemplatePreview({ template, visible, onClose, onAdd }: TemplatePreviewProps) {
  if (!template) return null;

  const formatTime = (time?: string) => {
    if (!time) return null;
    const [h, m] = time.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${h12}:${m.toString().padStart(2, '0')} ${suffix}`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Icon & Title */}
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: `${template.color}15` }]}>
              <Text style={[styles.icon, { color: template.color }]}>{template.icon}</Text>
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>{template.name}</Text>
              <Text style={styles.category}>{CATEGORY_LABELS[template.category]}</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.description}>{template.description}</Text>

          {/* Details Grid */}
          <View style={styles.grid}>
            <DetailItem
              label="Difficulty"
              value={DIFFICULTY_LABELS[template.difficulty]}
              valueColor={difficultyColor[template.difficulty]}
            />
            <DetailItem
              label="XP Reward"
              value={`+${XP_VALUES[template.difficulty]} XP`}
              valueColor={Colors.xp.primary}
            />
            <DetailItem
              label="Frequency"
              value={
                template.frequencyType === 'daily' ? 'Every day' :
                template.frequencyType === 'weekdays' ? 'Mon-Fri' : 'Sat-Sun'
              }
            />
            {template.suggestedTime && (
              <DetailItem
                label="Suggested Time"
                value={formatTime(template.suggestedTime) || ''}
              />
            )}
          </View>

          {/* Tags */}
          {template.tags.length > 0 && (
            <View style={styles.tags}>
              {template.tags.map(tag => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            <GradientButton
              title="Add to My Quests"
              icon={Icons.add}
              onPress={() => onAdd(template)}
              fullWidth
              size="lg"
            />
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function DetailItem({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, valueColor ? { color: valueColor } : undefined]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.bg.elevated,
    borderTopLeftRadius: Radius['2xl'],
    borderTopRightRadius: Radius['2xl'],
    padding: Spacing.xl,
    paddingBottom: Spacing['4xl'],
    borderWidth: 1,
    borderColor: Colors.border.primary,
    borderBottomWidth: 0,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border.primary,
    alignSelf: 'center',
    marginBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  icon: {
    fontSize: 26,
    fontWeight: '700',
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...Typography.h2,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  category: {
    ...Typography.captionMedium,
    color: Colors.text.tertiary,
  },
  description: {
    ...Typography.body,
    color: Colors.text.secondary,
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  detailItem: {
    backgroundColor: Colors.bg.subtle,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minWidth: '46%',
    flex: 1,
  },
  detailLabel: {
    ...Typography.label,
    color: Colors.text.muted,
    marginBottom: Spacing.xxs,
  },
  detailValue: {
    ...Typography.bodySemibold,
    color: Colors.text.primary,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  tag: {
    backgroundColor: Colors.bg.subtle,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: Radius.full,
  },
  tagText: {
    ...Typography.caption,
    color: Colors.text.tertiary,
  },
  actions: {
    gap: Spacing.sm,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  cancelText: {
    ...Typography.bodyMedium,
    color: Colors.text.tertiary,
  },
});
