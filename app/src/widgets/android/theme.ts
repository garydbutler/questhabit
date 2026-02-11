/**
 * QuestHabit Android Widget Theme
 * Matches the app's dark premium design language
 */

export const WidgetTheme = {
  // Background colors
  bg: {
    primary: '#0F0F0F',
    secondary: '#1A1A1A',
    tertiary: '#252525',
  },

  // Accent colors
  accent: {
    primary: '#6366F1',    // Indigo
    success: '#22C55E',    // Green
    warning: '#F59E0B',    // Amber
    danger: '#EF4444',     // Red
    xp: '#FBBF24',         // Gold
  },

  // Text colors
  text: {
    primary: '#FFFFFF',
    secondary: '#A1A1A1',
    tertiary: '#6B6B6B',
  },

  // Level tier colors
  levelTiers: {
    bronze: '#CD7F32',     // 1-3
    silver: '#C0C0C0',     // 4-6
    gold: '#FFD700',       // 7-9
    diamond: '#B9F2FF',    // 10+
  },

  // Border radius
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
  },
};

/**
 * Get level tier color based on level
 */
export function getLevelTierColor(level: number): string {
  if (level >= 10) return WidgetTheme.levelTiers.diamond;
  if (level >= 7) return WidgetTheme.levelTiers.gold;
  if (level >= 4) return WidgetTheme.levelTiers.silver;
  return WidgetTheme.levelTiers.bronze;
}

/**
 * Get level tier name based on level
 */
export function getLevelTierName(level: number): string {
  if (level >= 10) return 'Diamond';
  if (level >= 7) return 'Gold';
  if (level >= 4) return 'Silver';
  return 'Bronze';
}

/**
 * Get motivational message based on progress
 */
export function getMotivationalMessage(progress: number): string {
  if (progress >= 1) return 'Perfect day!';
  if (progress >= 0.8) return 'Almost there!';
  if (progress >= 0.5) return 'Keep it up!';
  if (progress > 0) return 'Good start!';
  return 'Start your quests!';
}

/**
 * Get progress color based on completion rate
 */
export function getProgressColor(progress: number): string {
  if (progress >= 1) return WidgetTheme.accent.success;
  if (progress >= 0.5) return WidgetTheme.accent.primary;
  return WidgetTheme.text.secondary;
}
