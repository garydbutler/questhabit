// Stripe Integration for QuestHabit Pro Subscriptions
// Uses Supabase Edge Functions for secure payment processing

import { supabase } from './supabase';
import { Linking } from 'react-native';

// Stripe Price IDs - Configure these in Stripe Dashboard
// These should be set via environment variables in production
export const STRIPE_PRICES = {
  PRO_MONTHLY: process.env.EXPO_PUBLIC_STRIPE_PRICE_MONTHLY || 'price_monthly_placeholder',
  PRO_YEARLY: process.env.EXPO_PUBLIC_STRIPE_PRICE_YEARLY || 'price_yearly_placeholder',
} as const;

export type PlanType = 'monthly' | 'yearly';

export interface CheckoutResult {
  success: boolean;
  sessionId?: string;
  url?: string;
  error?: string;
}

export interface PortalResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Create a Stripe Checkout session for Pro subscription
 */
export async function createCheckoutSession(
  userId: string,
  plan: PlanType
): Promise<CheckoutResult> {
  try {
    const priceId = plan === 'monthly' ? STRIPE_PRICES.PRO_MONTHLY : STRIPE_PRICES.PRO_YEARLY;

    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        priceId,
        userId,
        successUrl: 'questhabit://subscription-success',
        cancelUrl: 'questhabit://subscription-cancel',
      },
    });

    if (error) {
      console.error('Checkout session error:', error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      sessionId: data.sessionId,
      url: data.url,
    };
  } catch (error: any) {
    console.error('Create checkout session failed:', error);
    return { success: false, error: error.message || 'Failed to create checkout session' };
  }
}

/**
 * Open Stripe Checkout in browser
 */
export async function openCheckout(userId: string, plan: PlanType): Promise<CheckoutResult> {
  const result = await createCheckoutSession(userId, plan);

  if (result.success && result.url) {
    const canOpen = await Linking.canOpenURL(result.url);
    if (canOpen) {
      await Linking.openURL(result.url);
      return result;
    } else {
      return { success: false, error: 'Cannot open checkout URL' };
    }
  }

  return result;
}

/**
 * Create a Stripe Customer Portal session for subscription management
 */
export async function createCustomerPortalSession(userId: string): Promise<PortalResult> {
  try {
    const { data, error } = await supabase.functions.invoke('customer-portal', {
      body: {
        userId,
        returnUrl: 'questhabit://profile',
      },
    });

    if (error) {
      console.error('Customer portal error:', error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      url: data.url,
    };
  } catch (error: any) {
    console.error('Create customer portal session failed:', error);
    return { success: false, error: error.message || 'Failed to open subscription management' };
  }
}

/**
 * Open Stripe Customer Portal in browser
 */
export async function openCustomerPortal(userId: string): Promise<PortalResult> {
  const result = await createCustomerPortalSession(userId);

  if (result.success && result.url) {
    const canOpen = await Linking.canOpenURL(result.url);
    if (canOpen) {
      await Linking.openURL(result.url);
      return result;
    } else {
      return { success: false, error: 'Cannot open portal URL' };
    }
  }

  return result;
}

/**
 * Check if user has active Pro subscription
 */
export function isProActive(subscriptionStatus: string | null | undefined): boolean {
  return subscriptionStatus === 'active' || subscriptionStatus === 'trialing';
}

/**
 * Get subscription status display text
 */
export function getSubscriptionStatusText(status: string | null | undefined): string {
  switch (status) {
    case 'active':
      return 'Active';
    case 'trialing':
      return 'Trial';
    case 'past_due':
      return 'Past Due';
    case 'canceled':
      return 'Canceled';
    case 'incomplete':
      return 'Incomplete';
    case 'incomplete_expired':
      return 'Expired';
    case 'unpaid':
      return 'Unpaid';
    default:
      return 'Free';
  }
}
