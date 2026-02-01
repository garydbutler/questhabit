import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useHabitStore } from '../../stores/habitStore';
import { Input } from '../../components/ui/Input';
import { GradientButton } from '../../components/ui/GradientButton';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { GradientCard } from '../../components/ui/GradientCard';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { ChipTag } from '../../components/ui/ChipTag';
import {
  HabitCategory,
  HabitDifficulty,
  FrequencyType,
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

export default function EditHabitScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { habits, updateHabit, deleteHabit, isLoading } = useHabitStore();
  
  const habit = habits.find(h => h.id === id);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HabitCategory>('custom');
  const [frequency, setFrequency] = useState<FrequencyType>('daily');
  const [difficulty, setDifficulty] = useState<HabitDifficulty>('medium');
  const [icon, setIcon] = useState('\u2726');
  const [color, setColor] = useState('#06B6D4');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setDescription(habit.description || '');
      setCategory(habit.category);
      setFrequency(habit.frequency.type);
      setDifficulty(habit.difficulty);
      setIcon(habit.icon);
      setColor(habit.color);
    }
  }, [habit]);

  if (!habit) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Habit not found</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    const result = await updateHabit(habit.id, {
      name: name.trim(),
      description: description.trim() || undefined,
      category,
      frequency: { type: frequency },
      difficulty,
      icon,
      color,
    });

    if (result.success) {
      router.back();
    } else {
      Alert.alert('Error', result.error || 'Failed to update habit');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit.name}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteHabit(habit.id);
            if (result.success) {
              router.back();
            } else {
              Alert.alert('Error', result.error || 'Failed to delete habit');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Streak Info */}
      <GradientCard variant="accent" style={styles.streakCard}>
        <View style={styles.streakInfo}>
          <View style={styles.streakItem}>
            <ChipTag
              label={`${habit.streak?.currentStreak || 0}`}
              color={Colors.streak.primary}
              icon={Icons.streak}
              size="md"
            />
            <Text style={styles.streakLabel}>Current Streak</Text>
          </View>
          <View style={styles.streakDivider} />
          <View style={styles.streakItem}>
            <ChipTag
              label={`${habit.streak?.bestStreak || 0}`}
              color={Colors.xp.primary}
              icon={Icons.trophy}
              size="md"
            />
            <Text style={styles.streakLabel}>Best Streak</Text>
          </View>
        </View>
      </GradientCard>

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
                    styles.iconButtonItem,
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
              <Text style={[styles.optionText, category === cat && { color: CATEGORY_COLORS[cat] }]}>
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

      {/* Share Streak */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.shareStreakButton}
          onPress={() => router.push(`/share-preview?type=streak&habitId=${habit.id}` as any)}
          activeOpacity={0.7}
        >
          <Text style={styles.shareStreakIcon}>{'\u2197'}</Text>
          <Text style={styles.shareStreakText}>Share Streak Card</Text>
        </TouchableOpacity>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <GradientButton
          title="Save Changes"
          onPress={handleSave}
          loading={isLoading}
          disabled={!name.trim()}
          fullWidth
          size="lg"
        />
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} activeOpacity={0.7}>
          <Text style={styles.deleteText}>Delete Habit</Text>
        </TouchableOpacity>
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
  notFound: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['3xl'],
  },
  notFoundText: {
    color: Colors.text.tertiary,
    ...Typography.body,
    marginBottom: Spacing.lg,
  },
  streakCard: {
    marginBottom: Spacing.xl,
  },
  streakInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  streakItem: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  streakDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border.primary,
  },
  streakLabel: {
    ...Typography.caption,
    color: Colors.text.tertiary,
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
  iconButtonItem: {
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
  shareStreakButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent.ghost,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.accent.primary + '30',
  },
  shareStreakIcon: {
    fontSize: 18,
    color: Colors.accent.primary,
    fontWeight: '600',
  },
  shareStreakText: {
    ...Typography.bodySemibold,
    color: Colors.accent.primary,
  },
  actions: {
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  deleteButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
    backgroundColor: Colors.semantic.errorMuted,
    borderRadius: Radius.md,
  },
  deleteText: {
    color: Colors.semantic.error,
    ...Typography.bodySemibold,
  },
});
