// AI Coach Edge Function - Real OpenAI Integration
// Provides personalized habit coaching using GPT-4

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HabitContext {
  name: string;
  category: string;
  difficulty: string;
  streak: number;
  bestStreak: number;
  completedToday: boolean;
}

interface CoachRequest {
  message: string;
  userId: string;
  context: {
    level: number;
    totalXP: number;
    habitCount: number;
    habits: HabitContext[];
    completedToday: number;
  };
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
}

const SYSTEM_PROMPT = `You are QuestHabit's AI Coach — a supportive, gamification-savvy habit coach. Your personality is encouraging, slightly playful, and uses gaming/RPG metaphors naturally (but not excessively).

KEY TRAITS:
- Positive and motivating, never preachy or judgmental
- Use gaming terms naturally: XP, leveling up, quests, streaks, achievements
- Keep responses concise (2-4 paragraphs max)
- Be specific — reference the user's actual habits and progress
- Celebrate wins, no matter how small
- When users struggle, empathize first, then offer ONE actionable tip
- Occasionally use emoji sparingly (1-2 max per message)

RESPONSE STYLE:
- Start responses with energy (not "I understand" or "That's a great question")
- Use line breaks between thoughts for readability
- End with a question or call-to-action when appropriate
- Be specific about their data — mention their level, XP, habit names, streaks

REMEMBER:
- The user is on a journey to build better habits through gamification
- Every day they show up is a win
- Consistency beats intensity
- Small wins compound into big transformations`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request
    const { message, userId, context, history }: CoachRequest = await req.json();

    if (!message || !userId) {
      throw new Error('Missing required fields: message, userId');
    }

    // Verify user exists and check Pro status
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_pro, subscription_status')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      throw new Error('User not found');
    }

    // Check if user has Pro access (AI Coach is a Pro feature)
    // Support both is_pro boolean and subscription_status string for compatibility
    const isPro = profile.is_pro === true || 
                  profile.subscription_status === 'active' || 
                  profile.subscription_status === 'trialing';
    
    if (!isPro) {
      return new Response(
        JSON.stringify({ 
          error: 'Pro subscription required',
          message: 'AI Coach is a Pro feature. Upgrade to unlock personalized AI coaching!'
        }),
        { 
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Build context message for the AI
    const contextMessage = buildContextMessage(context);

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'system', content: contextMessage },
      // Include last 6 messages from history for conversation continuity
      ...history.slice(-6).map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    // Call OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Cost-effective but capable
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text();
      console.error('OpenAI API error:', errorData);
      throw new Error('AI service temporarily unavailable');
    }

    const data = await openaiResponse.json();
    const response = data.choices[0]?.message?.content || 
      "I hit a temporary snag. Try asking me again!";

    return new Response(
      JSON.stringify({ response }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('AI Coach error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        response: "Oops! I'm having a moment. Let's try that again in a sec."
      }),
      { 
        status: error.message?.includes('required') ? 403 : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function buildContextMessage(context: CoachRequest['context']): string {
  const { level, totalXP, habitCount, habits, completedToday } = context;
  
  if (habitCount === 0) {
    return `USER CONTEXT:
- Level: ${level}
- Total XP: ${totalXP}
- Active Habits: None yet (new user)
- Status: Just getting started

Note: This user hasn't created any habits yet. Encourage them to start small with their first quest.`;
  }

  const completionRate = Math.round((completedToday / habitCount) * 100);
  const activeStreaks = habits.filter(h => h.streak > 0);
  const bestOverallStreak = Math.max(...habits.map(h => h.bestStreak), 0);

  const habitSummary = habits.map(h => 
    `  - ${h.name} (${h.category}, ${h.difficulty}): ${h.streak} day streak${h.completedToday ? ' [DONE TODAY]' : ''}`
  ).join('\n');

  return `USER CONTEXT:
- Level: ${level}
- Total XP: ${totalXP}
- Active Habits: ${habitCount}
- Completed Today: ${completedToday}/${habitCount} (${completionRate}%)
- Best Streak Ever: ${bestOverallStreak} days
- Active Streaks: ${activeStreaks.length}

HABITS:
${habitSummary}

Use this context to give specific, personalized advice. Reference their actual habits by name when relevant.`;
}
