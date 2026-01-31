import { create } from 'zustand';
import { Habit, HabitWithStreak, Streak, Completion, CreateHabitInput, UpdateHabitInput } from '../types';
import { supabase } from '../lib/supabase';
import { calculateXP, checkLevelUp } from '../lib/xp';
import { useAuthStore } from './authStore';
import { format, isToday, parseISO, startOfDay } from 'date-fns';

// Lazy import to avoid circular dependency
const getAchievementStore = () => require('./achievementStore').useAchievementStore;

interface HabitState {
  habits: HabitWithStreak[];
  completions: Completion[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchHabits: () => Promise<void>;
  fetchTodayCompletions: () => Promise<void>;
  createHabit: (input: CreateHabitInput) => Promise<{ success: boolean; habit?: Habit; error?: string }>;
  updateHabit: (id: string, input: UpdateHabitInput) => Promise<{ success: boolean; error?: string }>;
  deleteHabit: (id: string) => Promise<{ success: boolean; error?: string }>;
  completeHabit: (habitId: string) => Promise<{ success: boolean; xpEarned?: number; leveledUp?: boolean; newLevel?: number; error?: string }>;
  uncompleteHabit: (habitId: string) => Promise<{ success: boolean; error?: string }>;
  getTodayHabits: () => HabitWithStreak[];
  clearError: () => void;
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  completions: [],
  isLoading: false,
  error: null,
  
  fetchHabits: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    
    set({ isLoading: true });
    
    try {
      // Fetch habits with streaks
      const { data: habits, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_archived', false)
        .order('created_at', { ascending: true });
      
      if (habitsError) throw habitsError;
      
      // Fetch streaks
      const { data: streaks, error: streaksError } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', user.id);
      
      if (streaksError) throw streaksError;
      
      // Map streaks to habits
      const streakMap = new Map<string, Streak>();
      streaks?.forEach((s: any) => {
        streakMap.set(s.habit_id, {
          id: s.id,
          habitId: s.habit_id,
          userId: s.user_id,
          currentStreak: s.current_streak,
          bestStreak: s.best_streak,
          lastCompletedDate: s.last_completed_date,
          freezeUsedAt: s.freeze_used_at,
          updatedAt: s.updated_at,
        });
      });
      
      // Fetch today's completions
      const today = format(new Date(), 'yyyy-MM-dd');
      const { data: todayCompletions } = await supabase
        .from('completions')
        .select('habit_id')
        .eq('user_id', user.id)
        .eq('completed_date', today);
      
      const completedTodaySet = new Set(todayCompletions?.map((c: any) => c.habit_id) || []);
      
      const habitsWithStreaks: HabitWithStreak[] = (habits || []).map((h: any) => ({
        id: h.id,
        userId: h.user_id,
        name: h.name,
        description: h.description,
        category: h.category,
        frequency: h.frequency,
        difficulty: h.difficulty,
        icon: h.icon,
        color: h.color,
        reminderTime: h.reminder_time,
        isArchived: h.is_archived,
        createdAt: h.created_at,
        updatedAt: h.updated_at,
        streak: streakMap.get(h.id),
        completedToday: completedTodaySet.has(h.id),
      }));
      
      set({ habits: habitsWithStreaks, isLoading: false });
    } catch (error: any) {
      console.error('Fetch habits error:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  fetchTodayCompletions: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const { data, error } = await supabase
        .from('completions')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed_date', today);
      
      if (error) throw error;
      
      const completions: Completion[] = (data || []).map((c: any) => ({
        id: c.id,
        habitId: c.habit_id,
        userId: c.user_id,
        completedAt: c.completed_at,
        completedDate: c.completed_date,
        xpEarned: c.xp_earned,
        streakBonus: c.streak_bonus,
        timeBonus: c.time_bonus,
      }));
      
      set({ completions });
    } catch (error: any) {
      console.error('Fetch completions error:', error);
    }
  },
  
  createHabit: async (input) => {
    const user = useAuthStore.getState().user;
    if (!user) return { success: false, error: 'Not authenticated' };
    
    set({ isLoading: true });
    
    try {
      const { data, error } = await supabase
        .from('habits')
        .insert({
          user_id: user.id,
          name: input.name,
          description: input.description,
          category: input.category,
          frequency: input.frequency,
          difficulty: input.difficulty,
          icon: input.icon,
          color: input.color,
          reminder_time: input.reminderTime,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Create streak record
      await supabase
        .from('streaks')
        .insert({
          habit_id: data.id,
          user_id: user.id,
          current_streak: 0,
          best_streak: 0,
        });
      
      // Refresh habits
      await get().fetchHabits();
      
      set({ isLoading: false });
      return { success: true, habit: data };
    } catch (error: any) {
      console.error('Create habit error:', error);
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },
  
  updateHabit: async (id, input) => {
    const user = useAuthStore.getState().user;
    if (!user) return { success: false, error: 'Not authenticated' };
    
    set({ isLoading: true });
    
    try {
      const { error } = await supabase
        .from('habits')
        .update({
          name: input.name,
          description: input.description,
          category: input.category,
          frequency: input.frequency,
          difficulty: input.difficulty,
          icon: input.icon,
          color: input.color,
          reminder_time: input.reminderTime,
          is_archived: input.isArchived,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      await get().fetchHabits();
      set({ isLoading: false });
      return { success: true };
    } catch (error: any) {
      console.error('Update habit error:', error);
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },
  
  deleteHabit: async (id) => {
    const user = useAuthStore.getState().user;
    if (!user) return { success: false, error: 'Not authenticated' };
    
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      await get().fetchHabits();
      return { success: true };
    } catch (error: any) {
      console.error('Delete habit error:', error);
      return { success: false, error: error.message };
    }
  },
  
  completeHabit: async (habitId) => {
    const user = useAuthStore.getState().user;
    if (!user) return { success: false, error: 'Not authenticated' };
    
    const { habits } = get();
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return { success: false, error: 'Habit not found' };
    
    try {
      const now = new Date();
      const today = format(now, 'yyyy-MM-dd');
      const currentHour = now.getHours();
      const currentStreak = habit.streak?.currentStreak || 0;
      
      // Calculate XP
      const { totalXp, streakBonus, timeBonus } = calculateXP(
        habit.difficulty,
        currentStreak,
        currentHour
      );
      
      // Insert completion
      const { error: completionError } = await supabase
        .from('completions')
        .insert({
          habit_id: habitId,
          user_id: user.id,
          completed_date: today,
          xp_earned: totalXp,
          streak_bonus: streakBonus,
          time_bonus: timeBonus,
        });
      
      if (completionError) {
        if (completionError.code === '23505') {
          return { success: false, error: 'Already completed today' };
        }
        throw completionError;
      }
      
      // Update streak
      const newStreak = currentStreak + 1;
      const bestStreak = Math.max(newStreak, habit.streak?.bestStreak || 0);
      
      await supabase
        .from('streaks')
        .update({
          current_streak: newStreak,
          best_streak: bestStreak,
          last_completed_date: today,
          updated_at: now.toISOString(),
        })
        .eq('habit_id', habitId);
      
      // Update user XP
      const previousXP = user.totalXp;
      const newXP = previousXP + totalXp;
      const { leveledUp, newLevel } = checkLevelUp(previousXP, newXP);
      
      await supabase
        .from('profiles')
        .update({
          total_xp: newXP,
          level: newLevel,
          updated_at: now.toISOString(),
        })
        .eq('id', user.id);
      
      // Update local state
      useAuthStore.getState().updateUser({ totalXp: newXP, level: newLevel });
      
      // Update habit in local state
      set(state => ({
        habits: state.habits.map(h =>
          h.id === habitId
            ? {
                ...h,
                completedToday: true,
                streak: {
                  ...h.streak!,
                  currentStreak: newStreak,
                  bestStreak,
                  lastCompletedDate: today,
                },
              }
            : h
        ),
      }));
      
      // Check for new achievements
      try {
        await get().fetchTodayCompletions();
        await getAchievementStore().getState().checkAndUnlock();
      } catch (achievementError) {
        // Non-blocking — don't fail the completion
        console.error('Achievement check error:', achievementError);
      }
      
      return { success: true, xpEarned: totalXp, leveledUp, newLevel };
    } catch (error: any) {
      console.error('Complete habit error:', error);
      return { success: false, error: error.message };
    }
  },
  
  uncompleteHabit: async (habitId) => {
    const user = useAuthStore.getState().user;
    if (!user) return { success: false, error: 'Not authenticated' };
    
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      
      // Get completion to know XP to remove
      const { data: completion } = await supabase
        .from('completions')
        .select('xp_earned')
        .eq('habit_id', habitId)
        .eq('completed_date', today)
        .single();
      
      if (!completion) return { success: false, error: 'Completion not found' };
      
      // Delete completion
      const { error } = await supabase
        .from('completions')
        .delete()
        .eq('habit_id', habitId)
        .eq('completed_date', today);
      
      if (error) throw error;
      
      // Revert XP
      const newXP = Math.max(0, user.totalXp - completion.xp_earned);
      await supabase
        .from('profiles')
        .update({ total_xp: newXP })
        .eq('id', user.id);
      
      useAuthStore.getState().updateUser({ totalXp: newXP });
      
      // Refresh habits
      await get().fetchHabits();
      
      return { success: true };
    } catch (error: any) {
      console.error('Uncomplete habit error:', error);
      return { success: false, error: error.message };
    }
  },
  
  getTodayHabits: () => {
    const { habits } = get();
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    return habits.filter(habit => {
      const { type, days } = habit.frequency;
      
      switch (type) {
        case 'daily':
          return true;
        case 'weekdays':
          return dayOfWeek >= 1 && dayOfWeek <= 5;
        case 'weekends':
          return dayOfWeek === 0 || dayOfWeek === 6;
        case 'custom':
          return days?.includes(dayOfWeek) || false;
        default:
          return true;
      }
    });
  },
  
  clearError: () => set({ error: null }),
}));
