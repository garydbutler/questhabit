# QuestHabit - Product Requirements Document

**Version:** 1.0  
**Last Updated:** January 28, 2026  
**Author:** Gary Butler  
**Status:** In Development

---

## Executive Summary

**QuestHabit** is a mobile-first habit tracking application that transforms daily routines into an engaging RPG-style adventure. By combining proven habit-building psychology with gamification mechanics, QuestHabit helps users build lasting habits through XP rewards, leveling systems, streaks, and AI-powered coaching.

**Tagline:** "Turn habits into quests. Level up your life."

---

## Market Research

### Industry Overview
The global habit tracking app market is valued at approximately $1.5B (2024) and growing at 15% CAGR. The wellness app market broadly is projected to reach $17.5B by 2027.

### Competitor Analysis

| App | Strengths | Weaknesses | Pricing |
|-----|-----------|------------|---------|
| **Habitica** | Deep RPG mechanics, social features, pets/avatars | Overwhelming complexity, dated UI, steep learning curve | Free / $9/mo |
| **Streaks** | Beautiful minimal design, Apple Watch, Siri integration | iOS only, no gamification, no social features | $4.99 one-time |
| **Fabulous** | Science-backed, beautiful onboarding, coaching | Expensive, very structured, less flexible | Free / $13/mo |
| **Habitify** | Clean design, cross-platform, good analytics | Limited gamification, no AI features | Free / $5/mo |
| **Loop Habit Tracker** | Open source, powerful charts, no ads | Android only, no cloud sync, utilitarian design | Free |

### Competitive Advantage
QuestHabit occupies the sweet spot between:
- Habitica's gamification (but with modern, accessible design)
- Streaks' minimalism (but with more engagement hooks)
- Fabulous's coaching (but AI-powered and more affordable)

**Key Differentiators:**
1. AI-powered personalized coaching at accessible price point
2. Modern dark-mode UI with satisfying micro-interactions
3. Balanced gamification (engaging but not overwhelming)
4. Cross-platform from day one (iOS, Android, Web)

---

## User Personas

### Primary Persona: "Alex the Aspiring"
- **Demographics:** 25-35, professional, tech-savvy
- **Goals:** Build morning routine, exercise consistency, learn new skills
- **Pain Points:** Starts strong but loses motivation after 2 weeks
- **Motivation:** Loves games, responds to progress visualization
- **Quote:** "I need something that makes habit building feel less like a chore"

### Secondary Persona: "Jordan the Juggler"
- **Demographics:** 30-45, parent, busy schedule
- **Goals:** Self-care habits, family routines, work-life balance
- **Pain Points:** Forgets habits amid chaos, guilt from breaking streaks
- **Motivation:** Wants structure without rigid schedules
- **Quote:** "I need flexibility and encouragement, not judgment"

### Tertiary Persona: "Sam the Self-Optimizer"
- **Demographics:** 20-30, student/early career, data-driven
- **Goals:** Track everything, find patterns, optimize performance
- **Pain Points:** Most apps lack detailed analytics
- **Motivation:** Loves stats, charts, and personal records
- **Quote:** "Show me the data and let me geek out"

---

## Feature Specifications

### MVP Features (v1.0)

#### 1. User Authentication
- Email/password sign up & login
- Social auth (Google, Apple)
- Password reset flow
- Session persistence

#### 2. Habit Management
- **Create Habit**
  - Name (required, max 50 chars)
  - Description (optional, max 200 chars)
  - Category: Health, Productivity, Learning, Wellness, Custom
  - Frequency: Daily, Weekdays (M-F), Weekends, Custom days
  - Difficulty: Easy (10 XP), Medium (25 XP), Hard (50 XP)
  - Icon (emoji picker)
  - Color (preset palette)
  - Reminder time (optional)

- **Edit Habit**
  - All creation fields modifiable
  - Archive option (preserves history)

- **Delete Habit**
  - Soft delete with confirmation
  - 30-day recovery window

#### 3. Daily View (Home Screen)
- Today's date with day-of-week
- Habits due today as card list
- Tap to complete with:
  - Satisfying checkmark animation
  - XP pop-up (+25 XP!)
  - Haptic feedback
- Daily progress bar (X of Y completed)
- Current streak badge per habit
- Quick add habit FAB

#### 4. Gamification System

**XP & Levels:**
- XP earned per completion based on difficulty
- Bonus XP: 
  - +10% for morning completion (before 9 AM)
  - +5% per streak day (capped at +50%)
- Level thresholds: 0, 100, 250, 500, 1000, 2000, 4000, 8000...
- Level up celebration (confetti, sound, achievement)

**Streaks:**
- Per-habit consecutive day tracking
- Visual flame icon with streak count
- "Streak freeze" (1 free miss per week for Pro users)
- Streak milestones: 7, 14, 30, 60, 90, 180, 365 days

**Achievements:**
| Achievement | Criteria | XP Bonus |
|-------------|----------|----------|
| First Step | Complete first habit | 50 |
| Week Warrior | 7-day streak | 100 |
| Fortnight Fighter | 14-day streak | 200 |
| Monthly Master | 30-day streak | 500 |
| Early Bird | Complete habit before 6 AM | 25 |
| Night Owl | Complete habit after 10 PM | 25 |
| Perfect Day | 100% daily completion | 50 |
| Perfect Week | 7 consecutive perfect days | 250 |
| Habit Collector | Create 5 habits | 50 |
| Level 5 | Reach level 5 | 100 |
| Level 10 | Reach level 10 | 250 |

#### 5. Stats & History
- **Calendar Heatmap:** GitHub-style contribution graph
- **Completion Rates:** Daily/weekly/monthly percentages
- **Streak Records:** Current vs best per habit
- **XP History:** Level progression timeline
- **Habit Breakdown:** Individual habit performance

#### 6. Profile & Settings
- Display name & avatar
- Current level & XP progress bar
- Achievement showcase
- Theme toggle (dark/light)
- Notification preferences
- Export data
- Account management (password, delete)

### Premium Features (Pro Tier)

#### AI Coach
- **Weekly Insights:** Pattern analysis email/notification
  - "You're most consistent on Tuesdays and Wednesdays"
  - "Your evening habits have 85% completion vs 60% for morning"
- **Streak Rescue:** When streak breaks
  - "You missed yesterday. Here's how successful users bounce back..."
  - Actionable 3-step recovery plan
- **Smart Suggestions:**
  - "Consider making 'Meditate' easier by reducing to 5 minutes"
  - "Your streak data suggests weekends are challenging—want to adjust?"
- **Motivational Messages:** Personalized encouragement based on history

#### Additional Pro Features
- Unlimited habits (vs 5 free)
- Full history access (vs 30 days)
- Streak freeze (1/week)
- Custom themes
- Priority support

---

## Technical Architecture

### Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Frontend | React Native + Expo | Cross-platform, fast development, OTA updates |
| Styling | NativeWind (Tailwind) | Rapid styling, consistent design system |
| State | Zustand | Simple, performant, minimal boilerplate |
| Backend | Supabase | Auth, DB, Edge Functions, real-time, generous free tier |
| AI | OpenAI GPT-4o-mini | Cost-effective, reliable, good for coaching use case |
| Analytics | PostHog | Privacy-focused, product analytics |

### Database Schema (Supabase/PostgreSQL)

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    level INTEGER DEFAULT 1,
    total_xp INTEGER DEFAULT 0,
    is_pro BOOLEAN DEFAULT FALSE,
    pro_expires_at TIMESTAMPTZ,
    streak_freezes_remaining INTEGER DEFAULT 0,
    timezone TEXT DEFAULT 'UTC',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habits table
CREATE TABLE public.habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'custom',
    frequency JSONB NOT NULL DEFAULT '{"type": "daily"}',
    difficulty TEXT NOT NULL DEFAULT 'medium',
    icon TEXT DEFAULT '⭐',
    color TEXT DEFAULT '#6366F1',
    reminder_time TIME,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Completions table
CREATE TABLE public.completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    completed_date DATE NOT NULL DEFAULT CURRENT_DATE,
    xp_earned INTEGER NOT NULL,
    streak_bonus DECIMAL(3,2) DEFAULT 0,
    time_bonus DECIMAL(3,2) DEFAULT 0,
    UNIQUE(habit_id, completed_date)
);

-- Streaks table
CREATE TABLE public.streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE UNIQUE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    last_completed_date DATE,
    freeze_used_at DATE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Achievements table
CREATE TABLE public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_type TEXT NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_type)
);

-- AI Coaching logs
CREATE TABLE public.coaching_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message_type TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_habits_user_id ON public.habits(user_id);
CREATE INDEX idx_completions_user_date ON public.completions(user_id, completed_date);
CREATE INDEX idx_completions_habit_date ON public.completions(habit_id, completed_date);
CREATE INDEX idx_streaks_habit_id ON public.streaks(habit_id);
CREATE INDEX idx_achievements_user_id ON public.achievements(user_id);
```

### Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own habits" ON public.habits
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own completions" ON public.completions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own streaks" ON public.streaks
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own achievements" ON public.achievements
    FOR SELECT USING (auth.uid() = user_id);
```

### API Structure

**Edge Functions (Supabase):**
- `complete-habit`: Mark habit complete, calculate XP, update streak
- `ai-coach-insights`: Generate weekly AI insights (Pro only)
- `check-achievements`: Evaluate and grant achievements
- `process-subscription`: Handle Stripe webhooks

### App Architecture

```
src/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Auth screens (login, signup)
│   ├── (tabs)/            # Main tab navigation
│   │   ├── index.tsx      # Home/Today
│   │   ├── stats.tsx      # Stats screen
│   │   └── profile.tsx    # Profile/Settings
│   ├── habit/
│   │   ├── [id].tsx       # Habit detail
│   │   └── new.tsx        # Create habit
│   └── onboarding/        # Onboarding flow
├── components/
│   ├── ui/                # Base UI components
│   ├── habits/            # Habit-specific components
│   ├── gamification/      # XP, levels, achievements
│   └── charts/            # Stats visualizations
├── hooks/                 # Custom React hooks
├── stores/                # Zustand stores
├── lib/
│   ├── supabase.ts       # Supabase client
│   ├── xp.ts             # XP calculation logic
│   └── achievements.ts   # Achievement logic
├── types/                 # TypeScript types
└── constants/             # App constants
```

---

## Monetization Strategy

### Pricing Model

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | 5 habits, 30-day history, basic stats, no AI |
| Pro Monthly | $4.99/mo | Unlimited habits, full history, AI coach, streak freeze, themes |
| Pro Annual | $39.99/yr | Same as monthly (33% savings) |

### Revenue Projections (Year 1)

| Metric | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|----------|
| MAU | 5,000 | 25,000 | 100,000 |
| Conversion Rate | 2% | 3% | 4% |
| Pro Users | 100 | 750 | 4,000 |
| MRR | $500 | $3,750 | $20,000 |
| ARR | $6,000 | $45,000 | $240,000 |

### Cost Structure
- **Supabase:** Free tier → ~$25/mo at scale
- **OpenAI API:** ~$0.002 per coaching interaction (~$200/mo at 100K MAU)
- **App Store fees:** 15-30% of revenue
- **Infrastructure:** ~$100/mo (CDN, monitoring)

---

## Go-To-Market Plan

### Phase 1: Soft Launch (Weeks 1-4)
- Launch on TestFlight (iOS) and internal testing track (Android)
- Gather feedback from 100 beta users
- Iterate on UX pain points
- Polish animations and performance

### Phase 2: Public Launch (Weeks 5-8)
- Submit to App Store and Google Play
- Launch ProductHunt campaign
- Reddit posts in r/getdisciplined, r/habits, r/productivity
- Twitter/X launch thread with demo video

### Phase 3: Growth (Weeks 9-16)
- Content marketing (habit-building blog posts)
- YouTube reviews and sponsorships
- Referral program (give a month, get a month)
- App Store optimization (ASO)

### Phase 4: Expansion (Weeks 17+)
- Social features (friends, challenges)
- Widget support (iOS, Android)
- Apple Watch / Wear OS companion
- Enterprise/teams offering

### Marketing Channels
| Channel | Strategy | Budget |
|---------|----------|--------|
| ProductHunt | Launch day push, engage comments | $0 |
| Reddit | Authentic community participation | $0 |
| Twitter/X | Build in public, indie hacker community | $0 |
| TikTok | Short app demos, habit tips | $200/mo |
| App Store Ads | Keyword campaigns | $500/mo |

---

## Success Metrics

### North Star Metric
**Weekly Active Habits Completed** — Users who complete at least one habit in a week

### Key Performance Indicators

| Metric | Target (Month 6) |
|--------|------------------|
| D1 Retention | 40% |
| D7 Retention | 25% |
| D30 Retention | 15% |
| Free-to-Pro Conversion | 3% |
| Average Session Length | 2 min |
| Habits Completed/DAU | 3.5 |

### User Success Metrics
- Average streak length
- Level progression rate
- Habit completion rate
- Achievement unlock rate

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Low retention | High | High | Focus on onboarding, streaks, notifications |
| Feature creep | Medium | Medium | Strict MVP scope, user feedback driven |
| Competition | Medium | Low | Differentiate on AI + gamification combo |
| AI costs | Low | Medium | Rate limiting, caching, efficient prompts |
| App store rejection | Low | High | Follow guidelines, early review |

---

## Timeline

| Week | Milestone |
|------|-----------|
| 1 | PRD complete, repo setup, Expo initialized |
| 2 | Auth flow, Supabase schema, navigation |
| 3 | Home screen, habit CRUD, basic completion |
| 4 | XP/levels, streaks, achievements |
| 5 | Stats screen, charts, polish |
| 6 | AI coach integration, Pro paywall |
| 7 | Bug fixes, performance, TestFlight |
| 8 | Public launch |

---

## Appendix

### Design Tokens

```javascript
const colors = {
  // Background
  bg: {
    primary: '#0F0F0F',
    secondary: '#1A1A1A',
    tertiary: '#252525',
  },
  // Accent
  accent: {
    primary: '#6366F1',    // Indigo
    success: '#22C55E',    // Green
    warning: '#F59E0B',    // Amber
    danger: '#EF4444',     // Red
    xp: '#FBBF24',         // Gold
  },
  // Text
  text: {
    primary: '#FFFFFF',
    secondary: '#A1A1A1',
    tertiary: '#6B6B6B',
  },
  // Categories
  categories: {
    health: '#22C55E',
    productivity: '#3B82F6',
    learning: '#8B5CF6',
    wellness: '#EC4899',
    custom: '#6366F1',
  }
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const typography = {
  h1: { fontSize: 32, fontWeight: '700' },
  h2: { fontSize: 24, fontWeight: '600' },
  h3: { fontSize: 20, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: '400' },
  caption: { fontSize: 14, fontWeight: '400' },
  small: { fontSize: 12, fontWeight: '400' },
};
```

### XP Formula

```javascript
function calculateXP(baseDifficulty, currentStreak, completionHour) {
  const baseXP = { easy: 10, medium: 25, hard: 50 }[baseDifficulty];
  
  // Streak bonus: +5% per day, capped at +50%
  const streakBonus = Math.min(currentStreak * 0.05, 0.5);
  
  // Morning bonus: +10% if before 9 AM
  const morningBonus = completionHour < 9 ? 0.1 : 0;
  
  const totalMultiplier = 1 + streakBonus + morningBonus;
  
  return Math.round(baseXP * totalMultiplier);
}
```

### Level Thresholds

```javascript
const levelThresholds = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  1000,   // Level 5
  2000,   // Level 6
  4000,   // Level 7
  8000,   // Level 8
  16000,  // Level 9
  32000,  // Level 10
  // Pattern: doubles after level 5
];

function getLevel(totalXP) {
  for (let i = levelThresholds.length - 1; i >= 0; i--) {
    if (totalXP >= levelThresholds[i]) {
      return i + 1;
    }
  }
  return 1;
}
```

---

*Document version 1.0 - Initial PRD for MVP development*

