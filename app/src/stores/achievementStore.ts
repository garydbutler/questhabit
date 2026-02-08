import { create } from 'zustand';
import { Achievement, AchievementType } from '../types';
import { supabase } from '../lib/supabase';
import { checkAchievements, calculateAchievementXP } from '../lib/achievements';
import { ACHIEVEMENTS } from '../constants';
import { useAuthStore } from './authStore';
import { useHabitStore } from './habitStore';
import { format } from 'date-fns';

interface AchievementState {
  achievements: Achievement[];
  isLoading: boolean;
  error: string | null;
  
  // Derived
  unlockedCount: number;
  totalPossible: number;
  totalBonusXP: number;
  
  // Toast queue
  pendingToasts: AchievementType[];
  consumeToast: () => AchievementType | null;
  
  // Actions
  fetchAchievements: () => Promise<void>;
  checkAndUnlock: () => Promise<void>;
  clearError: () => void;
}

const ALL_ACHIEVEMENT_TYPES = Object.keys(ACHIEVEMENTS) as AchievementType[];

export const useAchievementStore = create<AchievementState>((set, get) => ({
  achievements: [],
  isLoading: false,
  error: null,
  unlockedCount: 0,
  totalPossible: ALL_ACHIEVEMENT_TYPES.length,
  totalBonusXP: 0,
  pendingToasts: [],
  
  consumeToast: () => {
    const { pendingToasts } = get();
    if (pendingToasts.length === 0) return null;
    
    const [next, ...rest] = pendingToasts;
    set({ pendingToasts: rest });
    return next;
  },
  
  fetchAchievements: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    
    set({ isLoading: true });
    
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false });
      
      if (error) throw error;
      
      const achievements: Achievement[] = (data || []).map((a: any) => ({
        id: a.id,
        userId: a.user_id,
        achievementType: a.achievement_type as AchievementType,
        unlockedAt: a.unlocked_at,
      }));
      
      set({
        achievements,
        unlockedCount: achievements.length,
        totalBonusXP: calculateAchievementXP(achievements),
        isLoading: false,
      });
    } catch (error: any) {
      console.error('Fetch achievements error:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  checkAndUnlock: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    
    const { achievements } = get();
    const { habits, completions } = useHabitStore.getState();
    const todayHabits = useHabitStore.getState().getTodayHabits();
    const now = new Date();
    
    const ctx = {
      habits,
      completions,
      unlockedAchievements: achievements,
      totalXp: user.totalXp,
      level: user.level,
      completedToday: todayHabits.filter(h => h.completedToday).length,
      totalHabitsToday: todayHabits.length,
      currentHour: now.getHours(),
    };
    
    const newlyUnlocked = checkAchievements(ctx);
    if (newlyUnlocked.length === 0) return;
    
    try {
      const newAchievements: Achievement[] = [];
      let bonusXP = 0;
      
      for (const type of newlyUnlocked) {
        const { data, error } = await supabase
          .from('achievements')
          .insert({
            user_id: user.id,
            achievement_type: type,
          })
          .select()
          .single();
        
        if (error) {
          // Skip duplicates (unique constraint)
          if (error.code === '23505') continue;
          throw error;
        }
        
        const achievement: Achievement = {
          id: data.id,
          userId: data.user_id,
          achievementType: data.achievement_type as AchievementType,
          unlockedAt: data.unlocked_at,
        };
        
        newAchievements.push(achievement);
        bonusXP += ACHIEVEMENTS[type].xpBonus;
      }
      
      if (newAchievements.length === 0) return;
      
      // Award bonus XP
      if (bonusXP > 0) {
        const newTotalXP = user.totalXp + bonusXP;
        
        await supabase
          .from('profiles')
          .update({
            total_xp: newTotalXP,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);
        
        useAuthStore.getState().updateUser({ totalXp: newTotalXP });
      }
      
      // Update local state
      const allAchievements = [...newAchievements, ...achievements];
      set({
        achievements: allAchievements,
        unlockedCount: allAchievements.length,
        totalBonusXP: calculateAchievementXP(allAchievements),
        pendingToasts: [...get().pendingToasts, ...newAchievements.map(a => a.achievementType)],
      });
    } catch (error: any) {
      console.error('Check and unlock achievements error:', error);
      set({ error: error.message });
    }
  },
  
  clearError: () => set({ error: null }),
}));
