import { HabitCategory, HabitDifficulty, AchievementType } from '../types';

// XP values per difficulty
export const XP_VALUES: Record<HabitDifficulty, number> = {
  easy: 10,
  medium: 25,
  hard: 50,
};

// Level thresholds
export const LEVEL_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  1000,   // Level 5
  2000,   // Level 6
  4000,   // Level 7
  8000,   // Level 8
  16000,  // Level 9
  32000,  // Level 10
  64000,  // Level 11
  128000, // Level 12
];

// Category colors
export const CATEGORY_COLORS: Record<HabitCategory, string> = {
  health: '#22C55E',
  productivity: '#3B82F6',
  learning: '#8B5CF6',
  wellness: '#EC4899',
  custom: '#6366F1',
};

// Category labels
export const CATEGORY_LABELS: Record<HabitCategory, string> = {
  health: 'Health',
  productivity: 'Productivity',
  learning: 'Learning',
  wellness: 'Wellness',
  custom: 'Custom',
};

// Default habit icons by category
export const CATEGORY_ICONS: Record<HabitCategory, string> = {
  health: '💪',
  productivity: '🎯',
  learning: '📚',
  wellness: '🧘',
  custom: '⭐',
};

// Difficulty labels
export const DIFFICULTY_LABELS: Record<HabitDifficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

// Achievement definitions
export const ACHIEVEMENTS: Record<AchievementType, {
  name: string;
  description: string;
  icon: string;
  xpBonus: number;
}> = {
  first_step: {
    name: 'First Step',
    description: 'Complete your first habit',
    icon: '🚀',
    xpBonus: 50,
  },
  week_warrior: {
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    xpBonus: 100,
  },
  fortnight_fighter: {
    name: 'Fortnight Fighter',
    description: 'Maintain a 14-day streak',
    icon: '⚔️',
    xpBonus: 200,
  },
  monthly_master: {
    name: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: '👑',
    xpBonus: 500,
  },
  early_bird: {
    name: 'Early Bird',
    description: 'Complete a habit before 6 AM',
    icon: '🌅',
    xpBonus: 25,
  },
  night_owl: {
    name: 'Night Owl',
    description: 'Complete a habit after 10 PM',
    icon: '🦉',
    xpBonus: 25,
  },
  perfect_day: {
    name: 'Perfect Day',
    description: 'Complete all habits in a day',
    icon: '✨',
    xpBonus: 50,
  },
  perfect_week: {
    name: 'Perfect Week',
    description: '7 consecutive perfect days',
    icon: '🏆',
    xpBonus: 250,
  },
  habit_collector: {
    name: 'Habit Collector',
    description: 'Create 5 habits',
    icon: '📦',
    xpBonus: 50,
  },
  level_5: {
    name: 'Level 5',
    description: 'Reach level 5',
    icon: '⭐',
    xpBonus: 100,
  },
  level_10: {
    name: 'Level 10',
    description: 'Reach level 10',
    icon: '🌟',
    xpBonus: 250,
  },
};

// Common habit emojis for picker
export const HABIT_EMOJIS = [
  '💪', '🏃', '🧘', '💧', '🥗', '😴', '📚', '✍️',
  '🎯', '💼', '📱', '🧹', '🌱', '🎨', '🎵', '🧠',
  '💰', '🏋️', '🚴', '🏊', '🥤', '💊', '🦷', '🧴',
  '📝', '💻', '📖', '🎸', '🌞', '🌙', '⏰', '🔔',
];

// Color palette for habits
export const HABIT_COLORS = [
  '#6366F1', // Indigo
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#22C55E', // Green
  '#3B82F6', // Blue
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#84CC16', // Lime
];

// Free tier limits
export const FREE_TIER_LIMITS = {
  maxHabits: 5,
  historyDays: 30,
};

// Bonus multipliers
export const BONUSES = {
  morningHour: 9, // Before 9 AM
  morningBonus: 0.1, // +10%
  maxStreakBonus: 0.5, // +50%
  streakBonusPerDay: 0.05, // +5% per day
};
