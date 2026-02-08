export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Pick Your Quests",
      description:
        "Choose from 50+ habit templates or create your own. Morning meditation, workout, reading — whatever you want to master.",
      icon: "&#x1F3AE;",
    },
    {
      number: "02",
      title: "Complete Daily Missions",
      description:
        "Check off habits as you go. Each completion earns XP, builds your streak, and moves you closer to the next level.",
      icon: "&#x2705;",
    },
    {
      number: "03",
      title: "Earn & Level Up",
      description:
        "XP accumulates into levels. Unlock achievements, earn badges, and watch your character transform as you grow.",
      icon: "&#x1F4AA;",
    },
    {
      number: "04",
      title: "Get AI Insights",
      description:
        "Your AI coach tracks patterns, identifies what's working, and gives personalized tips to keep your momentum going.",
      icon: "&#x1F9E0;",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-24 px-4 bg-[var(--color-bg-secondary)]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] mb-4">
            <span className="text-xs text-[var(--color-text-secondary)]">
              How It Works
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Simple to Start,{" "}
            <span className="gradient-text">Hard to Stop</span>
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Getting started takes less than 2 minutes. Staying consistent? That&apos;s
            where the game mechanics kick in.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-[var(--color-accent-purple)]/30 to-transparent z-0" />
              )}

              <div className="relative z-10 text-center p-6">
                {/* Step number */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)] mb-4">
                  <span
                    className="text-2xl"
                    dangerouslySetInnerHTML={{ __html: step.icon }}
                  />
                </div>

                {/* Number label */}
                <div className="text-[10px] font-bold text-[var(--color-accent-purple)] tracking-widest uppercase mb-2">
                  Step {step.number}
                </div>

                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
