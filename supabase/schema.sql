-- QuestHabit Database Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
-- Extends Supabase auth.users with app-specific data
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    level INTEGER DEFAULT 1 NOT NULL,
    total_xp INTEGER DEFAULT 0 NOT NULL,
    is_pro BOOLEAN DEFAULT FALSE NOT NULL,
    pro_expires_at TIMESTAMPTZ,
    streak_freezes_remaining INTEGER DEFAULT 0 NOT NULL,
    timezone TEXT DEFAULT 'UTC' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- HABITS TABLE
-- ============================================
CREATE TABLE public.habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'custom',
    frequency JSONB NOT NULL DEFAULT '{"type": "daily"}',
    difficulty TEXT NOT NULL DEFAULT 'medium',
    icon TEXT DEFAULT '⭐' NOT NULL,
    color TEXT DEFAULT '#6366F1' NOT NULL,
    reminder_time TIME,
    is_archived BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT valid_category CHECK (category IN ('health', 'productivity', 'learning', 'wellness', 'custom')),
    CONSTRAINT valid_difficulty CHECK (difficulty IN ('easy', 'medium', 'hard'))
);

-- ============================================
-- COMPLETIONS TABLE
-- ============================================
CREATE TABLE public.completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    completed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    completed_date DATE NOT NULL DEFAULT CURRENT_DATE,
    xp_earned INTEGER NOT NULL,
    streak_bonus DECIMAL(3,2) DEFAULT 0 NOT NULL,
    time_bonus DECIMAL(3,2) DEFAULT 0 NOT NULL,
    
    CONSTRAINT unique_habit_completion_per_day UNIQUE(habit_id, completed_date)
);

-- ============================================
-- STREAKS TABLE
-- ============================================
CREATE TABLE public.streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE UNIQUE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0 NOT NULL,
    best_streak INTEGER DEFAULT 0 NOT NULL,
    last_completed_date DATE,
    freeze_used_at DATE,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- ACHIEVEMENTS TABLE
-- ============================================
CREATE TABLE public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_type TEXT NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT unique_user_achievement UNIQUE(user_id, achievement_type),
    CONSTRAINT valid_achievement_type CHECK (achievement_type IN (
        'first_step', 'week_warrior', 'fortnight_fighter', 'monthly_master',
        'early_bird', 'night_owl', 'perfect_day', 'perfect_week',
        'habit_collector', 'level_5', 'level_10'
    ))
);

-- ============================================
-- COACHING LOGS TABLE (for AI features)
-- ============================================
CREATE TABLE public.coaching_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message_type TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_habits_user_id ON public.habits(user_id);
CREATE INDEX idx_habits_user_archived ON public.habits(user_id, is_archived);
CREATE INDEX idx_completions_user_date ON public.completions(user_id, completed_date);
CREATE INDEX idx_completions_habit_date ON public.completions(habit_id, completed_date);
CREATE INDEX idx_streaks_habit_id ON public.streaks(habit_id);
CREATE INDEX idx_streaks_user_id ON public.streaks(user_id);
CREATE INDEX idx_achievements_user_id ON public.achievements(user_id);
CREATE INDEX idx_coaching_logs_user_id ON public.coaching_logs(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Habits policies
CREATE POLICY "Users can view own habits" 
    ON public.habits FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own habits" 
    ON public.habits FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits" 
    ON public.habits FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits" 
    ON public.habits FOR DELETE 
    USING (auth.uid() = user_id);

-- Completions policies
CREATE POLICY "Users can view own completions" 
    ON public.completions FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own completions" 
    ON public.completions FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own completions" 
    ON public.completions FOR DELETE 
    USING (auth.uid() = user_id);

-- Streaks policies
CREATE POLICY "Users can view own streaks" 
    ON public.streaks FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own streaks" 
    ON public.streaks FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks" 
    ON public.streaks FOR UPDATE 
    USING (auth.uid() = user_id);

-- Achievements policies
CREATE POLICY "Users can view own achievements" 
    ON public.achievements FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements" 
    ON public.achievements FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Coaching logs policies
CREATE POLICY "Users can view own coaching logs" 
    ON public.coaching_logs FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own coaching logs" 
    ON public.coaching_logs FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to automatically create a profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, timezone)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'timezone', 'UTC')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_habits_updated_at
    BEFORE UPDATE ON public.habits
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_streaks_updated_at
    BEFORE UPDATE ON public.streaks
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- SAMPLE DATA (optional, for testing)
-- ============================================
-- Uncomment below to insert sample achievements definitions
-- These are reference data, not user-specific

/*
-- You can use this to verify the schema works:
-- After signing up a test user, try creating a habit:

INSERT INTO public.habits (user_id, name, category, difficulty)
VALUES (
    'YOUR_USER_ID_HERE',
    'Morning Meditation',
    'wellness',
    'medium'
);
*/
