export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah K.",
      role: "Fitness Enthusiast",
      avatar: "S",
      color: "var(--color-accent-pink)",
      text: "I've tried every habit tracker out there. QuestHabit is the first one that actually made me WANT to check things off. The XP system is addictive in the best way.",
      streak: "45-day streak",
    },
    {
      name: "Marcus J.",
      role: "Software Developer",
      avatar: "M",
      color: "var(--color-accent-blue)",
      text: "The AI Coach caught that I always skip meditation on Mondays and suggested a shorter 5-min session. Now I haven't missed a day in 3 weeks. It actually learns your patterns.",
      streak: "21-day streak",
    },
    {
      name: "Priya R.",
      role: "Graduate Student",
      avatar: "P",
      color: "var(--color-accent-green)",
      text: "Sharing my streak cards on Instagram has my friends downloading the app. The social features aren't just fun — they create real accountability.",
      streak: "33-day streak",
    },
  ];

  return (
    <section className="py-24 px-4 bg-[var(--color-bg-secondary)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] mb-4">
            <span className="text-xs text-[var(--color-text-secondary)]">
              Early Feedback
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Loved by <span className="gradient-text">Beta Users</span>
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Here&apos;s what early testers are saying about their QuestHabit experience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="feature-card p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)]"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="var(--color-accent-orange)"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: t.color }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-[var(--color-text-muted)]">
                    {t.role}
                  </div>
                </div>
                <div className="ml-auto">
                  <span className="text-[10px] px-2 py-1 rounded-full bg-[var(--color-accent-purple)]/10 text-[var(--color-accent-purple-light)]">
                    {t.streak}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
