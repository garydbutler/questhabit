import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useHabitStore } from '../../stores/habitStore';
import { Input } from '../../components/ui/Input';
import { GradientButton } from '../../components/ui/GradientButton';
import { Card } from '../../components/ui/Card';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { IconBadge } from '../../components/ui/IconBadge';
import {
  HabitCategory,
  HabitDifficulty,
  FrequencyType,
  CreateHabitInput,
} from '../../types';
import {
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  DIFFICULTY_LABELS,
  XP_VALUES,
  HABIT_ICONS,
  HABIT_COLORS,
} from '../../constants';
import { Colors, Typography, Spacing, Radius, Icons } from '../../constants/design';

export default function NewHabitScreen() {
  const router = useRouter();
  const { createHabit, isLoading } = useHabitStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HabitCategory>('custom');
  const [frequency, setFrequency] = useState<FrequencyType>('daily');
  const [difficulty, setDifficulty] = useState<HabitDifficulty>('medium');
  const [icon, setIcon] = useState('\u2726');
  const [color, setColor] = useState('#06B6D4');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    const input: CreateHabitInput = {
      name: name.trim(),
      description: description.trim() || undefined,
      category,
      frequency: { type: frequency },
      difficulty,
      icon,
      color,
    };

    const result = await createHabit(input);
    if (result.success) {
      router.back();
    } else {
      Alert.alert('Error', result.error || 'Failed to create habit');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Template Shortcut Banner */}
      <TouchableOpacity
        style={styles.templateBanner}
        onPress={() => router.push('/templates')}
        activeOpacity={0.7}
      >
        <View style={styles.templateBannerIcon}>
          <Text style={styles.templateBannerIconText}>{Icons.trophy}</Text>
        </View>
        <View style={styles.templateBannerContent}>
          <Text style={styles.templateBannerTitle}>Start from a template</Text>
          <Text style={styles.templateBannerSubtitle}>25+ pre-built quests to choose from</Text>
        </View>
        <Text style={styles.templateBannerChevron}>{Icons.chevronRight}</Text>
      </TouchableOpacity>

      {/* Name & Description */}
      <View style={styles.section}>
        <Input
          label="Habit Name"
          placeholder="e.g., Morning meditation"
          value={name}
          onChangeText={setName}
          maxLength={50}
        />
        <Input
          label="Description (optional)"
          placeholder="Why is this habit important to you?"
          value={description}
          onChangeText={setDescription}
          multiline
          maxLength={200}
        />
      </View>

      {/* Icon & Color */}
      <View style={styles.section}>
        <SectionHeader title="Appearance" />
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.pickerButton, { backgroundColor: `${color}20` }]}
            onPress={() => setShowIconPicker(!showIconPicker)}
          >
            <Text style={[styles.iconPreview, { color }]}>{icon}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.colorButton, { backgroundColor: color }]}
            onPress={() => setShowColorPicker(!showColorPicker)}
          >
            <Text style={styles.colorLabel}>Color</Text>
          </TouchableOpacity>
        </View>

        {showIconPicker && (
          <Card style={styles.picker}>
            <View style={styles.iconGrid}>
              {HABIT_ICONS.map((ic) => (
                <TouchableOpacity
                  key={ic}
                  style={[
                    styles.iconButton,
                    icon === ic && { backgroundColor: Colors.accent.muted, borderColor: Colors.accent.primary },
                  ]}
                  onPress={() => {
                    setIcon(ic);
                    setShowIconPicker(false);
                  }}
                >
                  <Text style={[styles.iconSymbol, icon === ic && { color: Colors.accent.primary }]}>{ic}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        )}

        {showColorPicker && (
          <Card style={styles.picker}>
            <View style={styles.colorGrid}>
              {HABIT_COLORS.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.colorOption,
                    { backgroundColor: c },
                    color === c && styles.colorOptionSelected,
                  ]}
                  onPress={() => {
                    setColor(c);
                    setShowColorPicker(false);
                  }}
                />
              ))}
            </View>
          </Card>
        )}
      </View>

      {/* Category */}
      <View style={styles.section}>
        <SectionHeader title="Category" />
        <View style={styles.optionsGrid}>
          {(Object.keys(CATEGORY_LABELS) as HabitCategory[]).map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.option,
                category === cat && { borderColor: CATEGORY_COLORS[cat], backgroundColor: `${CATEGORY_COLORS[cat]}10` },
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[
                styles.optionText,
                category === cat && { color: CATEGORY_COLORS[cat] },
              ]}>
                {CATEGORY_LABELS[cat]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Frequency */}
      <View style={styles.section}>
        <SectionHeader title="Frequency" />
        <View style={styles.optionsGrid}>
          {(['daily', 'weekdays', 'weekends'] as FrequencyType[]).map((freq) => (
            <TouchableOpacity
              key={freq}
              style={[
                styles.option,
                frequency === freq && styles.optionSelected,
              ]}
              onPress={() => setFrequency(freq)}
            >
              <Text
                style={[
                  styles.optionText,
                  frequency === freq && styles.optionTextSelected,
                ]}
              >
                {freq.charAt(0).toUpperCase() + freq.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Difficulty */}
      <View style={styles.section}>
        <SectionHeader title="Difficulty" />
        <View style={styles.optionsGrid}>
          {(Object.keys(DIFFICULTY_LABELS) as HabitDifficulty[]).map((diff) => (
            <TouchableOpacity
              key={diff}
              style={[
                styles.option,
                difficulty === diff && styles.optionSelected,
              ]}
              onPress={() => setDifficulty(diff)}
            >
              <Text
                style={[
                  styles.optionText,
                  difficulty === diff && styles.optionTextSelected,
                ]}
              >
                {DIFFICULTY_LABELS[diff]}
              </Text>
              <Text style={styles.xpText}>
                {Icons.xp} +{XP_VALUES[diff]} XP
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Submit */}
      <View style={styles.submitSection}>
        <GradientButton
          title="Create Quest"
          onPress={handleCreate}
          loading={isLoading}
          disabled={!name.trim()}
          fullWidth
          size="lg"
        />
      </View>
    </ScrollView>
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
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  pickerButton: {
    width: 64,
    height: 64,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  iconPreview: {
    fontSize: 28,
    fontWeight: '700',
  },
  colorButton: {
    flex: 1,
    height: 64,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorLabel: {
    color: Colors.white,
    fontWeight: '600',
  },
  picker: {
    marginTop: Spacing.sm,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bg.subtle,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  iconSymbol: {
    fontSize: 20,
    color: Colors.text.secondary,
    fontWeight: '700',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: Colors.white,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  option: {
    backgroundColor: Colors.bg.elevated,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border.primary,
    minWidth: '30%',
    alignItems: 'center',
  },
  optionSelected: {
    borderColor: Colors.accent.primary,
    backgroundColor: Colors.accent.ghost,
  },
  optionText: {
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: Colors.accent.primary,
  },
  xpText: {
    color: Colors.xp.primary,
    fontSize: 12,
    marginTop: Spacing.xxs,
    fontWeight: '600',
  },
  templateBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent.ghost,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.accent.muted,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  templateBannerIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.accent.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateBannerIconText: {
    fontSize: 18,
    color: Colors.accent.primary,
    fontWeight: '700',
  },
  templateBannerContent: {
    flex: 1,
  },
  templateBannerTitle: {
    ...Typography.bodySemibold,
    color: Colors.accent.primary,
  },
  templateBannerSubtitle: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    marginTop: 1,
  },
  templateBannerChevron: {
    fontSize: 18,
    color: Colors.accent.primary,
  },
  submitSection: {
    marginTop: Spacing.sm,
  },
});
