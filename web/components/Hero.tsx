"use client";

interface HeroProps {
  email: string;
  setEmail: (val: string) => void;
  submitted: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function Hero({ email, setEmail, submitted, onSubmit }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[var(--color-accent-purple)] opacity-[0.04] blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[var(--color-accent-blue)] opacity-[0.04] blur-[100px]" />
      <div className="absolute top-1/3 right-1/3 w-[300px] h-[300px] rounded-full bg-[var(--color-accent-green)] opacity-[0.03] blur-[80px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left content */}
        <div className="animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] mb-6">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent-green)] animate-pulse" />
            <span className="text-xs text-[var(--color-text-secondary)]">
              Launching Soon - Join the Adventure
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Turn Your Habits
            <br />
            Into an{" "}
            <span className="gradient-text animate-gradient">
              Epic Adventure
            </span>
          </h1>

          <p className="text-lg text-[var(--color-text-secondary)] mb-8 max-w-lg">
            Build streaks. Earn XP. Unlock achievements. Level up your life with
            an AI-powered habit coach that makes self-improvement feel like
            playing your favorite game.
          </p>

          {/* Stats row */}
          <div className="flex gap-8 mb-6">
            {[
              { value: "50+", label: "Habit Templates" },
              { value: "AI", label: "Personal Coach" },
              { value: "100%", label: "Free to Start" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold gradient-text">
                  {stat.value}
                </div>
                <div className="text-xs text-[var(--color-text-muted)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Waitlist form */}
          <div id="waitlist">
            {submitted ? (
              <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-[var(--color-accent-green)]/10 border border-[var(--color-accent-green)]/30">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-accent-green)"
                  strokeWidth="2.5"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span className="text-[var(--color-accent-green)] font-medium">
                  You&apos;re on the list! We&apos;ll notify you at launch.
                </span>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-6 py-4 rounded-xl bg-[#1a1a2e] border-2 border-[#4a4a6a] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-purple)] transition-colors text-base"
                />
                <button
                  type="submit"
                  className="cta-button px-8 py-4 rounded-xl text-white font-semibold whitespace-nowrap text-base min-w-[160px]"
                >
                  Join Waitlist
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right side - Phone mockup */}
        <div className="hidden lg:flex justify-center">
          <div className="relative">
            {/* Glow behind phone */}
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-accent-purple)]/20 to-transparent blur-[60px] rounded-full" />

            <div className="phone-mockup animate-float relative z-10">
              {/* Screen content */}
              <div className="px-4 pt-14 pb-4 h-full overflow-hidden">
                {/* Status bar */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[11px] text-[var(--color-text-muted)]">
                    9:41
                  </span>
                  <div className="flex gap-1">
                    <div className="w-3.5 h-1.5 rounded-sm bg-[var(--color-text-muted)]" />
                    <div className="w-3.5 h-1.5 rounded-sm bg-[var(--color-text-muted)]" />
                    <div className="w-5 h-1.5 rounded-sm bg-[var(--color-accent-green)]" />
                  </div>
                </div>

                {/* Greeting */}
                <h3 className="text-base font-bold mb-0.5">Good morning! &#x1F525;</h3>
                <p className="text-[11px] text-[var(--color-text-muted)] mb-3">
                  Level 12 &middot; 2,450 XP
                </p>

                {/* XP Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-[var(--color-bg-primary)] mb-4">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent-purple)] to-[var(--color-accent-blue)]"
                    style={{ width: "72%" }}
                  />
                </div>

                {/* Streak card */}
                <div className="glass rounded-xl p-2.5 mb-3">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[11px] font-semibold">Current Streak</span>
                    <span className="text-sm font-bold gradient-text">
                      21 days
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-5 rounded-md ${
                          i < 5
                            ? "bg-[var(--color-accent-purple)]"
                            : i === 5
                            ? "bg-[var(--color-accent-purple)]/50"
                            : "bg-[var(--color-bg-primary)]"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Habit items */}
                {[
                  {
                    name: "Morning Meditation",
                    icon: "&#x1F9D8;",
                    xp: "+30 XP",
                    done: true,
                  },
                  {
                    name: "Read 20 pages",
                    icon: "&#x1F4DA;",
                    xp: "+25 XP",
                    done: true,
                  },
                  {
                    name: "Workout",
                    icon: "&#x1F4AA;",
                    xp: "+50 XP",
                    done: false,
                  },
                  {
                    name: "Journal",
                    icon: "&#x270D;&#xFE0F;",
                    xp: "+20 XP",
                    done: false,
                  },
                ].map((habit) => (
                  <div
                    key={habit.name}
                    className="flex items-center gap-2 py-2 border-b border-[var(--color-border)]"
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        habit.done
                          ? "bg-[var(--color-accent-green)] border-[var(--color-accent-green)]"
                          : "border-[var(--color-border)]"
                      }`}
                    >
                      {habit.done && (
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="3"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </div>
                    <span
                      className="text-sm"
                      dangerouslySetInnerHTML={{ __html: habit.icon }}
                    />
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-[11px] font-medium truncate ${
                          habit.done
                            ? "line-through text-[var(--color-text-muted)]"
                            : ""
                        }`}
                      >
                        {habit.name}
                      </div>
                    </div>
                    <span className="text-[10px] text-[var(--color-accent-purple-light)] shrink-0">
                      {habit.xp}
                    </span>
                  </div>
                ))}

                {/* Achievement toast */}
                <div className="mt-3 glass rounded-xl p-2.5 border-[var(--color-accent-orange)]/30 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[var(--color-accent-orange)]/20 flex items-center justify-center text-sm shrink-0">
                    &#x1F3C6;
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[var(--color-accent-orange)]">
                      Achievement Unlocked!
                    </div>
                    <div className="text-[10px] text-[var(--color-text-muted)]">
                      3-Week Warrior
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-text-muted)"
          strokeWidth="2"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
