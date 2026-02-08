-- Waitlist table for landing page signups
-- Stores emails and metadata for pre-launch marketing

CREATE TABLE IF NOT EXISTS public.waitlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    source TEXT DEFAULT 'landing_page',
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    converted_at TIMESTAMPTZ, -- Set when user signs up for real account
    converted_user_id UUID REFERENCES auth.users(id)
);

-- Index for email lookups
CREATE INDEX idx_waitlist_email ON public.waitlist(email);

-- Index for analytics
CREATE INDEX idx_waitlist_created_at ON public.waitlist(created_at);
CREATE INDEX idx_waitlist_source ON public.waitlist(source);

-- Enable RLS but allow inserts from anon for public signup
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to add themselves to waitlist
CREATE POLICY "Anyone can join waitlist" ON public.waitlist
    FOR INSERT
    WITH CHECK (true);

-- Only authenticated admin can view waitlist (we'll check in edge function)
-- For now, no SELECT policy = no direct access
