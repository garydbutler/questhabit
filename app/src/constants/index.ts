import { HabitCategory, HabitDifficulty, AchievementType } from '../types';
import { Colors, CategoryIcons, AchievementIcons } from './design';

// Re-export design system
export * from './design';

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

// Category colors (maintained for backward compat, now sourced from design)
export const CATEGORY_COLORS: Record<HabitCategory, string> = {
  health: Colors.category.health,
  productivity: Colors.category.productivity,
  learning: Colors.category.learning,
  wellness: Colors.category.wellness,
  custom: Colors.category.custom,
};

// Category labels
export const CATEGORY_LABELS: Record<HabitCategory, string> = {
  health: 'Health',
  productivity: 'Productivity',
  learning: 'Learning',
  wellness: 'Wellness',
  custom: 'Custom',
};

// Category icons — now uses Unicode symbols from design system
export const CATEGORY_ICONS: Record<HabitCategory, string> = {
  health: CategoryIcons.health.symbol,
  productivity: CategoryIcons.productivity.symbol,
  learning: CategoryIcons.learning.symbol,
  wellness: CategoryIcons.wellness.symbol,
  custom: CategoryIcons.custom.symbol,
};

// Difficulty labels
export const DIFFICULTY_LABELS: Record<HabitDifficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

// Achievement definitions — now uses design system icons
export const ACHIEVEMENTS: Record<AchievementType, {
  name: string;
  description: string;
  icon: string;
  xpBonus: number;
}> = {
  first_step: {
    name: 'First Step',
    description: 'Complete your first habit',
    icon: AchievementIcons.first_step.symbol,
    xpBonus: 50,
  },
  week_warrior: {
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: AchievementIcons.week_warrior.symbol,
    xpBonus: 100,
  },
  fortnight_fighter: {
    name: 'Fortnight Fighter',
    description: 'Maintain a 14-day streak',
    icon: AchievementIcons.fortnight_fighter.symbol,
    xpBonus: 200,
  },
  monthly_master: {
    name: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: AchievementIcons.monthly_master.symbol,
    xpBonus: 500,
  },
  early_bird: {
    name: 'Early Bird',
    description: 'Complete a habit before 6 AM',
    icon: AchievementIcons.early_bird.symbol,
    xpBonus: 25,
  },
  night_owl: {
    name: 'Night Owl',
    description: 'Complete a habit after 10 PM',
    icon: AchievementIcons.night_owl.symbol,
    xpBonus: 25,
  },
  perfect_day: {
    name: 'Perfect Day',
    description: 'Complete all habits in a day',
    icon: AchievementIcons.perfect_day.symbol,
    xpBonus: 50,
  },
  perfect_week: {
    name: 'Perfect Week',
    description: '7 consecutive perfect days',
    icon: AchievementIcons.perfect_week.symbol,
    xpBonus: 250,
  },
  habit_collector: {
    name: 'Habit Collector',
    description: 'Create 5 habits',
    icon: AchievementIcons.habit_collector.symbol,
    xpBonus: 50,
  },
  level_5: {
    name: 'Level 5',
    description: 'Reach level 5',
    icon: AchievementIcons.level_5.symbol,
    xpBonus: 100,
  },
  level_10: {
    name: 'Level 10',
    description: 'Reach level 10',
    icon: AchievementIcons.level_10.symbol,
    xpBonus: 250,
  },
};

// Habit icon options — Unicode symbols instead of emoji
export const HABIT_ICONS = [
  '\u2665', '\u25C9', '\u25C8', '\u25C6', '\u2726', '\u2605', '\u25A0', '\u2B22',
  '\u263C', '\u263D', '\u2694', '\u2660', '\u2663', '\u25B2', '\u25CF', '\u2666',
];

// Backward compat: still export HABIT_EMOJIS pointing to new icons
export const HABIT_EMOJIS = HABIT_ICONS;

// Color palette for habits
export const HABIT_COLORS = [
  '#06B6D4', // Cyan (accent)
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#10B981', // Emerald
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
  morningHour: 9,
  morningBonus: 0.1,
  maxStreakBonus: 0.5,
  streakBonusPerDay: 0.05,
};
