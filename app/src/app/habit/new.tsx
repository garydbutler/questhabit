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
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
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
  HABIT_EMOJIS,
  HABIT_COLORS,
} from '../../constants';

export default function NewHabitScreen() {
  const router = useRouter();
  const { createHabit, isLoading } = useHabitStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HabitCategory>('custom');
  const [frequency, setFrequency] = useState<FrequencyType>('daily');
  const [difficulty, setDifficulty] = useState<HabitDifficulty>('medium');
  const [icon, setIcon] = useState('⭐');
  const [color, setColor] = useState('#6366F1');
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

      {/* Submit */}
      <View style={styles.submitSection}>
        <Button
          title="Create Habit"
          onPress={handleCreate}
          loading={isLoading}
          disabled={!name.trim()}
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
  submitSection: {
    marginTop: 12,
  },
});
