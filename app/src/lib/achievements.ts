import { AchievementType, Achievement, HabitWithStreak, Completion } from '../types';
import { ACHIEVEMENTS } from '../constants';

interface AchievementCheckContext {
  habits: HabitWithStreak[];
  completions: Completion[];
  unlockedAchievements: Achievement[];
  totalXp: number;
  level: number;
  completedToday: number;
  totalHabitsToday: number;
  currentHour: number;
}

type AchievementChecker = (ctx: AchievementCheckContext) => boolean;

const achievementCheckers: Record<AchievementType, AchievementChecker> = {
  first_step: (ctx) => ctx.completions.length >= 1,
  
  week_warrior: (ctx) => 
    ctx.habits.some(h => (h.streak?.currentStreak || 0) >= 7),
  
  fortnight_fighter: (ctx) => 
    ctx.habits.some(h => (h.streak?.currentStreak || 0) >= 14),
  
  monthly_master: (ctx) => 
    ctx.habits.some(h => (h.streak?.currentStreak || 0) >= 30),
  
  early_bird: (ctx) => {
    const today = new Date().toISOString().split('T')[0];
    return ctx.completions.some(c => {
      const completedAt = new Date(c.completedAt);
      const isToday = c.completedDate === today;
      return isToday && completedAt.getHours() < 6;
    });
  },
  
  night_owl: (ctx) => {
    const today = new Date().toISOString().split('T')[0];
    return ctx.completions.some(c => {
      const completedAt = new Date(c.completedAt);
      const isToday = c.completedDate === today;
      return isToday && completedAt.getHours() >= 22;
    });
  },
  
  perfect_day: (ctx) => 
    ctx.totalHabitsToday > 0 && ctx.completedToday === ctx.totalHabitsToday,
  
  perfect_week: (ctx) => {
    // Check last 7 days of completions
    // This is a simplified check - would need more robust logic in production
    const last7Days = new Set<string>();
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      last7Days.add(date.toISOString().split('T')[0]);
    }
    
    // Count unique days with 100% completion
    // Simplified: just check if we have completions on all 7 days
    const completedDays = new Set(ctx.completions.map(c => c.completedDate));
    return Array.from(last7Days).every(day => completedDays.has(day));
  },
  
  habit_collector: (ctx) => ctx.habits.filter(h => !h.isArchived).length >= 5,
  
  level_5: (ctx) => ctx.level >= 5,
  
  level_10: (ctx) => ctx.level >= 10,
};

/**
 * Check for newly unlocked achievements
 */
export function checkAchievements(ctx: AchievementCheckContext): AchievementType[] {
  const newlyUnlocked: AchievementType[] = [];
  const alreadyUnlocked = new Set(ctx.unlockedAchievements.map(a => a.achievementType));
  
  for (const [type, checker] of Object.entries(achievementCheckers)) {
    const achievementType = type as AchievementType;
    if (!alreadyUnlocked.has(achievementType) && checker(ctx)) {
      newlyUnlocked.push(achievementType);
    }
  }
  
  return newlyUnlocked;
}

/**
 * Get achievement info
 */
export function getAchievementInfo(type: AchievementType) {
  return ACHIEVEMENTS[type];
}

/**
 * Calculate total XP from achievements
 */
export function calculateAchievementXP(achievements: Achievement[]): number {
  return achievements.reduce((total, a) => {
    const info = ACHIEVEMENTS[a.achievementType];
    return total + (info?.xpBonus || 0);
  }, 0);
}
