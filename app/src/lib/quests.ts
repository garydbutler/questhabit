import { QuestTemplate, QuestTier } from '../types';
import { Icons, Colors } from '../constants/design';

/**
 * Quest Template Pool
 * 
 * Daily quests: 3 randomly selected each day, reset at midnight
 * Weekly quests: 1 selected each Monday, resets Sunday night
 * Legendary quests: Pro-only, 1 per week, bigger rewards
 */

export const QUEST_TEMPLATES: QuestTemplate[] = [
  // ═══════════════════════════════════════════════════════
  // DAILY QUESTS — Achievable in a single day
  // ═══════════════════════════════════════════════════════
  {
    id: 'daily_complete_3',
    name: 'Triple Threat',
    description: 'Complete 3 habits today',
    tier: 'daily',
    requirement: { type: 'complete_any', target: 3 },
    reward: { xp: 50 },
    icon: '\u2726',  // ✦
    color: '#06B6D4',
  },
  {
    id: 'daily_complete_5',
    name: 'High Five',
    description: 'Complete 5 habits today',
    tier: 'daily',
    requirement: { type: 'complete_any', target: 5 },
    reward: { xp: 100 },
    icon: '\u2605',  // ★
    color: '#3B82F6',
  },
  {
    id: 'daily_perfect',
    name: 'Flawless Victory',
    description: 'Complete ALL of today\'s habits',
    tier: 'daily',
    requirement: { type: 'perfect_day', target: 1 },
    reward: { xp: 75 },
    icon: '\u25C6',  // ◆
    color: '#10B981',
  },
  {
    id: 'daily_early_bird',
    name: 'Early Bird',
    description: 'Complete 2 habits before 9 AM',
    tier: 'daily',
    requirement: { type: 'complete_before_time', target: 2, hour: 9 },
    reward: { xp: 60 },
    icon: '\u263C',  // ☼
    color: '#FBBF24',
  },
  {
    id: 'daily_night_owl',
    name: 'Night Owl',
    description: 'Complete a habit after 10 PM',
    tier: 'daily',
    requirement: { type: 'complete_after_time', target: 1, hour: 22 },
    reward: { xp: 40 },
    icon: '\u263D',  // ☽
    color: '#8B5CF6',
  },
  {
    id: 'daily_health_focus',
    name: 'Body & Mind',
    description: 'Complete 2 Health habits today',
    tier: 'daily',
    requirement: { type: 'complete_category', target: 2, category: 'health' },
    reward: { xp: 55 },
    icon: '\u2665',  // ♥
    color: '#10B981',
  },
  {
    id: 'daily_productivity_focus',
    name: 'Grind Mode',
    description: 'Complete 2 Productivity habits today',
    tier: 'daily',
    requirement: { type: 'complete_category', target: 2, category: 'productivity' },
    reward: { xp: 55 },
    icon: '\u25C9',  // ◉
    color: '#3B82F6',
  },
  {
    id: 'daily_learning_focus',
    name: 'Scholar\'s Path',
    description: 'Complete 2 Learning habits today',
    tier: 'daily',
    requirement: { type: 'complete_category', target: 2, category: 'learning' },
    reward: { xp: 55 },
    icon: '\u25A0',  // ■
    color: '#8B5CF6',
  },
  {
    id: 'daily_hard_mode',
    name: 'Hard Mode',
    description: 'Complete a Hard difficulty habit',
    tier: 'daily',
    requirement: { type: 'complete_difficulty', target: 1, difficulty: 'hard' },
    reward: { xp: 65 },
    icon: '\u2B22',  // ⬢
    color: '#EF4444',
  },
  {
    id: 'daily_xp_hunter',
    name: 'XP Hunter',
    description: 'Earn 100 XP today',
    tier: 'daily',
    requirement: { type: 'xp_earn', target: 100 },
    reward: { xp: 50 },
    icon: '\u2726',  // ✦
    color: '#F59E0B',
  },
  {
    id: 'daily_dawn_patrol',
    name: 'Dawn Patrol',
    description: 'Complete a habit before 7 AM',
    tier: 'daily',
    requirement: { type: 'complete_before_time', target: 1, hour: 7 },
    reward: { xp: 70 },
    icon: '\u25B2',  // ▲
    color: '#F97316',
  },
  {
    id: 'daily_wellness_check',
    name: 'Wellness Check',
    description: 'Complete 2 Wellness habits today',
    tier: 'daily',
    requirement: { type: 'complete_category', target: 2, category: 'wellness' },
    reward: { xp: 55 },
    icon: '\u25C8',  // ◈
    color: '#EC4899',
  },

  // ═══════════════════════════════════════════════════════
  // WEEKLY QUESTS — Achievable over 7 days
  // ═══════════════════════════════════════════════════════
  {
    id: 'weekly_streak_7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak on any habit',
    tier: 'weekly',
    requirement: { type: 'streak_reach', target: 7 },
    reward: { xp: 200 },
    icon: '\u2B22',  // ⬢
    color: '#F97316',
  },
  {
    id: 'weekly_perfect_3',
    name: 'Trifecta',
    description: 'Have 3 perfect days this week',
    tier: 'weekly',
    requirement: { type: 'perfect_day', target: 3 },
    reward: { xp: 250 },
    icon: '\u2605',  // ★
    color: '#F59E0B',
  },
  {
    id: 'weekly_complete_20',
    name: 'Habit Machine',
    description: 'Complete 20 habits this week',
    tier: 'weekly',
    requirement: { type: 'complete_any', target: 20 },
    reward: { xp: 200 },
    icon: '\u25C9',  // ◉
    color: '#06B6D4',
  },
  {
    id: 'weekly_early_5',
    name: 'Morning Glory',
    description: 'Complete habits before 9 AM on 5 different days',
    tier: 'weekly',
    requirement: { type: 'complete_before_time', target: 5, hour: 9 },
    reward: { xp: 225 },
    icon: '\u263C',  // ☼
    color: '#FBBF24',
  },
  {
    id: 'weekly_xp_500',
    name: 'XP Feast',
    description: 'Earn 500 XP this week',
    tier: 'weekly',
    requirement: { type: 'xp_earn', target: 500 },
    reward: { xp: 200 },
    icon: '\u2726',  // ✦
    color: '#F59E0B',
  },
  {
    id: 'weekly_hard_5',
    name: 'Challenge Accepted',
    description: 'Complete 5 Hard difficulty habits this week',
    tier: 'weekly',
    requirement: { type: 'complete_difficulty', target: 5, difficulty: 'hard' },
    reward: { xp: 275 },
    icon: '\u2B22',  // ⬢
    color: '#EF4444',
  },
  {
    id: 'weekly_consistency',
    name: 'Consistency King',
    description: 'Complete at least 1 habit every day for 7 days',
    tier: 'weekly',
    requirement: { type: 'consecutive_days', target: 7 },
    reward: { xp: 300 },
    icon: '\u25C6',  // ◆
    color: '#10B981',
  },
  {
    id: 'weekly_variety',
    name: 'Renaissance',
    description: 'Complete habits from 3 different categories',
    tier: 'weekly',
    requirement: { type: 'complete_any', target: 3 },
    reward: { xp: 175 },
    icon: '\u25C8',  // ◈
    color: '#EC4899',
  },

  // ═══════════════════════════════════════════════════════
  // LEGENDARY QUESTS — Pro only, big rewards, challenging
  // ═══════════════════════════════════════════════════════
  {
    id: 'legendary_perfect_week',
    name: 'The Perfect Week',
    description: 'Complete ALL habits every single day for 7 days straight',
    tier: 'legendary',
    requirement: { type: 'perfect_day', target: 7 },
    reward: { xp: 750, streakFreezes: 2, badge: 'perfectionist' },
    icon: '\u2605',  // ★
    color: '#F59E0B',
  },
  {
    id: 'legendary_xp_1000',
    name: 'XP Overlord',
    description: 'Earn 1,000 XP in a single week',
    tier: 'legendary',
    requirement: { type: 'xp_earn', target: 1000 },
    reward: { xp: 500, badge: 'xp_overlord' },
    icon: '\u2726',  // ✦
    color: '#F59E0B',
  },
  {
    id: 'legendary_streak_14',
    name: 'The Iron Will',
    description: 'Maintain a 14-day streak on any habit',
    tier: 'legendary',
    requirement: { type: 'streak_reach', target: 14 },
    reward: { xp: 600, streakFreezes: 1, badge: 'iron_will' },
    icon: '\u25C6',  // ◆
    color: '#F97316',
  },
  {
    id: 'legendary_complete_50',
    name: 'The Grinder',
    description: 'Complete 50 habits in a single week',
    tier: 'legendary',
    requirement: { type: 'complete_any', target: 50 },
    reward: { xp: 500, badge: 'grinder' },
    icon: '\u2B22',  // ⬢
    color: '#EF4444',
  },
  {
    id: 'legendary_dawn_warrior',
    name: 'Dawn Warrior',
    description: 'Complete a habit before 7 AM every day for a week',
    tier: 'legendary',
    requirement: { type: 'complete_before_time', target: 7, hour: 7 },
    reward: { xp: 650, streakFreezes: 1, badge: 'dawn_warrior' },
    icon: '\u25B2',  // ▲
    color: '#FBBF24',
  },
];

/**
 * Get quest templates by tier
 */
export function getQuestsByTier(tier: QuestTier): QuestTemplate[] {
  return QUEST_TEMPLATES.filter(q => q.tier === tier);
}

/**
 * Select random quests for a given tier.
 * Uses a seeded random based on date so all users get different quests
 * but the same user sees consistent quests for the period.
 */
export function selectDailyQuests(userId: string, date: string, count: number = 3): QuestTemplate[] {
  const pool = getQuestsByTier('daily');
  const seed = hashCode(`${userId}-${date}-daily`);
  return seededShuffle(pool, seed).slice(0, Math.min(count, pool.length));
}

export function selectWeeklyQuest(userId: string, weekStart: string): QuestTemplate {
  const pool = getQuestsByTier('weekly');
  const seed = hashCode(`${userId}-${weekStart}-weekly`);
  return seededShuffle(pool, seed)[0];
}

export function selectLegendaryQuest(userId: string, weekStart: string): QuestTemplate {
  const pool = getQuestsByTier('legendary');
  const seed = hashCode(`${userId}-${weekStart}-legendary`);
  return seededShuffle(pool, seed)[0];
}

/**
 * Get tier metadata for UI display
 */
export function getQuestTierInfo(tier: QuestTier): {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  duration: string;
} {
  switch (tier) {
    case 'daily':
      return {
        label: 'DAILY',
        color: '#06B6D4',
        bgColor: 'rgba(6, 182, 212, 0.10)',
        borderColor: 'rgba(6, 182, 212, 0.20)',
        icon: '\u25C9', // ◉
        duration: 'Resets at midnight',
      };
    case 'weekly':
      return {
        label: 'WEEKLY',
        color: '#8B5CF6',
        bgColor: 'rgba(139, 92, 246, 0.10)',
        borderColor: 'rgba(139, 92, 246, 0.20)',
        icon: '\u2605', // ★
        duration: 'Resets Monday',
      };
    case 'legendary':
      return {
        label: 'LEGENDARY',
        color: '#F59E0B',
        bgColor: 'rgba(245, 158, 11, 0.08)',
        borderColor: 'rgba(245, 158, 11, 0.25)',
        icon: '\u2666', // ♦
        duration: 'Pro Only',
      };
  }
}

// ─── Utility ────────────────────────────────────────────────────

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

function seededShuffle<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  let m = shuffled.length;
  let s = seed;

  while (m) {
    // Simple LCG (linear congruential generator)
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const i = s % m--;
    [shuffled[m], shuffled[i]] = [shuffled[i], shuffled[m]];
  }

  return shuffled;
}
