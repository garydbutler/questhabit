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
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../stores/authStore';
import { useHabitStore } from '../../stores/habitStore';
import { IconBadge } from '../ui/IconBadge';
import { GradientButton } from '../ui/GradientButton';
import { Colors, Typography, Spacing, Radius, Icons } from '../../constants/design';
import { supabase } from '../../lib/supabase';

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
  { symbol: '\u25C6', text: 'How can I improve my habits?', color: Colors.accent.primary },
  { symbol: '\u2665', text: 'Help me stay motivated', color: Colors.streak.primary },
  { symbol: '\u2630', text: 'Analyze my progress', color: Colors.semantic.info },
  { symbol: '\u2726', text: 'Suggest a new habit', color: Colors.semantic.success },
];

export function AICoach({ visible, onClose }: AICoachProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { habits } = useHabitStore();
  const isPro = user?.isPro ?? false;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (visible && messages.length === 0) {
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

    // Show upgrade prompt for non-Pro users
    if (!isPro) {
      return "Hey there, hero! I'm your AI Coach. I can provide personalized guidance, analyze your habits, and help you level up faster.\n\nUpgrade to Pro to unlock real-time AI coaching powered by GPT-4. I'll remember our conversations and give you advice tailored to YOUR journey.";
    }

    if (activeHabits.length === 0) {
      return "Hey there, hero! I'm your AI Coach, powered by real AI. Looks like you haven't created any habits yet — that's totally fine! Everyone starts somewhere. Want me to suggest some beginner-friendly habits to kick off your journey?";
    }

    const bestStreak = Math.max(...activeHabits.map(h => h.streak?.currentStreak || 0));

    if (completedToday === activeHabits.length && activeHabits.length > 0) {
      return `Perfect day! You've completed all ${activeHabits.length} habits today. You're Level ${level} with ${totalXP} XP — the grind is paying off! What would you like to talk about?`;
    }

    if (bestStreak >= 7) {
      return `Welcome back, Level ${level} hero! I see you've got a ${bestStreak}-day streak going — that's serious dedication. You've done ${completedToday}/${activeHabits.length} habits today. How can I help you keep the momentum?`;
    }

    return `Hey there, Level ${level}! You've got ${activeHabits.length} active habits and ${completedToday} done today. ${totalXP} XP earned so far — let's keep leveling up! What's on your mind?`;
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
      // Check Pro status before making API call
      if (!isPro) {
        const upgradeMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: "To get personalized AI responses, you'll need to upgrade to Pro. With Pro, I can analyze your specific habits, remember our conversations, and give you tailored advice based on your actual progress.\n\nWant to see what Pro unlocks?",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, upgradeMessage]);
        return;
      }

      const context = buildContext();
      const historyForApi = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role, content: m.content }));

      // Call the real AI coach edge function
      const { data, error } = await supabase.functions.invoke('ai-coach', {
        body: {
          message: text.trim(),
          userId: user?.id,
          context,
          history: historyForApi,
        },
      });

      if (error) {
        console.error('AI Coach API error:', error);
        throw new Error(error.message || 'Failed to get AI response');
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response || "Hmm, I had trouble processing that. Try again?",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('AI Coach error:', error);
      
      // Check if it's a subscription error
      if (error.message?.includes('Pro subscription required')) {
        const upgradeMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: "Looks like your Pro subscription needs attention. Check your subscription settings to keep the AI coaching flowing!",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, upgradeMessage]);
      } else {
        // Generic error fallback
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: "Oops! I hit a snag. Try again in a moment — even heroes face temporary setbacks!",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
    }

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  const handleUpgrade = () => {
    router.push('/pro');
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
          <IconBadge symbol={Icons.coach} color={Colors.accent.primary} size="lg" />
          <View>
            <Text style={styles.coachName}>AI Coach</Text>
            <View style={styles.statusRow}>
              {isPro ? (
                <>
                  <View style={[styles.statusDot, { backgroundColor: isLoading ? Colors.xp.primary : Colors.semantic.success }]} />
                  <Text style={styles.coachStatus}>
                    {isLoading ? 'Thinking...' : 'GPT-4 Powered'}
                  </Text>
                </>
              ) : (
                <>
                  <View style={[styles.statusDot, { backgroundColor: Colors.semantic.warning }]} />
                  <Text style={[styles.coachStatus, { color: Colors.semantic.warning }]}>
                    Pro Required
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>{Icons.close}</Text>
        </TouchableOpacity>
      </View>

      {/* Pro Upsell Banner (for non-Pro users) */}
      {!isPro && (
        <View style={styles.upsellBanner}>
          <View style={styles.upsellContent}>
            <Text style={styles.upsellTitle}>Unlock Real AI Coaching</Text>
            <Text style={styles.upsellText}>
              Get personalized advice powered by GPT-4. Analyze your habits, get motivation tips, and level up faster.
            </Text>
          </View>
          <GradientButton
            title="Go Pro"
            onPress={handleUpgrade}
            size="sm"
            style={styles.upsellButton}
          />
        </View>
      )}

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
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Colors.accent.primary} />
              <Text style={styles.loadingText}>Analyzing your journey...</Text>
            </View>
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
              activeOpacity={0.7}
            >
              <Text style={[styles.quickPromptSymbol, { color: prompt.color }]}>{prompt.symbol}</Text>
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
          placeholder={isPro ? "Ask your coach..." : "Upgrade to Pro to chat..."}
          placeholderTextColor={Colors.text.muted}
          multiline
          maxLength={500}
          onSubmitEditing={() => sendMessage(input)}
          blurOnSubmit
        />
        <TouchableOpacity
          style={[styles.sendButton, (!input.trim() || isLoading) && styles.sendButtonDisabled]}
          onPress={() => sendMessage(input)}
          disabled={!input.trim() || isLoading}
        >
          <Text style={styles.sendText}>{Icons.arrow}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  coachName: {
    ...Typography.h3,
    color: Colors.text.primary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  coachStatus: {
    ...Typography.caption,
    color: Colors.semantic.success,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bg.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  closeText: {
    color: Colors.text.tertiary,
    fontSize: 16,
  },
  upsellBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.elevated,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.accent.primary + '40',
  },
  upsellContent: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  upsellTitle: {
    ...Typography.bodyBold,
    color: Colors.accent.primary,
    marginBottom: 2,
  },
  upsellText: {
    ...Typography.caption,
    color: Colors.text.tertiary,
  },
  upsellButton: {
    minWidth: 80,
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 14,
    borderRadius: Radius.lg,
    marginBottom: Spacing.sm,
  },
  userBubble: {
    backgroundColor: Colors.accent.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: Radius.xs,
  },
  assistantBubble: {
    backgroundColor: Colors.bg.elevated,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: Radius.xs,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: Colors.white,
  },
  assistantText: {
    color: Colors.text.secondary,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  loadingText: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    fontStyle: 'italic',
  },
  quickPrompts: {
    maxHeight: 56,
    borderTopWidth: 1,
    borderTopColor: Colors.border.subtle,
  },
  quickPromptsContent: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    gap: Spacing.xs,
  },
  quickPromptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.elevated,
    paddingHorizontal: 14,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    gap: 6,
  },
  quickPromptSymbol: {
    fontSize: 13,
    fontWeight: '700',
  },
  quickPromptText: {
    color: Colors.text.tertiary,
    ...Typography.captionMedium,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border.subtle,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.bg.elevated,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    color: Colors.text.primary,
    fontSize: 15,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.3,
  },
  sendText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
});
