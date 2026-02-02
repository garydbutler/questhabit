interface CTAProps {
  email: string;
  setEmail: (val: string) => void;
  submitted: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function CTA({ email, setEmail, submitted, onSubmit }: CTAProps) {
  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Decorative background */}
        <div className="relative rounded-3xl overflow-hidden p-12 sm:p-16">
          {/* Gradient bg */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent-purple)]/20 via-[var(--color-bg-card)] to-[var(--color-accent-blue)]/20 rounded-3xl" />
          <div className="absolute inset-0 border border-[var(--color-accent-purple)]/20 rounded-3xl" />

          {/* Floating orbs */}
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-[var(--color-accent-purple)] opacity-[0.06] blur-[60px]" />
          <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-[var(--color-accent-blue)] opacity-[0.06] blur-[60px]" />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Ready to Start Your{" "}
              <span className="gradient-text">Adventure?</span>
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-8 max-w-xl mx-auto">
              Join thousands of early adopters turning their daily habits into
              an epic quest. Be first in line when we launch.
            </p>

            {/* Waitlist form */}
            {submitted ? (
              <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-[var(--color-accent-green)]/10 border border-[var(--color-accent-green)]/30">
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
                  You&apos;re on the list! Check your inbox for a confirmation.
                </span>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-5 py-3.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-purple)] transition-colors"
                />
                <button
                  type="submit"
                  className="cta-button px-8 py-3.5 rounded-xl text-white font-semibold whitespace-nowrap"
                >
                  Join the Quest
                </button>
              </form>
            )}

            <p className="text-xs text-[var(--color-text-muted)] mt-4">
              Free forever plan available. No credit card required.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
