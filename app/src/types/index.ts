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

// Quest/Challenge types
export type QuestTier = 'daily' | 'weekly' | 'legendary';
export type QuestStatus = 'active' | 'completed' | 'expired' | 'claimed';

export type QuestRequirementType =
  | 'complete_any'          // Complete X habits total
  | 'complete_category'     // Complete X habits in a specific category
  | 'complete_before_time'  // Complete X habits before a given hour
  | 'complete_after_time'   // Complete X habits after a given hour
  | 'perfect_day'           // 100% completion for the day
  | 'streak_reach'          // Reach X streak on any habit
  | 'xp_earn'               // Earn X total XP
  | 'complete_difficulty'   // Complete X habits of a specific difficulty
  | 'consecutive_days';     // Complete at least 1 habit for X consecutive days

export interface QuestRequirement {
  type: QuestRequirementType;
  target: number;            // Target count to achieve
  category?: HabitCategory;  // For category-specific quests
  difficulty?: HabitDifficulty; // For difficulty-specific quests
  hour?: number;             // For time-based quests
}

export interface QuestReward {
  xp: number;
  streakFreezes?: number;
  badge?: string;
}

export interface QuestTemplate {
  id: string;
  name: string;
  description: string;
  tier: QuestTier;
  requirement: QuestRequirement;
  reward: QuestReward;
  icon: string;
  color: string;
}

export interface ActiveQuest {
  id: string;
  userId: string;
  templateId: string;
  tier: QuestTier;
  name: string;
  description: string;
  requirement: QuestRequirement;
  reward: QuestReward;
  icon: string;
  color: string;
  progress: number;
  status: QuestStatus;
  activatedAt: string;
  expiresAt: string;
  completedAt?: string;
  claimedAt?: string;
}

export interface QuestCompletion {
  id: string;
  userId: string;
  questTemplateId: string;
  questName: string;
  tier: QuestTier;
  xpEarned: number;
  completedAt: string;
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
