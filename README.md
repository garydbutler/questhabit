# QuestHabit ⚔️

**Turn habits into quests. Level up your life.**

A gamified habit tracker that transforms daily routines into an RPG adventure. Earn XP, build streaks, unlock achievements, and get AI-powered coaching.

## Features

- **Habit Management** — Create, edit, track daily habits with categories and difficulty levels
- **XP & Leveling** — Earn XP for completing habits, with streak bonuses and morning bonuses
- **Streaks** — Track current and best streaks for each habit
- **Achievements** — Unlock badges like First Step, Week Warrior, Monthly Master
- **AI Coach** — Chat with an AI coach that analyzes your habits and gives personalized advice
- **Calendar Heatmap** — GitHub-style activity visualization
- **Onboarding** — Swipeable intro that explains the app's value
- **Dark Mode** — Beautiful dark theme throughout
- **Cross-Platform** — iOS, Android, and Web via Expo

## Tech Stack

- **Framework:** React Native + Expo (SDK 54)
- **Navigation:** Expo Router (file-based routing)
- **Backend:** Supabase (Auth, Postgres, RLS)
- **State:** Zustand
- **Styling:** React Native StyleSheet (dark theme)
- **Animations:** React Native Reanimated
- **Haptics:** Expo Haptics

## Quick Start

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your project URL and anon key

### 2. Run Database Schema

1. Open Supabase SQL Editor
2. Paste contents of `supabase/schema.sql`
3. Run it — this creates all tables, RLS policies, and triggers

### 3. Configure Environment

```bash
cd app
cp .env.example .env.local
```

Edit `.env.local`:
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Install & Run

```bash
cd app
npm install
npx expo start
```

Scan QR code with Expo Go (iOS/Android) or press `w` for web.

## Project Structure

```
app/
├── src/
│   ├── app/                    # Expo Router pages
│   │   ├── (auth)/             # Login & Signup
│   │   ├── (tabs)/             # Main tabs (Today, Coach, Stats, Profile)
│   │   ├── habit/              # New & Edit habit modals
│   │   ├── onboarding.tsx      # First-time user experience
│   │   └── _layout.tsx         # Root layout
│   ├── components/
│   │   ├── coaching/           # AI Coach chat interface
│   │   ├── gamification/       # Level badge, XP popup
│   │   ├── habits/             # Habit card, daily progress
│   │   ├── stats/              # Calendar heatmap
│   │   └── ui/                 # Button, Input, Card, ProgressBar
│   ├── constants/              # XP values, levels, categories
│   ├── lib/                    # Supabase client, XP calc, achievements
│   ├── stores/                 # Zustand stores (auth, habits)
│   └── types/                  # TypeScript interfaces
├── supabase/
│   └── schema.sql              # Complete database schema
└── PRD.md                      # Product requirements document
```

## Revenue Model

- **Free Tier:** 5 habits, 30-day history
- **Pro ($4.99/mo):** Unlimited habits, full history, AI coach, advanced stats

## Roadmap

- [ ] Push notifications for reminders
- [ ] Social features (friend challenges)
- [ ] Custom habit categories
- [ ] Data export (CSV)
- [ ] Apple Health / Google Fit integration
- [ ] Widgets (iOS/Android)

## License

Private — © 2026 Gary Butler
