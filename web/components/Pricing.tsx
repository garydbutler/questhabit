export function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Everything you need to build better habits",
      featured: false,
      features: [
        { text: "Up to 5 active habits", included: true },
        { text: "Basic streak tracking", included: true },
        { text: "Daily quest board", included: true },
        { text: "10 habit templates", included: true },
        { text: "XP & leveling system", included: true },
        { text: "Community badges", included: true },
        { text: "AI Coach (3 msgs/day)", included: true },
        { text: "Branded share cards", included: true },
        { text: "Advanced analytics", included: false },
        { text: "Unlimited AI Coach", included: false },
      ],
      cta: "Get Started Free",
      ctaStyle: "border border-[var(--color-border)] hover:border-[var(--color-accent-purple)]",
    },
    {
      name: "Pro",
      price: "$4.99",
      period: "/month",
      description: "For serious habit builders who want every edge",
      featured: true,
      features: [
        { text: "Unlimited habits", included: true },
        { text: "Advanced streak system", included: true },
        { text: "All 50+ templates", included: true },
        { text: "Calendar heatmaps", included: true },
        { text: "Deep analytics & trends", included: true },
        { text: "Unlimited AI Coach", included: true },
        { text: "Custom categories", included: true },
        { text: "Clean share cards (no watermark)", included: true },
        { text: "Data export (JSON/CSV)", included: true },
        { text: "Priority support", included: true },
      ],
      cta: "Start Pro Trial",
      ctaStyle: "cta-button",
    },
  ];

  return (
    <section id="pricing" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] mb-4">
            <span className="text-xs text-[var(--color-text-secondary)]">
              Pricing
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Simple, <span className="gradient-text">Honest Pricing</span>
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Start free. Upgrade when you&apos;re ready for more.
            No hidden fees, no surprise charges.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`pricing-card rounded-2xl p-8 bg-[var(--color-bg-card)] border ${
                plan.featured
                  ? "featured"
                  : "border-[var(--color-border)]"
              }`}
            >
              {plan.featured && (
                <div className="text-[10px] font-bold text-[var(--color-accent-purple)] uppercase tracking-widest mb-4">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-extrabold gradient-text">
                  {plan.price}
                </span>
                <span className="text-sm text-[var(--color-text-muted)]">
                  {plan.period}
                </span>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                {plan.description}
              </p>

              {/* Feature list */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={feature.text}
                    className="flex items-center gap-3 text-sm"
                  >
                    {feature.included ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--color-accent-green)"
                        strokeWidth="2.5"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--color-text-muted)"
                        strokeWidth="2"
                      >
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    )}
                    <span
                      className={
                        feature.included
                          ? "text-[var(--color-text-secondary)]"
                          : "text-[var(--color-text-muted)]"
                      }
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="#waitlist"
                className={`block w-full py-3.5 rounded-xl text-center font-semibold text-white transition-all ${plan.ctaStyle}`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Annual savings note */}
        <p className="text-center text-sm text-[var(--color-text-muted)] mt-8">
          Annual plan coming soon — save 2 months free.
        </p>
      </div>
    </section>
  );
}
