import { HabitDifficulty } from '../types';
import { XP_VALUES, LEVEL_THRESHOLDS, BONUSES } from '../constants';

/**
 * Calculate XP earned for completing a habit
 */
export function calculateXP(
  difficulty: HabitDifficulty,
  currentStreak: number,
  completionHour: number
): { totalXp: number; streakBonus: number; timeBonus: number } {
  const baseXP = XP_VALUES[difficulty];
  
  // Streak bonus: +5% per day, capped at +50%
  const streakBonus = Math.min(
    currentStreak * BONUSES.streakBonusPerDay,
    BONUSES.maxStreakBonus
  );
  
  // Morning bonus: +10% if before 9 AM
  const timeBonus = completionHour < BONUSES.morningHour ? BONUSES.morningBonus : 0;
  
  const totalMultiplier = 1 + streakBonus + timeBonus;
  const totalXp = Math.round(baseXP * totalMultiplier);
  
  return {
    totalXp,
    streakBonus,
    timeBonus,
  };
}

/**
 * Get level from total XP
 */
export function getLevel(totalXP: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}

/**
 * Get XP needed for next level
 */
export function getXPForNextLevel(level: number): number {
  if (level >= LEVEL_THRESHOLDS.length) {
    // After defined levels, double the last threshold pattern
    return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] * Math.pow(2, level - LEVEL_THRESHOLDS.length + 1);
  }
  return LEVEL_THRESHOLDS[level];
}

/**
 * Get XP progress within current level
 */
export function getLevelProgress(totalXP: number): {
  currentLevel: number;
  currentLevelXP: number;
  nextLevelXP: number;
  progress: number;
} {
  const currentLevel = getLevel(totalXP);
  const currentLevelThreshold = LEVEL_THRESHOLDS[currentLevel - 1] || 0;
  const nextLevelThreshold = getXPForNextLevel(currentLevel);
  
  const xpIntoLevel = totalXP - currentLevelThreshold;
  const xpNeededForLevel = nextLevelThreshold - currentLevelThreshold;
  const progress = xpIntoLevel / xpNeededForLevel;
  
  return {
    currentLevel,
    currentLevelXP: xpIntoLevel,
    nextLevelXP: xpNeededForLevel,
    progress: Math.min(progress, 1),
  };
}

/**
 * Check if user leveled up
 */
export function checkLevelUp(previousXP: number, newXP: number): {
  leveledUp: boolean;
  newLevel: number;
  previousLevel: number;
} {
  const previousLevel = getLevel(previousXP);
  const newLevel = getLevel(newXP);
  
  return {
    leveledUp: newLevel > previousLevel,
    newLevel,
    previousLevel,
  };
}
