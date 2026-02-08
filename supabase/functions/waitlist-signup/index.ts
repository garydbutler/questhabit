// Waitlist Signup Edge Function
// Handles email signups from the landing page with validation and rate limiting

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WaitlistRequest {
  email: string;
  source?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

// Simple email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Rate limiting: max 5 signups per IP per hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 3600000 }); // 1 hour
    return true;
  }
  
  if (record.count >= 5) {
    return false;
  }
  
  record.count++;
  return true;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request
    const body: WaitlistRequest = await req.json();
    const { email, source, referrer, utm_source, utm_medium, utm_campaign } = body;

    // Validate email
    if (!email || !isValidEmail(email)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Please enter a valid email address' 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get IP for rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               req.headers.get('x-real-ip') || 
               'unknown';
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Too many requests. Please try again later.' 
        }),
        { 
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get user agent
    const userAgent = req.headers.get('user-agent') || '';

    // Normalize email (lowercase, trim)
    const normalizedEmail = email.toLowerCase().trim();

    // Insert into waitlist
    const { data, error } = await supabase
      .from('waitlist')
      .insert({
        email: normalizedEmail,
        source: source || 'landing_page',
        referrer,
        utm_source,
        utm_medium,
        utm_campaign,
        ip_address: ip,
        user_agent: userAgent,
      })
      .select('id')
      .single();

    if (error) {
      // Check for duplicate email
      if (error.code === '23505') {
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "You're already on the waitlist! We'll notify you when we launch.",
            alreadySignedUp: true
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      console.error('Waitlist insert error:', error);
      throw new Error('Failed to join waitlist');
    }

    // Optional: Send welcome email via Resend/SendGrid
    // TODO: Integrate email service
    // await sendWelcomeEmail(normalizedEmail);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "You're in! We'll notify you when QuestHabit launches.",
        id: data.id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Waitlist signup error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Something went wrong. Please try again.' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
