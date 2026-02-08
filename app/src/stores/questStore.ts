import { create } from 'zustand';
import { ActiveQuest, QuestTier, QuestStatus, QuestCompletion } from '../types';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';
import {
  selectDailyQuests,
  selectWeeklyQuest,
  selectLegendaryQuest,
  QUEST_TEMPLATES,
} from '../lib/quests';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, addDays, isAfter, isBefore } from 'date-fns';

interface QuestState {
  activeQuests: ActiveQuest[];
  recentCompletions: QuestCompletion[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchActiveQuests: () => Promise<void>;
  refreshQuests: () => Promise<void>;
  updateQuestProgress: (questId: string, progress: number) => Promise<void>;
  completeQuest: (questId: string) => Promise<void>;
  claimQuestReward: (questId: string) => Promise<{ success: boolean; xpEarned?: number; error?: string }>;
  fetchRecentCompletions: (limit?: number) => Promise<void>;
  checkAndProgressQuests: (event: QuestProgressEvent) => Promise<void>;
  clearError: () => void;
}

/** Events that can progress quests */
export interface QuestProgressEvent {
  type: 'habit_completed';
  habitCategory?: string;
  habitDifficulty?: string;
  completionHour?: number;
  totalCompletedToday?: number;
  totalDueToday?: number;
  currentStreak?: number;
  xpEarned?: number;
  consecutiveDays?: number;
}

export const useQuestStore = create<QuestState>((set, get) => ({
  activeQuests: [],
  recentCompletions: [],
  isLoading: false,
  error: null,

  fetchActiveQuests: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ isLoading: true });

    try {
      const { data, error } = await supabase
        .from('active_quests')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['active', 'completed'])
        .order('tier', { ascending: true })
        .order('activated_at', { ascending: true });

      if (error) throw error;

      const quests: ActiveQuest[] = (data || []).map(mapDbQuest);
      set({ activeQuests: quests, isLoading: false });
    } catch (error: any) {
      console.error('Fetch quests error:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  /**
   * Core rotation logic:
   * 1. Expire any quests past their deadline
   * 2. Check if user has today's daily quests — if not, generate them
   * 3. Check if user has this week's quest — if not, generate it
   * 4. Check for legendary quest (Pro only)
   */
  refreshQuests: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ isLoading: true });

    try {
      const now = new Date();
      const today = format(now, 'yyyy-MM-dd');
      const todayStart = startOfDay(now).toISOString();
      const todayEnd = endOfDay(now).toISOString();
      const weekStart = format(startOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd');
      const weekEnd = endOfWeek(now, { weekStartsOn: 1 }).toISOString();

      // 1. Expire old active quests
      await supabase
        .from('active_quests')
        .update({ status: 'expired', updated_at: now.toISOString() })
        .eq('user_id', user.id)
        .eq('status', 'active')
        .lt('expires_at', now.toISOString());

      // 2. Check for existing daily quests today
      const { data: existingDaily } = await supabase
        .from('active_quests')
        .select('id')
        .eq('user_id', user.id)
        .eq('tier', 'daily')
        .gte('activated_at', todayStart)
        .lte('activated_at', todayEnd);

      if (!existingDaily || existingDaily.length === 0) {
        // Generate today's daily quests
        const dailyTemplates = selectDailyQuests(user.id, today, 3);
        const dailyQuests = dailyTemplates.map(t => ({
          user_id: user.id,
          template_id: t.id,
          tier: 'daily' as const,
          name: t.name,
          description: t.description,
          requirement: t.requirement,
          reward: t.reward,
          icon: t.icon,
          color: t.color,
          progress: 0,
          status: 'active' as const,
          activated_at: now.toISOString(),
          expires_at: todayEnd,
        }));

        if (dailyQuests.length > 0) {
          await supabase.from('active_quests').insert(dailyQuests);
        }
      }

      // 3. Check for existing weekly quest
      const weekStartDate = startOfWeek(now, { weekStartsOn: 1 });
      const { data: existingWeekly } = await supabase
        .from('active_quests')
        .select('id')
        .eq('user_id', user.id)
        .eq('tier', 'weekly')
        .gte('activated_at', weekStartDate.toISOString())
        .lte('activated_at', weekEnd);

      if (!existingWeekly || existingWeekly.length === 0) {
        const weeklyTemplate = selectWeeklyQuest(user.id, weekStart);
        await supabase.from('active_quests').insert({
          user_id: user.id,
          template_id: weeklyTemplate.id,
          tier: 'weekly',
          name: weeklyTemplate.name,
          description: weeklyTemplate.description,
          requirement: weeklyTemplate.requirement,
          reward: weeklyTemplate.reward,
          icon: weeklyTemplate.icon,
          color: weeklyTemplate.color,
          progress: 0,
          status: 'active',
          activated_at: now.toISOString(),
          expires_at: weekEnd,
        });
      }

      // 4. Legendary quest (Pro only)
      if (user.isPro) {
        const { data: existingLegendary } = await supabase
          .from('active_quests')
          .select('id')
          .eq('user_id', user.id)
          .eq('tier', 'legendary')
          .gte('activated_at', weekStartDate.toISOString())
          .lte('activated_at', weekEnd);

        if (!existingLegendary || existingLegendary.length === 0) {
          const legendaryTemplate = selectLegendaryQuest(user.id, weekStart);
          await supabase.from('active_quests').insert({
            user_id: user.id,
            template_id: legendaryTemplate.id,
            tier: 'legendary',
            name: legendaryTemplate.name,
            description: legendaryTemplate.description,
            requirement: legendaryTemplate.requirement,
            reward: legendaryTemplate.reward,
            icon: legendaryTemplate.icon,
            color: legendaryTemplate.color,
            progress: 0,
            status: 'active',
            activated_at: now.toISOString(),
            expires_at: weekEnd,
          });
        }
      }

      // Refresh the active quests list
      await get().fetchActiveQuests();
    } catch (error: any) {
      console.error('Refresh quests error:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  updateQuestProgress: async (questId: string, progress: number) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      const quest = get().activeQuests.find(q => q.id === questId);
      if (!quest || quest.status !== 'active') return;

      const clampedProgress = Math.min(progress, quest.requirement.target);
      const isNowComplete = clampedProgress >= quest.requirement.target;

      const update: Record<string, any> = {
        progress: clampedProgress,
        updated_at: new Date().toISOString(),
      };

      if (isNowComplete) {
        update.status = 'completed';
        update.completed_at = new Date().toISOString();
      }

      await supabase
        .from('active_quests')
        .update(update)
        .eq('id', questId)
        .eq('user_id', user.id);

      // Update local state
      set(state => ({
        activeQuests: state.activeQuests.map(q =>
          q.id === questId
            ? { ...q, progress: clampedProgress, status: isNowComplete ? 'completed' : q.status, completedAt: isNowComplete ? new Date().toISOString() : q.completedAt }
            : q
        ),
      }));
    } catch (error: any) {
      console.error('Update quest progress error:', error);
    }
  },

  completeQuest: async (questId: string) => {
    await get().updateQuestProgress(questId, Infinity);
  },

  claimQuestReward: async (questId: string) => {
    const user = useAuthStore.getState().user;
    if (!user) return { success: false, error: 'Not authenticated' };

    const quest = get().activeQuests.find(q => q.id === questId);
    if (!quest) return { success: false, error: 'Quest not found' };
    if (quest.status !== 'completed') return { success: false, error: 'Quest not completed yet' };

    try {
      const now = new Date().toISOString();

      // Mark quest as claimed
      await supabase
        .from('active_quests')
        .update({ status: 'claimed', claimed_at: now, updated_at: now })
        .eq('id', questId)
        .eq('user_id', user.id);

      // Record completion
      await supabase.from('quest_completions').insert({
        user_id: user.id,
        quest_template_id: quest.templateId,
        quest_name: quest.name,
        tier: quest.tier,
        xp_earned: quest.reward.xp,
        streak_freezes_earned: quest.reward.streakFreezes || 0,
        badge_earned: quest.reward.badge || null,
        completed_at: now,
      });

      // Award XP
      const newXP = user.totalXp + quest.reward.xp;
      await supabase
        .from('profiles')
        .update({ total_xp: newXP, updated_at: now })
        .eq('id', user.id);

      // Award streak freezes if applicable
      if (quest.reward.streakFreezes) {
        const newFreezes = user.streakFreezesRemaining + quest.reward.streakFreezes;
        await supabase
          .from('profiles')
          .update({ streak_freezes_remaining: newFreezes })
          .eq('id', user.id);
        useAuthStore.getState().updateUser({ streakFreezesRemaining: newFreezes });
      }

      useAuthStore.getState().updateUser({ totalXp: newXP });

      // Update local state — remove claimed quest
      set(state => ({
        activeQuests: state.activeQuests.filter(q => q.id !== questId),
      }));

      return { success: true, xpEarned: quest.reward.xp };
    } catch (error: any) {
      console.error('Claim quest reward error:', error);
      return { success: false, error: error.message };
    }
  },

  fetchRecentCompletions: async (limit = 20) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('quest_completions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      const completions: QuestCompletion[] = (data || []).map((c: any) => ({
        id: c.id,
        userId: c.user_id,
        questTemplateId: c.quest_template_id,
        questName: c.quest_name,
        tier: c.tier,
        xpEarned: c.xp_earned,
        completedAt: c.completed_at,
      }));

      set({ recentCompletions: completions });
    } catch (error: any) {
      console.error('Fetch quest completions error:', error);
    }
  },

  /**
   * Called whenever a habit is completed.
   * Evaluates each active quest to see if this event progresses it.
   */
  checkAndProgressQuests: async (event: QuestProgressEvent) => {
    const { activeQuests } = get();
    const active = activeQuests.filter(q => q.status === 'active');

    for (const quest of active) {
      const req = quest.requirement;
      let newProgress = quest.progress;

      switch (req.type) {
        case 'complete_any':
          // Increment by 1 for each habit completed
          newProgress = quest.progress + 1;
          break;

        case 'complete_category':
          if (event.habitCategory === req.category) {
            newProgress = quest.progress + 1;
          }
          break;

        case 'complete_before_time':
          if (event.completionHour !== undefined && event.completionHour < (req.hour || 9)) {
            newProgress = quest.progress + 1;
          }
          break;

        case 'complete_after_time':
          if (event.completionHour !== undefined && event.completionHour >= (req.hour || 22)) {
            newProgress = quest.progress + 1;
          }
          break;

        case 'perfect_day':
          if (event.totalCompletedToday !== undefined &&
              event.totalDueToday !== undefined &&
              event.totalCompletedToday >= event.totalDueToday &&
              event.totalDueToday > 0) {
            newProgress = quest.progress + 1;
          }
          break;

        case 'streak_reach':
          if (event.currentStreak !== undefined && event.currentStreak >= req.target) {
            newProgress = req.target; // Binary — either reached or not
          }
          break;

        case 'xp_earn':
          if (event.xpEarned !== undefined) {
            newProgress = quest.progress + event.xpEarned;
          }
          break;

        case 'complete_difficulty':
          if (event.habitDifficulty === req.difficulty) {
            newProgress = quest.progress + 1;
          }
          break;

        case 'consecutive_days':
          if (event.consecutiveDays !== undefined) {
            newProgress = Math.max(quest.progress, event.consecutiveDays);
          }
          break;
      }

      if (newProgress > quest.progress) {
        await get().updateQuestProgress(quest.id, newProgress);
      }
    }
  },

  clearError: () => set({ error: null }),
}));

// Helper to map DB rows to ActiveQuest
function mapDbQuest(row: any): ActiveQuest {
  return {
    id: row.id,
    userId: row.user_id,
    templateId: row.template_id,
    tier: row.tier,
    name: row.name,
    description: row.description,
    requirement: row.requirement,
    reward: row.reward,
    icon: row.icon,
    color: row.color,
    progress: row.progress,
    status: row.status,
    activatedAt: row.activated_at,
    expiresAt: row.expires_at,
    completedAt: row.completed_at,
    claimedAt: row.claimed_at,
  };
}
