// Waitlist Export Edge Function (Admin Only)
// Exports waitlist data as CSV for marketing purposes
// Protected by ADMIN_SECRET environment variable

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-secret',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Check admin secret
    const adminSecret = Deno.env.get('ADMIN_SECRET');
    const providedSecret = req.headers.get('x-admin-secret');

    if (!adminSecret || providedSecret !== adminSecret) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get format from query params
    const url = new URL(req.url);
    const format = url.searchParams.get('format') || 'json';
    const limit = parseInt(url.searchParams.get('limit') || '10000');

    // Fetch waitlist
    const { data, error } = await supabase
      .from('waitlist')
      .select('email, source, utm_source, utm_medium, utm_campaign, created_at, converted_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(error.message);
    }

    if (format === 'csv') {
      // Generate CSV
      const headers = ['email', 'source', 'utm_source', 'utm_medium', 'utm_campaign', 'created_at', 'converted_at'];
      const csvRows = [headers.join(',')];
      
      for (const row of data || []) {
        const values = headers.map(h => {
          const val = (row as any)[h];
          if (val === null || val === undefined) return '';
          // Escape quotes and wrap in quotes if contains comma
          const str = String(val);
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        });
        csvRows.push(values.join(','));
      }

      return new Response(csvRows.join('\n'), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="questhabit-waitlist-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    // Return JSON
    return new Response(
      JSON.stringify({ 
        success: true,
        count: data?.length || 0,
        data 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Waitlist export error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Export failed' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
