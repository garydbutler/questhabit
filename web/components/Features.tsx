export function Features() {
  const features = [
    {
      icon: "&#x1F3AF;",
      title: "Quest-Based Habits",
      description:
        "Transform boring habits into exciting quests. Complete daily missions, chain combos, and watch your character grow stronger.",
      color: "var(--color-accent-purple)",
    },
    {
      icon: "&#x1F916;",
      title: "AI Coach",
      description:
        "Your personal AI habit coach analyzes your patterns, suggests optimizations, and keeps you motivated with smart insights.",
      color: "var(--color-accent-blue)",
    },
    {
      icon: "&#x1F525;",
      title: "Streak System",
      description:
        "Build powerful streaks with multiplier bonuses. The longer you go, the more XP you earn. Break a streak? Earn it back with recovery quests.",
      color: "var(--color-accent-orange)",
    },
    {
      icon: "&#x1F3C6;",
      title: "Achievements & Badges",
      description:
        "Unlock 50+ achievements as you progress. Showcase your badges, share milestones, and flex your dedication.",
      color: "var(--color-accent-green)",
    },
    {
      icon: "&#x1F4CA;",
      title: "Deep Analytics",
      description:
        "Calendar heatmaps, weekly summaries, category breakdowns, and trend analysis. Know exactly how you're doing.",
      color: "var(--color-accent-pink)",
    },
    {
      icon: "&#x1F4E4;",
      title: "Social Sharing",
      description:
        "Share beautiful streak cards, weekly summaries, and milestone celebrations. Inspire your friends to level up too.",
      color: "var(--color-accent-purple-light)",
    },
  ];

  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] mb-4">
            <span className="text-xs text-[var(--color-text-secondary)]">
              Features
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Level Up</span>
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            QuestHabit combines gamification, AI coaching, and beautiful design
            to make habit building genuinely enjoyable.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="feature-card p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)]"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                style={{ backgroundColor: `${feature.color}15` }}
                dangerouslySetInnerHTML={{ __html: feature.icon }}
              />
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
