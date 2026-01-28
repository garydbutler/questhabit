# 🦸 HabitHero

> Level up your life, one habit at a time

A gamified habit tracking app with AI coaching built with React Native (Expo) and Supabase.

![HabitHero Banner](https://img.shields.io/badge/Status-In%20Development-yellow)
![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20Web-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### Core Features
- 📋 **Habit Management** - Create, edit, and track daily habits
- 🎮 **Gamification** - Earn XP, level up, and maintain streaks
- 🔥 **Streak Tracking** - Build momentum with consecutive day tracking
- 🏆 **Achievements** - Unlock badges for milestones
- 📊 **Stats & Analytics** - Visualize your progress

### Premium Features (Pro)
- 🤖 **AI Coach** - Personalized insights and motivation
- ♾️ **Unlimited Habits** - No limits on habit creation
- 🧊 **Streak Freeze** - Protect your streaks
- 🎨 **Custom Themes** - Personalize your experience

## 🛠️ Tech Stack

- **Frontend:** React Native with Expo
- **Navigation:** Expo Router
- **State Management:** Zustand
- **Backend:** Supabase (Auth, Database, Edge Functions)
- **Styling:** StyleSheet + NativeWind
- **AI:** OpenAI GPT-4o-mini

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- A Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/garydbutler/habithero.git
   cd habithero
   ```

2. **Install dependencies**
   ```bash
   cd app
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Run the SQL schema from `supabase/schema.sql` in the SQL Editor
   - Copy your project URL and anon key

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Run on your device**
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Or press `w` to open in web browser

## 📁 Project Structure

```
habithero/
├── app/                    # Expo app
│   ├── src/
│   │   ├── app/           # Expo Router screens
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── stores/        # Zustand stores
│   │   ├── lib/           # Utilities & API clients
│   │   ├── types/         # TypeScript types
│   │   └── constants/     # App constants
│   ├── assets/            # Images, fonts, etc.
│   └── package.json
├── supabase/
│   └── schema.sql         # Database schema
├── PRD.md                  # Product Requirements Doc
└── README.md
```

## 📱 Screenshots

*Coming soon*

## 🗺️ Roadmap

- [x] Core habit management
- [x] XP & leveling system
- [x] Streak tracking
- [x] Basic stats
- [ ] Calendar heatmap
- [ ] AI coach integration
- [ ] Push notifications
- [ ] Social features
- [ ] Apple Watch / Wear OS

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Expo](https://expo.dev) for the amazing React Native tooling
- [Supabase](https://supabase.com) for the backend infrastructure
- [Habitica](https://habitica.com) for gamification inspiration

---

**Made with ❤️ by Gary Butler**
