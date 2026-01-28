import { create } from 'zustand';
import { User } from '../types';
import { supabase, signIn as supabaseSignIn, signUp as supabaseSignUp, signOut as supabaseSignOut } from '../lib/supabase';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  // Actions
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isInitialized: false,
  error: null,
  
  initialize: async () => {
    try {
      set({ isLoading: true });
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          set({
            user: {
              id: profile.id,
              email: profile.email,
              displayName: profile.display_name,
              avatarUrl: profile.avatar_url,
              level: profile.level,
              totalXp: profile.total_xp,
              isPro: profile.is_pro,
              proExpiresAt: profile.pro_expires_at,
              streakFreezesRemaining: profile.streak_freezes_remaining,
              timezone: profile.timezone,
              createdAt: profile.created_at,
              updatedAt: profile.updated_at,
            },
          });
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      set({ isLoading: false, isInitialized: true });
    }
  },
  
  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabaseSignIn(email, password);
      
      if (error) {
        set({ error: error.message, isLoading: false });
        return { success: false, error: error.message };
      }
      
      if (data.user) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profile) {
          set({
            user: {
              id: profile.id,
              email: profile.email,
              displayName: profile.display_name,
              avatarUrl: profile.avatar_url,
              level: profile.level,
              totalXp: profile.total_xp,
              isPro: profile.is_pro,
              proExpiresAt: profile.pro_expires_at,
              streakFreezesRemaining: profile.streak_freezes_remaining,
              timezone: profile.timezone,
              createdAt: profile.created_at,
              updatedAt: profile.updated_at,
            },
            isLoading: false,
          });
        }
      }
      
      return { success: true };
    } catch (error: any) {
      const message = error.message || 'Sign in failed';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },
  
  signUp: async (email, password) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabaseSignUp(email, password);
      
      if (error) {
        set({ error: error.message, isLoading: false });
        return { success: false, error: error.message };
      }
      
      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            level: 1,
            total_xp: 0,
            is_pro: false,
            streak_freezes_remaining: 0,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          });
        
        if (profileError) {
          console.error('Profile creation error:', profileError);
        }
        
        set({
          user: {
            id: data.user.id,
            email: data.user.email!,
            level: 1,
            totalXp: 0,
            isPro: false,
            streakFreezesRemaining: 0,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          isLoading: false,
        });
      }
      
      return { success: true };
    } catch (error: any) {
      const message = error.message || 'Sign up failed';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },
  
  signOut: async () => {
    set({ isLoading: true });
    await supabaseSignOut();
    set({ user: null, isLoading: false });
  },
  
  updateUser: (updates) => {
    const { user } = get();
    if (user) {
      set({ user: { ...user, ...updates } });
    }
  },
  
  clearError: () => set({ error: null }),
}));
