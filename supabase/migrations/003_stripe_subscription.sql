-- Migration: Add Stripe subscription columns to profiles table
-- Required for Pro subscription management

-- Add Stripe-related columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_status TEXT;

-- Create index on stripe_customer_id for webhook lookups
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id 
ON public.profiles(stripe_customer_id);

-- Create subscriptions history table for tracking subscription changes
CREATE TABLE IF NOT EXISTS public.subscription_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    stripe_subscription_id TEXT NOT NULL,
    status TEXT NOT NULL,
    price_id TEXT NOT NULL,
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for user lookup
CREATE INDEX IF NOT EXISTS idx_subscription_history_user_id 
ON public.subscription_history(user_id);

-- Enable RLS
ALTER TABLE public.subscription_history ENABLE ROW LEVEL SECURITY;

-- Users can only view their own subscription history
CREATE POLICY "Users can view own subscription history" 
ON public.subscription_history
FOR SELECT USING (auth.uid() = user_id);

-- Only service role can insert (from webhook)
CREATE POLICY "Service role can insert subscription history" 
ON public.subscription_history
FOR INSERT WITH CHECK (true);

-- Comment on columns for documentation
COMMENT ON COLUMN public.profiles.stripe_customer_id IS 'Stripe customer ID for payment processing';
COMMENT ON COLUMN public.profiles.stripe_subscription_id IS 'Active Stripe subscription ID';
COMMENT ON COLUMN public.profiles.stripe_subscription_status IS 'Current subscription status: active, trialing, past_due, canceled, etc.';
