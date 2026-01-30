/**
 * QuestHabit — Habit Template Library
 *
 * Curated starter templates so new users can begin tracking in 2 taps.
 * Organized by category, each template maps directly to CreateHabitInput.
 */

import { HabitCategory, HabitDifficulty, CreateHabitInput } from '../types';

export interface HabitTemplate {
  id: string;
  name: string;
  description: string;
  category: HabitCategory;
  difficulty: HabitDifficulty;
  icon: string;
  color: string;
  frequencyType: 'daily' | 'weekdays' | 'weekends';
  suggestedTime?: string; // HH:mm for reminder
  tags: string[];
  popular?: boolean;
}

export interface TemplateCollection {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  templates: HabitTemplate[];
}

// ─── INDIVIDUAL TEMPLATES ────────────────────────────────────────

const healthTemplates: HabitTemplate[] = [
  {
    id: 'h-water',
    name: 'Drink 8 Glasses of Water',
    description: 'Stay hydrated throughout the day',
    category: 'health',
    difficulty: 'easy',
    icon: '\u25C8',
    color: '#3B82F6',
    frequencyType: 'daily',
    suggestedTime: '08:00',
    tags: ['hydration', 'beginner'],
    popular: true,
  },
  {
    id: 'h-steps',
    name: '10,000 Steps',
    description: 'Walk at least 10,000 steps daily',
    category: 'health',
    difficulty: 'medium',
    icon: '\u2665',
    color: '#10B981',
    frequencyType: 'daily',
    suggestedTime: '18:00',
    tags: ['fitness', 'walking'],
    popular: true,
  },
  {
    id: 'h-workout',
    name: 'Exercise 30 Minutes',
    description: 'Any physical activity for at least 30 minutes',
    category: 'health',
    difficulty: 'medium',
    icon: '\u2605',
    color: '#EF4444',
    frequencyType: 'weekdays',
    suggestedTime: '07:00',
    tags: ['fitness', 'exercise'],
    popular: true,
  },
  {
    id: 'h-sleep',
    name: 'Sleep by 10:30 PM',
    description: 'Get to bed on time for quality rest',
    category: 'health',
    difficulty: 'medium',
    icon: '\u263D',
    color: '#8B5CF6',
    frequencyType: 'daily',
    suggestedTime: '22:00',
    tags: ['sleep', 'recovery'],
  },
  {
    id: 'h-stretch',
    name: 'Morning Stretch',
    description: '10 minutes of stretching after waking up',
    category: 'health',
    difficulty: 'easy',
    icon: '\u263C',
    color: '#F59E0B',
    frequencyType: 'daily',
    suggestedTime: '06:30',
    tags: ['flexibility', 'morning'],
  },
  {
    id: 'h-nosugar',
    name: 'No Added Sugar',
    description: 'Avoid foods and drinks with added sugar',
    category: 'health',
    difficulty: 'hard',
    icon: '\u2717',
    color: '#EF4444',
    frequencyType: 'daily',
    tags: ['diet', 'discipline'],
  },
  {
    id: 'h-vitamins',
    name: 'Take Vitamins',
    description: 'Take your daily supplements',
    category: 'health',
    difficulty: 'easy',
    icon: '\u25C6',
    color: '#10B981',
    frequencyType: 'daily',
    suggestedTime: '08:30',
    tags: ['supplements', 'beginner'],
  },
];

const productivityTemplates: HabitTemplate[] = [
  {
    id: 'p-deepwork',
    name: 'Deep Work Session',
    description: '90 minutes of focused, uninterrupted work',
    category: 'productivity',
    difficulty: 'hard',
    icon: '\u25C9',
    color: '#3B82F6',
    frequencyType: 'weekdays',
    suggestedTime: '09:00',
    tags: ['focus', 'work'],
    popular: true,
  },
  {
    id: 'p-plan',
    name: 'Plan Tomorrow',
    description: 'Write down top 3 priorities for the next day',
    category: 'productivity',
    difficulty: 'easy',
    icon: '\u25A0',
    color: '#06B6D4',
    frequencyType: 'weekdays',
    suggestedTime: '20:00',
    tags: ['planning', 'evening'],
    popular: true,
  },
  {
    id: 'p-inbox',
    name: 'Inbox Zero',
    description: 'Process all emails to zero unread',
    category: 'productivity',
    difficulty: 'medium',
    icon: '\u25A1',
    color: '#F97316',
    frequencyType: 'weekdays',
    suggestedTime: '10:00',
    tags: ['email', 'organization'],
  },
  {
    id: 'p-nophone',
    name: 'No Phone First Hour',
    description: 'Avoid checking your phone for 60 minutes after waking',
    category: 'productivity',
    difficulty: 'medium',
    icon: '\u2717',
    color: '#EF4444',
    frequencyType: 'daily',
    suggestedTime: '06:00',
    tags: ['digital-detox', 'morning'],
    popular: true,
  },
  {
    id: 'p-review',
    name: 'Weekly Review',
    description: 'Review goals, wins, and lessons from the week',
    category: 'productivity',
    difficulty: 'medium',
    icon: '\u2726',
    color: '#8B5CF6',
    frequencyType: 'weekends',
    suggestedTime: '10:00',
    tags: ['reflection', 'weekly'],
  },
  {
    id: 'p-single',
    name: 'Single-Task for 2 Hours',
    description: 'No multitasking — one thing at a time',
    category: 'productivity',
    difficulty: 'hard',
    icon: '\u25B2',
    color: '#3B82F6',
    frequencyType: 'weekdays',
    suggestedTime: '09:00',
    tags: ['focus', 'discipline'],
  },
];

const learningTemplates: HabitTemplate[] = [
  {
    id: 'l-read',
    name: 'Read 20 Pages',
    description: 'Read at least 20 pages of a book',
    category: 'learning',
    difficulty: 'medium',
    icon: '\u25A0',
    color: '#8B5CF6',
    frequencyType: 'daily',
    suggestedTime: '21:00',
    tags: ['reading', 'books'],
    popular: true,
  },
  {
    id: 'l-language',
    name: 'Language Practice',
    description: '15 minutes of language learning',
    category: 'learning',
    difficulty: 'easy',
    icon: '\u2666',
    color: '#10B981',
    frequencyType: 'daily',
    suggestedTime: '12:00',
    tags: ['language', 'duolingo'],
    popular: true,
  },
  {
    id: 'l-code',
    name: 'Code for 1 Hour',
    description: 'Practice coding or work on a side project',
    category: 'learning',
    difficulty: 'hard',
    icon: '\u25C9',
    color: '#06B6D4',
    frequencyType: 'weekdays',
    suggestedTime: '19:00',
    tags: ['programming', 'skills'],
  },
  {
    id: 'l-podcast',
    name: 'Listen to a Podcast',
    description: 'Learn something new from a podcast episode',
    category: 'learning',
    difficulty: 'easy',
    icon: '\u25CF',
    color: '#F97316',
    frequencyType: 'weekdays',
    suggestedTime: '08:00',
    tags: ['audio', 'commute'],
  },
  {
    id: 'l-write',
    name: 'Write 500 Words',
    description: 'Write anything — journal, blog post, fiction',
    category: 'learning',
    difficulty: 'medium',
    icon: '\u2726',
    color: '#EC4899',
    frequencyType: 'daily',
    suggestedTime: '07:00',
    tags: ['writing', 'creativity'],
  },
  {
    id: 'l-course',
    name: 'Online Course Lesson',
    description: 'Complete one lesson from an online course',
    category: 'learning',
    difficulty: 'medium',
    icon: '\u25B2',
    color: '#3B82F6',
    frequencyType: 'weekdays',
    suggestedTime: '20:00',
    tags: ['education', 'skills'],
  },
];

const wellnessTemplates: HabitTemplate[] = [
  {
    id: 'w-meditate',
    name: 'Meditate 10 Minutes',
    description: 'Sit quietly and focus on your breath',
    category: 'wellness',
    difficulty: 'easy',
    icon: '\u25C8',
    color: '#EC4899',
    frequencyType: 'daily',
    suggestedTime: '06:30',
    tags: ['mindfulness', 'calm'],
    popular: true,
  },
  {
    id: 'w-journal',
    name: 'Gratitude Journal',
    description: 'Write 3 things you are grateful for',
    category: 'wellness',
    difficulty: 'easy',
    icon: '\u2726',
    color: '#F59E0B',
    frequencyType: 'daily',
    suggestedTime: '21:30',
    tags: ['gratitude', 'journaling'],
    popular: true,
  },
  {
    id: 'w-breath',
    name: 'Breathing Exercise',
    description: '5 minutes of deep breathing (box breathing)',
    category: 'wellness',
    difficulty: 'easy',
    icon: '\u25CB',
    color: '#06B6D4',
    frequencyType: 'daily',
    suggestedTime: '12:00',
    tags: ['breathing', 'stress'],
  },
  {
    id: 'w-nature',
    name: 'Time in Nature',
    description: 'Spend at least 20 minutes outdoors',
    category: 'wellness',
    difficulty: 'medium',
    icon: '\u263C',
    color: '#10B981',
    frequencyType: 'daily',
    suggestedTime: '17:00',
    tags: ['outdoors', 'fresh-air'],
  },
  {
    id: 'w-screen',
    name: 'Screen-Free Evening',
    description: 'No screens after 9 PM',
    category: 'wellness',
    difficulty: 'hard',
    icon: '\u263D',
    color: '#8B5CF6',
    frequencyType: 'daily',
    suggestedTime: '20:45',
    tags: ['digital-detox', 'sleep'],
  },
  {
    id: 'w-social',
    name: 'Connect with Someone',
    description: 'Call, text, or meet a friend or family member',
    category: 'wellness',
    difficulty: 'easy',
    icon: '\u2665',
    color: '#EC4899',
    frequencyType: 'daily',
    suggestedTime: '18:00',
    tags: ['social', 'relationships'],
  },
];

// ─── ALL TEMPLATES ───────────────────────────────────────────────

export const ALL_TEMPLATES: HabitTemplate[] = [
  ...healthTemplates,
  ...productivityTemplates,
  ...learningTemplates,
  ...wellnessTemplates,
];

export const POPULAR_TEMPLATES = ALL_TEMPLATES.filter(t => t.popular);

// ─── TEMPLATE COLLECTIONS ────────────────────────────────────────

export const TEMPLATE_COLLECTIONS: TemplateCollection[] = [
  {
    id: 'popular',
    title: 'Popular',
    subtitle: 'Most-used templates to get started fast',
    icon: '\u2605',
    color: '#F59E0B',
    templates: POPULAR_TEMPLATES,
  },
  {
    id: 'health',
    title: 'Health & Fitness',
    subtitle: 'Physical health, exercise, nutrition',
    icon: '\u2665',
    color: '#10B981',
    templates: healthTemplates,
  },
  {
    id: 'productivity',
    title: 'Productivity',
    subtitle: 'Focus, planning, organization',
    icon: '\u25C9',
    color: '#3B82F6',
    templates: productivityTemplates,
  },
  {
    id: 'learning',
    title: 'Learning & Growth',
    subtitle: 'Reading, skills, education',
    icon: '\u25A0',
    color: '#8B5CF6',
    templates: learningTemplates,
  },
  {
    id: 'wellness',
    title: 'Wellness & Mindfulness',
    subtitle: 'Mental health, calm, connection',
    icon: '\u25C8',
    color: '#EC4899',
    templates: wellnessTemplates,
  },
];

// ─── HELPER ──────────────────────────────────────────────────────

/** Convert a HabitTemplate into a CreateHabitInput ready for the store. */
export function templateToInput(template: HabitTemplate): CreateHabitInput {
  return {
    name: template.name,
    description: template.description,
    category: template.category,
    frequency: { type: template.frequencyType },
    difficulty: template.difficulty,
    icon: template.icon,
    color: template.color,
    reminderTime: template.suggestedTime,
  };
}
