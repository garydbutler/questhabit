export function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-accent-purple)] to-[var(--color-accent-blue)] flex items-center justify-center text-white font-bold text-sm">
                Q
              </div>
              <span className="text-lg font-bold">
                Quest<span className="gradient-text">Habit</span>
              </span>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              Turn your habits into an epic adventure. Build streaks, earn XP,
              and level up your life.
            </p>
            {/* Social links placeholder */}
            <div className="flex gap-3">
              {["Twitter", "Instagram", "TikTok"].map((platform) => (
                <a
                  key={platform}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-accent-purple)] hover:border-[var(--color-accent-purple)]/50 transition-all text-xs"
                >
                  {platform[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Product</h4>
            <ul className="space-y-2">
              {["Features", "Pricing", "Roadmap", "Changelog"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent-purple-light)] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2">
              {["About", "Blog", "Careers", "Press"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent-purple-light)] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Legal</h4>
            <ul className="space-y-2">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent-purple-light)] transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-[var(--color-border)]">
          <p className="text-xs text-[var(--color-text-muted)]">
            &copy; {new Date().getFullYear()} QuestHabit. All rights reserved.
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-2 sm:mt-0">
            Made with dedication and too much coffee.
          </p>
        </div>
      </div>
    </footer>
  );
}
