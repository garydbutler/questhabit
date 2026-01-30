import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuthStore } from '../../stores/authStore';
import { useHabitStore } from '../../stores/habitStore';
import { Card } from '../ui/Card';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AICoachProps {
  visible: boolean;
  onClose: () => void;
}

const QUICK_PROMPTS = [
  { emoji: '💡', text: 'How can I improve my habits?' },
  { emoji: '🔥', text: 'Help me stay motivated' },
  { emoji: '📊', text: 'Analyze my progress' },
  { emoji: '🎯', text: 'Suggest a new habit' },
];

const SYSTEM_PROMPT = `You are QuestHabit's AI Coach — a supportive, gamification-savvy habit coach. You help users build better habits by:
- Analyzing their habit data and streaks
- Providing motivational and practical advice
- Suggesting new habits based on their goals
- Celebrating their wins (streaks, achievements, XP milestones)
- Using RPG/gaming metaphors (quests, leveling up, boss battles)
- Keeping responses concise (2-3 paragraphs max)
- Being warm but direct — actionable advice over platitudes

You have access to the user's habit data provided in context. Reference specific habits, streaks, and achievements when relevant.`;

export function AICoach({ visible, onClose }: AICoachProps) {
  const { user } = useAuthStore();
  const { habits } = useHabitStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (visible && messages.length === 0) {
      // Welcome message
      const welcomeMessage = getWelcomeMessage();
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: welcomeMessage,
          timestamp: new Date(),
        },
      ]);
    }
  }, [visible]);

  const getWelcomeMessage = (): string => {
    const activeHabits = habits.filter(h => !h.isArchived);
    const completedToday = activeHabits.filter(h => h.completedToday).length;
    const totalXP = user?.totalXp || 0;
    const level = user?.level || 1;

    if (activeHabits.length === 0) {
      return "Hey there, hero! 🦸 I'm your AI Coach. Looks like you haven't created any habits yet — that's totally fine! Everyone starts somewhere. Want me to suggest some beginner-friendly habits to kick off your journey?";
    }

    const bestStreak = Math.max(...activeHabits.map(h => h.streak?.currentStreak || 0));

    if (completedToday === activeHabits.length && activeHabits.length > 0) {
      return `Perfect day! 🎉 You've completed all ${activeHabits.length} habits today. You're Level ${level} with ${totalXP} XP — the grind is paying off! What would you like to talk about?`;
    }

    if (bestStreak >= 7) {
      return `Welcome back, Level ${level} hero! 🔥 I see you've got a ${bestStreak}-day streak going — that's serious dedication. You've done ${completedToday}/${activeHabits.length} habits today. How can I help you keep the momentum?`;
    }

    return `Hey there, Level ${level}! 👋 You've got ${activeHabits.length} active habits and ${completedToday} done today. ${totalXP} XP earned so far — let's keep leveling up! What's on your mind?`;
  };

  const buildContext = () => {
    const activeHabits = habits.filter(h => !h.isArchived);
    return {
      level: user?.level || 1,
      totalXP: user?.totalXp || 0,
      habitCount: activeHabits.length,
      habits: activeHabits.map(h => ({
        name: h.name,
        category: h.category,
        difficulty: h.difficulty,
        streak: h.streak?.currentStreak || 0,
        bestStreak: h.streak?.bestStreak || 0,
        completedToday: h.completedToday,
      })),
      completedToday: activeHabits.filter(h => h.completedToday).length,
    };
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const context = buildContext();
      
      // Call the AI coaching edge function
      // For now, use a local response generator
      // In production: call Supabase Edge Function or OpenAI directly
      const response = await generateCoachResponse(text.trim(), context, messages);
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "Oops! I hit a snag. Try again in a moment — even heroes face temporary setbacks! 🛡️",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }

    // Scroll to bottom
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  if (!visible) return null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.coachEmoji}>🤖</Text>
          <View>
            <Text style={styles.coachName}>AI Coach</Text>
            <Text style={styles.coachStatus}>
              {isLoading ? 'Thinking...' : 'Online'}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.role === 'user' ? styles.userBubble : styles.assistantBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                msg.role === 'user' ? styles.userText : styles.assistantText,
              ]}
            >
              {msg.content}
            </Text>
          </View>
        ))}

        {isLoading && (
          <View style={[styles.messageBubble, styles.assistantBubble]}>
            <ActivityIndicator size="small" color="#6366F1" />
          </View>
        )}
      </ScrollView>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickPrompts}
          contentContainerStyle={styles.quickPromptsContent}
        >
          {QUICK_PROMPTS.map((prompt, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickPromptButton}
              onPress={() => handleQuickPrompt(prompt.text)}
            >
              <Text style={styles.quickPromptEmoji}>{prompt.emoji}</Text>
              <Text style={styles.quickPromptText}>{prompt.text}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask your coach..."
          placeholderTextColor="#6B6B6B"
          multiline
          maxLength={500}
          onSubmitEditing={() => sendMessage(input)}
          blurOnSubmit
        />
        <TouchableOpacity
          style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
          onPress={() => sendMessage(input)}
          disabled={!input.trim() || isLoading}
        >
          <Text style={styles.sendText}>→</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// Local response generator (swap for API call in production)
async function generateCoachResponse(
  userMessage: string,
  context: any,
  history: Message[]
): Promise<string> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const msg = userMessage.toLowerCase();
  const { habits, completedToday, habitCount, level, totalXP } = context;
  const activeStreaks = habits.filter((h: any) => h.streak > 0);
  const bestStreak = habits.reduce((max: number, h: any) => Math.max(max, h.streak), 0);

  // Analyze progress
  if (msg.includes('progress') || msg.includes('analyze') || msg.includes('how am i doing')) {
    if (habitCount === 0) {
      return "You haven't started any quests yet! That's like standing at the entrance of the dungeon — exciting things are ahead. Start with ONE habit. Just one. Make it easy, make it daily. That's your first quest. 🗡️";
    }
    const completionRate = habitCount > 0 ? Math.round((completedToday / habitCount) * 100) : 0;
    return `📊 **Progress Report:**\n\n` +
      `• Level ${level} | ${totalXP} XP earned\n` +
      `• ${habitCount} active habits | ${completedToday} done today (${completionRate}%)\n` +
      `• Best active streak: ${bestStreak} days\n\n` +
      (completionRate === 100 ? "You're crushing it today! Perfect completion rate. That's legendary status. 🏆" :
       completionRate >= 50 ? "Solid progress! You're past the halfway point today. Every habit completed is XP earned. Push for that perfect day! ⚔️" :
       "Still some quests left to complete today. Remember: showing up is half the battle. Even completing one more habit keeps the momentum going. 💪");
  }

  // Motivation
  if (msg.includes('motivat') || msg.includes('struggling') || msg.includes('hard') || msg.includes('give up')) {
    if (bestStreak > 0) {
      return `I hear you — every hero faces tough days. But look at what you've already built: a ${bestStreak}-day streak! That's not luck, that's character.\n\nHere's what I want you to do: pick your EASIEST habit right now. Just one. Complete it. That small win triggers a cascade. You didn't come this far to only come this far. 🔥\n\nRemember: Level ${level} heroes don't quit. They adapt.`;
    }
    return "Hey, feeling stuck is part of the journey — it's the boss battle before the level-up. Here's the secret: you don't need motivation. You need a system so easy you can't say no.\n\nTry the 2-minute rule: make your habit so small it takes less than 2 minutes. Want to exercise? Put on your shoes. Want to read? Open the book. That's it. The rest follows. 🎯\n\nYou've got this. I believe in you.";
  }

  // New habit suggestion
  if (msg.includes('suggest') || msg.includes('new habit') || msg.includes('recommend') || msg.includes('what should')) {
    const existingCategories = new Set(habits.map((h: any) => h.category));
    const suggestions = [];
    
    if (!existingCategories.has('health')) {
      suggestions.push("💧 **Drink Water** (Easy) — Start with 8 glasses a day. Your body is a temple... that runs on water.");
    }
    if (!existingCategories.has('learning')) {
      suggestions.push("📚 **Read 10 Pages** (Medium) — Knowledge is the ultimate power-up. 10 pages a day = 12 books a year.");
    }
    if (!existingCategories.has('wellness')) {
      suggestions.push("🧘 **5-Min Meditation** (Easy) — Mental armor. Even 5 minutes of stillness makes you sharper.");
    }
    if (!existingCategories.has('productivity')) {
      suggestions.push("📝 **Plan Tomorrow Tonight** (Easy) — 5 minutes of planning saves 60 minutes of chaos.");
    }
    
    if (suggestions.length === 0) {
      suggestions.push(
        "🏃 **Walk 10 Minutes** — Low barrier, huge compound effect",
        "✍️ **Journal 3 Things** — Gratitude or reflection, your call",
        "🧹 **Tidy 5 Minutes** — Clean space = clear mind"
      );
    }

    return `Here are some quests I'd recommend for your journey:\n\n${suggestions.slice(0, 3).join('\n\n')}\n\nStart with one that excites you. Remember: easy wins build momentum! Which one speaks to you?`;
  }

  // Streaks
  if (msg.includes('streak') || msg.includes('consistent')) {
    if (activeStreaks.length === 0) {
      return "No active streaks yet — and that's totally okay! A streak starts with Day 1, and Day 1 starts with doing the thing RIGHT NOW.\n\nPro tip: Set a specific time for your habits. \"I'll meditate after my morning coffee\" works way better than \"I'll meditate sometime today.\" Tie new habits to existing routines. 🔗";
    }
    const topStreak = habits.reduce((best: any, h: any) => h.streak > (best?.streak || 0) ? h : best, null);
    return `🔥 **Streak Report:**\n\n${activeStreaks.map((h: any) => `• ${h.name}: ${h.streak} days (best: ${h.bestStreak})`).join('\n')}\n\n${topStreak ? `Your strongest quest is "${topStreak.name}" — protect that streak like a dragon guards its gold! 🐉` : ''}\n\nTip: Complete your highest-streak habit FIRST each day. That way, even on bad days, you protect what matters most.`;
  }

  // Default intelligent response
  return `Great question! As your Level ${level} coach, here's my take:\n\n` +
    `You're doing well with ${habitCount} active habits and ${totalXP} XP. The key to sustainable growth is consistency over intensity.\n\n` +
    `Focus on showing up every day, even if it's a \"minimum viable effort\" day. A 1-minute meditation still counts. A single pushup still counts. What matters is keeping the chain unbroken. ⛓️\n\n` +
    `What specific aspect of your habit journey would you like to explore?`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  coachEmoji: {
    fontSize: 32,
  },
  coachName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  coachStatus: {
    fontSize: 12,
    color: '#22C55E',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#A1A1A1',
    fontSize: 18,
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 14,
    borderRadius: 18,
    marginBottom: 12,
  },
  userBubble: {
    backgroundColor: '#6366F1',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#1A1A1A',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  assistantText: {
    color: '#E0E0E0',
  },
  quickPrompts: {
    maxHeight: 56,
    borderTopWidth: 1,
    borderTopColor: '#1A1A1A',
  },
  quickPromptsContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  quickPromptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#252525',
    gap: 6,
  },
  quickPromptEmoji: {
    fontSize: 14,
  },
  quickPromptText: {
    color: '#A1A1A1',
    fontSize: 13,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#1A1A1A',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
});
