-- ═══════════════════════════════════════════════════════════════
-- QuestHabit: Quest Challenge System
-- Migration: 002_quest_system
-- Description: Daily/Weekly/Legendary quest challenges with
--              progress tracking and reward claiming
-- ═══════════════════════════════════════════════════════════════

-- Active quests assigned to users (generated from template pool)
CREATE TABLE public.active_quests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    template_id TEXT NOT NULL,           -- References app-side template ID
    tier TEXT NOT NULL CHECK (tier IN ('daily', 'weekly', 'legendary')),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    requirement JSONB NOT NULL,          -- { type, target, category?, difficulty?, hour? }
    reward JSONB NOT NULL,               -- { xp, streakFreezes?, badge? }
    icon TEXT NOT NULL DEFAULT '',
    color TEXT NOT NULL DEFAULT '#06B6D4',
    progress INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired', 'claimed')),
    activated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    claimed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quest completion history (claimed rewards)
CREATE TABLE public.quest_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    quest_template_id TEXT NOT NULL,
    quest_name TEXT NOT NULL,
    tier TEXT NOT NULL CHECK (tier IN ('daily', 'weekly', 'legendary')),
    xp_earned INTEGER NOT NULL DEFAULT 0,
    streak_freezes_earned INTEGER NOT NULL DEFAULT 0,
    badge_earned TEXT,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_active_quests_user ON public.active_quests(user_id);
CREATE INDEX idx_active_quests_status ON public.active_quests(user_id, status);
CREATE INDEX idx_active_quests_expires ON public.active_quests(expires_at);
CREATE INDEX idx_quest_completions_user ON public.quest_completions(user_id);
CREATE INDEX idx_quest_completions_date ON public.quest_completions(user_id, completed_at);

-- RLS Policies
ALTER TABLE public.active_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_completions ENABLE ROW LEVEL SECURITY;

-- Users can only access their own quests
CREATE POLICY "Users can view own active quests"
    ON public.active_quests FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own active quests"
    ON public.active_quests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own active quests"
    ON public.active_quests FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own active quests"
    ON public.active_quests FOR DELETE
    USING (auth.uid() = user_id);

-- Users can only access their own quest completions
CREATE POLICY "Users can view own quest completions"
    ON public.quest_completions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quest completions"
    ON public.quest_completions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Function to expire old quests (can be called by cron or edge function)
CREATE OR REPLACE FUNCTION expire_old_quests()
RETURNS void AS $$
BEGIN
    UPDATE public.active_quests
    SET status = 'expired', updated_at = NOW()
    WHERE status = 'active'
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
