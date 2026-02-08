import { create } from 'zustand';
import { useAuthStore } from './authStore';
import { 
  openCheckout, 
  openCustomerPortal, 
  PlanType,
  isProActive,
} from '../lib/stripe';

interface SubscriptionState {
  isLoading: boolean;
  error: string | null;
  
  // Actions
  purchasePro: (plan: PlanType) => Promise<{ success: boolean; error?: string }>;
  manageSubscription: () => Promise<{ success: boolean; error?: string }>;
  refreshSubscriptionStatus: () => Promise<void>;
  clearError: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  isLoading: false,
  error: null,

  purchasePro: async (plan: PlanType) => {
    const { user } = useAuthStore.getState();
    
    if (!user) {
      return { success: false, error: 'Please sign in to purchase Pro' };
    }

    set({ isLoading: true, error: null });

    try {
      const result = await openCheckout(user.id, plan);
      
      if (!result.success) {
        set({ error: result.error, isLoading: false });
        return { success: false, error: result.error };
      }

      // Checkout opened in browser - user will complete purchase there
      // Webhook will update their subscription status
      set({ isLoading: false });
      return { success: true };
    } catch (error: any) {
      const message = error.message || 'Failed to start checkout';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  manageSubscription: async () => {
    const { user } = useAuthStore.getState();
    
    if (!user) {
      return { success: false, error: 'Please sign in' };
    }

    if (!user.isPro) {
      return { success: false, error: 'No active subscription to manage' };
    }

    set({ isLoading: true, error: null });

    try {
      const result = await openCustomerPortal(user.id);
      
      if (!result.success) {
        set({ error: result.error, isLoading: false });
        return { success: false, error: result.error };
      }

      set({ isLoading: false });
      return { success: true };
    } catch (error: any) {
      const message = error.message || 'Failed to open subscription management';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  refreshSubscriptionStatus: async () => {
    // Re-fetch user profile to get latest subscription status
    // This is called when app resumes after checkout
    await useAuthStore.getState().initialize();
  },

  clearError: () => set({ error: null }),
}));
