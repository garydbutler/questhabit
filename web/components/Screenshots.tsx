export function Screenshots() {
  const screens = [
    {
      title: "Today View",
      description: "Your daily quest board with XP tracking and streak info",
      content: (
        <div className="p-4 pt-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-sm font-bold">Today&apos;s Quests</h4>
              <p className="text-[10px] text-[var(--color-text-muted)]">
                4 of 6 completed
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold gradient-text">+185 XP</div>
              <p className="text-[10px] text-[var(--color-text-muted)]">
                earned today
              </p>
            </div>
          </div>
          <div className="w-full h-2 rounded-full bg-[var(--color-bg-primary)] mb-4">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent-green)] to-[var(--color-accent-blue)]"
              style={{ width: "67%" }}
            />
          </div>
          {["Meditate", "Read", "Exercise", "Journal", "Water", "Sleep"].map(
            (name, i) => (
              <div
                key={name}
                className="flex items-center gap-3 py-2 border-b border-[var(--color-border)]/50"
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 ${
                    i < 4
                      ? "bg-[var(--color-accent-green)] border-[var(--color-accent-green)]"
                      : "border-[var(--color-border)]"
                  }`}
                />
                <span
                  className={`text-xs flex-1 ${
                    i < 4 ? "line-through text-[var(--color-text-muted)]" : ""
                  }`}
                >
                  {name}
                </span>
                <span className="text-[10px] text-[var(--color-accent-purple-light)]">
                  +{[30, 25, 50, 20, 15, 30][i]} XP
                </span>
              </div>
            )
          )}
        </div>
      ),
    },
    {
      title: "AI Coach",
      description: "Personalized insights and recommendations",
      content: (
        <div className="p-4 pt-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-accent-purple)] to-[var(--color-accent-blue)] flex items-center justify-center text-xs">
              AI
            </div>
            <div>
              <h4 className="text-sm font-bold">Your Coach</h4>
              <p className="text-[10px] text-[var(--color-accent-green)]">
                Online
              </p>
            </div>
          </div>

          {[
            {
              msg: "Great 21-day streak! Your consistency is in the top 5% of users.",
              type: "ai",
            },
            {
              msg: "I noticed you tend to skip workouts on Wednesdays. Try scheduling them earlier?",
              type: "ai",
            },
            { msg: "That's a good idea, I'll try mornings", type: "user" },
            {
              msg: "Perfect! I've updated your Wednesday reminder to 7 AM. You've got this!",
              type: "ai",
            },
          ].map((chat, i) => (
            <div
              key={i}
              className={`mb-3 ${
                chat.type === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block px-3 py-2 rounded-xl text-[11px] max-w-[85%] ${
                  chat.type === "user"
                    ? "bg-[var(--color-accent-purple)] text-white"
                    : "glass"
                }`}
              >
                {chat.msg}
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Stats & Insights",
      description: "Beautiful analytics with calendar heatmaps",
      content: (
        <div className="p-4 pt-8">
          <h4 className="text-sm font-bold mb-1">Your Stats</h4>
          <p className="text-[10px] text-[var(--color-text-muted)] mb-4">
            Last 30 days
          </p>

          {/* Mini heatmap */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {Array.from({ length: 28 }).map((_, i) => {
              const intensity = [3, 3, 2, 3, 1, 0, 3, 3, 3, 3, 2, 3, 0, 2, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 2, 3, 3][i];
              const colors = [
                "bg-[var(--color-bg-primary)]",
                "bg-[var(--color-accent-purple)]/25",
                "bg-[var(--color-accent-purple)]/50",
                "bg-[var(--color-accent-purple)]",
              ];
              return (
                <div
                  key={i}
                  className={`aspect-square rounded-sm ${colors[intensity]}`}
                />
              );
            })}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              { label: "Current Streak", value: "21 days" },
              { label: "Best Streak", value: "21 days" },
              { label: "Total XP", value: "2,450" },
              { label: "Completion", value: "89%" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass rounded-lg p-2 text-center"
              >
                <div className="text-sm font-bold gradient-text">
                  {stat.value}
                </div>
                <div className="text-[9px] text-[var(--color-text-muted)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Mini chart */}
          <div className="glass rounded-lg p-3">
            <div className="text-[10px] font-semibold mb-2">Weekly Trend</div>
            <div className="flex items-end gap-1 h-12">
              {[60, 80, 45, 90, 100, 75, 85].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-gradient-to-t from-[var(--color-accent-purple)] to-[var(--color-accent-blue)]"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between text-[8px] text-[var(--color-text-muted)] mt-1">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] mb-4">
            <span className="text-xs text-[var(--color-text-secondary)]">
              App Preview
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            See It In <span className="gradient-text">Action</span>
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            A sneak peek at what your habit-building adventure looks like.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 justify-items-center">
          {screens.map((screen) => (
            <div key={screen.title} className="text-center">
              <div className="phone-mockup mx-auto mb-4 scale-90">
                {screen.content}
              </div>
              <h3 className="font-bold mb-1">{screen.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {screen.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
