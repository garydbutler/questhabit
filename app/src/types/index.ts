// User types
export interface User {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  level: number;
  totalXp: number;
  isPro: boolean;
  proExpiresAt?: string;
  streakFreezesRemaining: number;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

// Habit types
export type HabitCategory = 'health' | 'productivity' | 'learning' | 'wellness' | 'custom';
export type HabitDifficulty = 'easy' | 'medium' | 'hard';
export type FrequencyType = 'daily' | 'weekdays' | 'weekends' | 'custom';

export interface HabitFrequency {
  type: FrequencyType;
  days?: number[]; // 0-6 for Sunday-Saturday
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  difficulty: HabitDifficulty;
  icon: string;
  color: string;
  reminderTime?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

// Completion types
export interface Completion {
  id: string;
  habitId: string;
  userId: string;
  completedAt: string;
  completedDate: string;
  xpEarned: number;
  streakBonus: number;
  timeBonus: number;
}

// Streak types
export interface Streak {
  id: string;
  habitId: string;
  userId: string;
  currentStreak: number;
  bestStreak: number;
  lastCompletedDate?: string;
  freezeUsedAt?: string;
  updatedAt: string;
}

// Achievement types
export type AchievementType =
  | 'first_step'
  | 'week_warrior'
  | 'fortnight_fighter'
  | 'monthly_master'
  | 'early_bird'
  | 'night_owl'
  | 'perfect_day'
  | 'perfect_week'
  | 'habit_collector'
  | 'level_5'
  | 'level_10';

export interface Achievement {
  id: string;
  userId: string;
  achievementType: AchievementType;
  unlockedAt: string;
}

// Combined types for UI
export interface HabitWithStreak extends Habit {
  streak?: Streak;
  completedToday?: boolean;
}

// Form types
export interface CreateHabitInput {
  name: string;
  description?: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  difficulty: HabitDifficulty;
  icon: string;
  color: string;
  reminderTime?: string;
}

export interface UpdateHabitInput extends Partial<CreateHabitInput> {
  isArchived?: boolean;
}
