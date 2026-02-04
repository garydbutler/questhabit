/**
 * QuestHabit Design System
 * 
 * Inspired by: Gentler Streak (Apple Design Award), Streaks, premium fintech apps
 * Philosophy: Depth through layered surfaces, restrained color, intentional spacing
 */

// ─── COLOR PALETTE ──────────────────────────────────────────────
export const Colors = {
  // Backgrounds — layered depth, warm dark tones
  bg: {
    primary: '#0B0F1A',     // Deepest — screen background
    elevated: '#111827',     // Cards, surfaces
    subtle: '#1A2332',       // Slightly lifted elements
    overlay: '#1F2D3D',      // Modals, popovers
    input: '#162031',        // Input fields
  },

  // Borders — barely-there dividers
  border: {
    primary: '#1E2A3A',      // Default card borders
    subtle: '#152030',       // Very faint separators
    focused: '#3B5998',      // Active/focused state
    divider: '#1A2536',      // Section dividers
  },

  // Text hierarchy — 4-level system
  text: {
    primary: '#F1F5F9',      // Headings, important content
    secondary: '#CBD5E1',    // Body text
    tertiary: '#64748B',     // Labels, captions
    muted: '#475569',        // Disabled, placeholders
    inverse: '#0B0F1A',      // Text on light backgrounds
  },

  // Accent — teal/cyan primary (NOT generic purple/indigo)
  accent: {
    primary: '#06B6D4',      // Primary actions, active states
    secondary: '#0891B2',    // Hover/pressed states
    muted: '#164E63',        // Subtle tinted backgrounds
    ghost: 'rgba(6, 182, 212, 0.08)', // Very subtle accent bg
    glow: 'rgba(6, 182, 212, 0.25)',  // Glow/shadow color
  },

  // Semantic — purposeful colors
  semantic: {
    success: '#10B981',      // Completed, positive
    successMuted: 'rgba(16, 185, 129, 0.12)',
    warning: '#F59E0B',      // Caution, attention
    warningMuted: 'rgba(245, 158, 11, 0.12)',
    error: '#EF4444',        // Destructive, errors
    errorMuted: 'rgba(239, 68, 68, 0.10)',
    info: '#3B82F6',         // Informational
    infoMuted: 'rgba(59, 130, 246, 0.12)',
  },

  // XP & Gamification — warm gold tones
  xp: {
    primary: '#F59E0B',      // XP text, badges
    light: '#FBBF24',        // Highlights
    muted: 'rgba(245, 158, 11, 0.12)', // Badge backgrounds
    glow: 'rgba(245, 158, 11, 0.20)',
  },

  // Streak — warm fire tones
  streak: {
    primary: '#F97316',      // Active streak
    hot: '#EF4444',          // Long streaks
    muted: 'rgba(249, 115, 22, 0.12)',
  },

  // Category colors — intentional, harmonious palette
  category: {
    health: '#10B981',       // Emerald
    productivity: '#3B82F6', // Blue
    learning: '#8B5CF6',     // Purple
    wellness: '#EC4899',     // Pink
    custom: '#06B6D4',       // Cyan (matches accent)
  },

  // Category muted backgrounds
  categoryMuted: {
    health: 'rgba(16, 185, 129, 0.10)',
    productivity: 'rgba(59, 130, 246, 0.10)',
    learning: 'rgba(139, 92, 246, 0.10)',
    wellness: 'rgba(236, 72, 153, 0.10)',
    custom: 'rgba(6, 182, 212, 0.10)',
  },

  // Pro/Premium — warm amber gold
  pro: {
    primary: '#F59E0B',
    secondary: '#D97706',
    glow: 'rgba(245, 158, 11, 0.25)',
    bg: 'rgba(245, 158, 11, 0.06)',
    border: 'rgba(245, 158, 11, 0.20)',
  },

  // Utility
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;


// ─── TYPOGRAPHY ─────────────────────────────────────────────────
export const Typography = {
  display: {
    fontSize: 40,
    fontWeight: '800' as const,
    letterSpacing: -1.5,
    lineHeight: 48,
  },
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.8,
    lineHeight: 34,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500' as const,
    letterSpacing: 0,
    lineHeight: 24,
  },
  bodySemibold: {
    fontSize: 16,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 24,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
    letterSpacing: 0.1,
    lineHeight: 18,
  },
  captionMedium: {
    fontSize: 13,
    fontWeight: '500' as const,
    letterSpacing: 0.1,
    lineHeight: 18,
  },
  label: {
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    lineHeight: 14,
    textTransform: 'uppercase' as const,
  },
  stat: {
    fontSize: 32,
    fontWeight: '700' as const,
    letterSpacing: -1,
    lineHeight: 38,
  },
} as const;


// ─── SPACING ────────────────────────────────────────────────────
export const Spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
} as const;


// ─── BORDER RADIUS ──────────────────────────────────────────────
export const Radius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
} as const;


// ─── SHADOWS / ELEVATION ────────────────────────────────────────
export const Shadows = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.20,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.30,
    shadowRadius: 12,
    elevation: 6,
  }),
  accentGlow: {
    shadowColor: Colors.accent.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  goldGlow: {
    shadowColor: Colors.xp.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;


// ─── GRADIENTS (for use with expo-linear-gradient) ──────────────
export const Gradients = {
  // Subtle card backgrounds
  cardSurface: {
    colors: ['#111827', '#0F172A'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Hero/header sections
  heroHeader: {
    colors: ['#0B0F1A', '#111827', '#0F172A'],
    start: { x: 0, y: 0 },
    end: { x: 0.5, y: 1 },
  },
  // Accent button
  accentButton: {
    colors: ['#06B6D4', '#0891B2'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Pro/gold
  proGold: {
    colors: ['#F59E0B', '#D97706'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Glass card — subtle shimmer
  glass: {
    colors: ['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.01)'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Success
  success: {
    colors: ['#10B981', '#059669'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Tab bar glass
  tabBar: {
    colors: ['rgba(11, 15, 26, 0.92)', 'rgba(11, 15, 26, 0.98)'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
} as const;


// ─── ICON MAP — Unicode-based, no emoji ─────────────────────────
// These replace emoji throughout the app for a premium feel
export const Icons = {
  // Navigation
  today: '\u25C9',         // ◉ — filled circle
  coach: '\u2666',         // ♦ — diamond
  stats: '\u2630',         // ☰ — trigram
  profile: '\u2B22',       // ⬢ — hexagon
  settings: '\u2699',      // ⚙ — gear (text, not emoji)
  
  // Actions
  add: '\u002B',           // + — plus
  check: '\u2713',         // ✓ — checkmark
  cross: '\u2717',         // ✗ — cross
  chevronRight: '\u203A',  // › — right angle
  close: '\u00D7',         // × — multiply
  back: '\u2039',          // ‹ — left angle
  
  // Gamification
  xp: '\u2726',            // ✦ — four-pointed star
  streak: '\u2B22',        // ⬢ — hexagon for streak
  level: '\u25C6',         // ◆ — diamond filled
  trophy: '\u2605',        // ★ — filled star
  crown: '\u2666',         // ♦ — diamond
  shield: '\u25B2',        // ▲ — triangle/shield
  
  // Categories
  health: '\u2665',        // ♥ — heart
  productivity: '\u25C9',  // ◉ — target/bullseye
  learning: '\u25A0',      // ■ — book/square
  wellness: '\u25C8',      // ◈ — peace/diamond in square
  custom: '\u2726',        // ✦ — star
  
  // Status
  fire: '\u2B22',          // ⬢ — hex for streak
  lock: '\u25A0',          // ■ — locked
  unlock: '\u25A1',        // □ — unlocked
  info: '\u24D8',          // ⓘ — info
  
  // Misc
  sparkle: '\u2726',       // ✦ 
  arrow: '\u2192',         // → — right arrow
  dot: '\u2022',           // • — bullet
  ring: '\u25CB',          // ○ — ring
} as const;

// Quest tier icon map
export const QuestTierIcons: Record<string, { symbol: string; color: string; bgColor: string }> = {
  daily:     { symbol: '\u25C9', color: '#06B6D4', bgColor: 'rgba(6, 182, 212, 0.10)' },     // ◉
  weekly:    { symbol: '\u2605', color: '#8B5CF6', bgColor: 'rgba(139, 92, 246, 0.10)' },    // ★
  legendary: { symbol: '\u2666', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.08)' },    // ♦
};

// Achievement icon map — replacing emoji
export const AchievementIcons: Record<string, { symbol: string; color: string }> = {
  first_step:        { symbol: '\u25B6', color: '#06B6D4' },  // ▶
  week_warrior:      { symbol: '\u2B22', color: '#F97316' },  // ⬢
  fortnight_fighter: { symbol: '\u2694', color: '#EF4444' },  // ⚔ (text)
  monthly_master:    { symbol: '\u2666', color: '#F59E0B' },  // ♦
  early_bird:        { symbol: '\u263C', color: '#FBBF24' },  // ☼
  night_owl:         { symbol: '\u263D', color: '#8B5CF6' },  // ☽
  perfect_day:       { symbol: '\u2726', color: '#10B981' },  // ✦
  perfect_week:      { symbol: '\u2605', color: '#F59E0B' },  // ★
  habit_collector:   { symbol: '\u2B22', color: '#3B82F6' },  // ⬢
  level_5:           { symbol: '\u25C6', color: '#8B5CF6' },  // ◆
  level_10:          { symbol: '\u2605', color: '#F59E0B' },  // ★
};

// Category icon map
export const CategoryIcons: Record<string, { symbol: string; color: string }> = {
  health:       { symbol: '\u2665', color: Colors.category.health },       // ♥
  productivity: { symbol: '\u25C9', color: Colors.category.productivity }, // ◉
  learning:     { symbol: '\u25A0', color: Colors.category.learning },     // ■
  wellness:     { symbol: '\u25C8', color: Colors.category.wellness },     // ◈
  custom:       { symbol: '\u2726', color: Colors.category.custom },       // ✦
};
