/**
 * Data Export utilities for QuestHabit
 * Supports JSON and CSV export of habit data
 * 
 * Uses expo-file-system SDK 54+ class-based API
 */
import { Paths, File } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import { HabitWithStreak, Completion } from '../types';

export interface ExportData {
  exportedAt: string;
  version: string;
  user: {
    level: number;
    totalXp: number;
    memberSince: string;
  };
  habits: Array<{
    name: string;
    description: string | undefined;
    category: string;
    difficulty: string;
    frequency: string;
    currentStreak: number;
    bestStreak: number;
    createdAt: string;
  }>;
  completions: Array<{
    habitName: string;
    completedDate: string;
    xpEarned: number;
  }>;
  stats: {
    totalHabits: number;
    activeHabits: number;
    totalCompletions: number;
    bestStreak: number;
    totalXp: number;
  };
}

/**
 * Build export data from current state
 */
export function buildExportData(
  habits: HabitWithStreak[],
  completions: Completion[],
  user: { level: number; totalXp: number; createdAt: string }
): ExportData {
  const activeHabits = habits.filter(h => !h.isArchived);
  const bestStreak = Math.max(...habits.map(h => h.streak?.bestStreak || 0), 0);

  // Build a habit name lookup
  const habitNameMap = new Map<string, string>();
  habits.forEach(h => habitNameMap.set(h.id, h.name));

  return {
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
    user: {
      level: user.level,
      totalXp: user.totalXp,
      memberSince: user.createdAt,
    },
    habits: habits.map(h => ({
      name: h.name,
      description: h.description,
      category: h.category,
      difficulty: h.difficulty,
      frequency: h.frequency.type,
      currentStreak: h.streak?.currentStreak || 0,
      bestStreak: h.streak?.bestStreak || 0,
      createdAt: h.createdAt,
    })),
    completions: completions.map(c => ({
      habitName: habitNameMap.get(c.habitId) || 'Unknown',
      completedDate: c.completedDate,
      xpEarned: c.xpEarned,
    })),
    stats: {
      totalHabits: habits.length,
      activeHabits: activeHabits.length,
      totalCompletions: completions.length,
      bestStreak,
      totalXp: user.totalXp,
    },
  };
}

/**
 * Convert export data to CSV format
 */
export function exportToCSV(data: ExportData): string {
  const lines: string[] = [];

  // Habits section
  lines.push('=== HABITS ===');
  lines.push('Name,Category,Difficulty,Frequency,Current Streak,Best Streak,Created');
  data.habits.forEach(h => {
    lines.push(
      [
        csvEscape(h.name),
        h.category,
        h.difficulty,
        h.frequency,
        h.currentStreak,
        h.bestStreak,
        h.createdAt,
      ].join(',')
    );
  });

  lines.push('');
  lines.push('=== COMPLETIONS ===');
  lines.push('Habit,Date,XP Earned');
  data.completions.forEach(c => {
    lines.push(
      [csvEscape(c.habitName), c.completedDate, c.xpEarned].join(',')
    );
  });

  lines.push('');
  lines.push('=== STATS ===');
  lines.push(`Total Habits,${data.stats.totalHabits}`);
  lines.push(`Active Habits,${data.stats.activeHabits}`);
  lines.push(`Total Completions,${data.stats.totalCompletions}`);
  lines.push(`Best Streak,${data.stats.bestStreak}`);
  lines.push(`Total XP,${data.stats.totalXp}`);
  lines.push(`Exported At,${data.exportedAt}`);

  return lines.join('\n');
}

/**
 * Escape a value for CSV
 */
function csvEscape(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Export data as JSON file and share
 */
export async function exportAsJSON(data: ExportData): Promise<boolean> {
  try {
    const json = JSON.stringify(data, null, 2);
    const filename = `questhabit-export-${formatDateForFile(new Date())}.json`;
    const file = new File(Paths.cache, filename);
    file.write(json);

    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('Export saved locally', `File saved to: ${filename}`);
      return true;
    }

    await Sharing.shareAsync(file.uri, {
      mimeType: 'application/json',
      dialogTitle: 'Export QuestHabit Data',
    });

    return true;
  } catch (error) {
    console.error('JSON export failed:', error);
    Alert.alert('Export Failed', 'Could not export your data. Please try again.');
    return false;
  }
}

/**
 * Export data as CSV file and share
 */
export async function exportAsCSV(data: ExportData): Promise<boolean> {
  try {
    const csv = exportToCSV(data);
    const filename = `questhabit-export-${formatDateForFile(new Date())}.csv`;
    const file = new File(Paths.cache, filename);
    file.write(csv);

    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('Export saved locally', `File saved to: ${filename}`);
      return true;
    }

    await Sharing.shareAsync(file.uri, {
      mimeType: 'text/csv',
      dialogTitle: 'Export QuestHabit Data',
    });

    return true;
  } catch (error) {
    console.error('CSV export failed:', error);
    Alert.alert('Export Failed', 'Could not export your data. Please try again.');
    return false;
  }
}

function formatDateForFile(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
