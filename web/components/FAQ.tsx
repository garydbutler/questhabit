"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Is QuestHabit really free?",
    a: "Yes! The free plan includes up to 5 habits, streak tracking, XP/leveling, templates, and even limited AI coaching. No credit card required. Pro unlocks unlimited habits, full analytics, unlimited AI coach, and clean share cards.",
  },
  {
    q: "What makes this different from other habit trackers?",
    a: "QuestHabit is built from the ground up as a game. Every habit completion earns XP, builds streaks with multiplier bonuses, and unlocks achievements. Plus, our AI Coach doesn't just remind you — it actually analyzes your patterns and gives personalized tips. Most trackers are just checklists. We're an adventure.",
  },
  {
    q: "How does the AI Coach work?",
    a: "The AI Coach monitors your habit completion patterns, identifies trends (like which days you struggle), and proactively suggests adjustments. It's like having a personal productivity coach who never sleeps. Free users get 3 messages per day; Pro users get unlimited access.",
  },
  {
    q: "Can I export my data?",
    a: "Absolutely. Pro users can export all habit data, completions, and stats as JSON or CSV files. Your data is yours — we'll never lock you in.",
  },
  {
    q: "What platforms is QuestHabit available on?",
    a: "QuestHabit is launching on iOS and Android simultaneously. Built with React Native for a native experience on both platforms. A web companion dashboard is on the roadmap.",
  },
  {
    q: "What happens if I break my streak?",
    a: "We've all been there. QuestHabit has a streak recovery system — complete a bonus challenge to restore part of your streak instead of starting from zero. Because real life happens, and one bad day shouldn't erase weeks of progress.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-4 bg-[var(--color-bg-secondary)]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] mb-4">
            <span className="text-xs text-[var(--color-text-secondary)]">
              FAQ
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Got <span className="gradient-text">Questions?</span>
          </h2>
          <p className="text-[var(--color-text-secondary)]">
            We&apos;ve got answers. If you don&apos;t see yours, reach out at
            hello@questhabit.com
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-semibold text-sm pr-4">{faq.q}</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-text-muted)"
                  strokeWidth="2"
                  className={`shrink-0 transition-transform duration-300 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5">
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
