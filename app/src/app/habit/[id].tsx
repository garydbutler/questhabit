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
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
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
  HABIT_EMOJIS,
  HABIT_COLORS,
} from '../../constants';

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
  const [icon, setIcon] = useState('⭐');
  const [color, setColor] = useState('#6366F1');
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
      <Card style={styles.streakCard}>
        <View style={styles.streakInfo}>
          <View style={styles.streakItem}>
            <Text style={styles.streakValue}>🔥 {habit.streak?.currentStreak || 0}</Text>
            <Text style={styles.streakLabel}>Current Streak</Text>
          </View>
          <View style={styles.streakItem}>
            <Text style={styles.streakValue}>⭐ {habit.streak?.bestStreak || 0}</Text>
            <Text style={styles.streakLabel}>Best Streak</Text>
          </View>
        </View>
      </Card>

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
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.pickerButton, { backgroundColor: color }]}
            onPress={() => setShowIconPicker(!showIconPicker)}
          >
            <Text style={styles.iconPreview}>{icon}</Text>
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
            <View style={styles.emojiGrid}>
              {HABIT_EMOJIS.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={[
                    styles.emojiButton,
                    icon === emoji && styles.emojiButtonSelected,
                  ]}
                  onPress={() => {
                    setIcon(emoji);
                    setShowIconPicker(false);
                  }}
                >
                  <Text style={styles.emoji}>{emoji}</Text>
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
        <Text style={styles.sectionTitle}>Category</Text>
        <View style={styles.optionsGrid}>
          {(Object.keys(CATEGORY_LABELS) as HabitCategory[]).map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.option,
                category === cat && { borderColor: CATEGORY_COLORS[cat] },
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text style={styles.optionText}>{CATEGORY_LABELS[cat]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Frequency */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequency</Text>
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
        <Text style={styles.sectionTitle}>Difficulty</Text>
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
              <Text style={styles.xpText}>+{XP_VALUES[diff]} XP</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title="Save Changes"
          onPress={handleSave}
          loading={isLoading}
          disabled={!name.trim()}
        />
        <Button
          title="Delete Habit"
          variant="ghost"
          onPress={handleDelete}
          textStyle={{ color: '#EF4444' }}
          style={styles.deleteButton}
        />
      </View>
    </ScrollView>
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
  notFound: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  notFoundText: {
    color: '#A1A1A1',
    fontSize: 16,
    marginBottom: 20,
  },
  streakCard: {
    marginBottom: 24,
  },
  streakInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  streakItem: {
    alignItems: 'center',
  },
  streakValue: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  streakLabel: {
    fontSize: 12,
    color: '#6B6B6B',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  pickerButton: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPreview: {
    fontSize: 32,
  },
  colorButton: {
    flex: 1,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  picker: {
    marginTop: 12,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emojiButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#252525',
  },
  emojiButtonSelected: {
    backgroundColor: '#6366F1',
  },
  emoji: {
    fontSize: 24,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: '30%',
    alignItems: 'center',
  },
  optionSelected: {
    borderColor: '#6366F1',
  },
  optionText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#6366F1',
  },
  xpText: {
    color: '#FBBF24',
    fontSize: 12,
    marginTop: 4,
  },
  actions: {
    marginTop: 12,
    gap: 12,
  },
  deleteButton: {
    marginTop: 8,
  },
});
