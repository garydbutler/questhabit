// Supabase Edge Function: Stripe Webhook Handler
// POST /functions/v1/stripe-webhook
// Handles subscription lifecycle events

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2023-10-16',
})

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') as string

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 })
  }

  const body = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  // Initialize Supabase
  const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  console.log(`Processing webhook event: ${event.type}`)

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.mode === 'subscription' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )
          
          const userId = subscription.metadata.supabase_user_id
          if (userId) {
            await updateSubscriptionStatus(supabase, userId, subscription)
          }
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata.supabase_user_id

        if (userId) {
          await updateSubscriptionStatus(supabase, userId, subscription)
        } else {
          // Try to find user by customer ID
          const customerId = subscription.customer as string
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('stripe_customer_id', customerId)
            .single()

          if (profile) {
            await updateSubscriptionStatus(supabase, profile.id, subscription)
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        let userId = subscription.metadata.supabase_user_id

        if (!userId) {
          const customerId = subscription.customer as string
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('stripe_customer_id', customerId)
            .single()

          if (profile) {
            userId = profile.id
          }
        }

        if (userId) {
          // Downgrade to free
          await supabase
            .from('profiles')
            .update({
              is_pro: false,
              pro_expires_at: null,
              stripe_subscription_id: null,
              stripe_subscription_status: 'canceled',
              streak_freezes_remaining: 0,
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId)

          console.log(`User ${userId} downgraded to free plan`)
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription as string
          )
          
          let userId = subscription.metadata.supabase_user_id

          if (!userId) {
            const customerId = invoice.customer as string
            const { data: profile } = await supabase
              .from('profiles')
              .select('id')
              .eq('stripe_customer_id', customerId)
              .single()

            if (profile) {
              userId = profile.id
            }
          }

          if (userId) {
            // Reset streak freezes on successful payment (monthly renewal)
            await supabase
              .from('profiles')
              .update({
                streak_freezes_remaining: 3,
                updated_at: new Date().toISOString(),
              })
              .eq('id', userId)

            console.log(`Reset streak freezes for user ${userId}`)
          }
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        console.log(`Payment failed for invoice ${invoice.id}`)
        // Could send notification to user here
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Webhook processing error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

async function updateSubscriptionStatus(
  supabase: any,
  userId: string,
  subscription: Stripe.Subscription
) {
  const isPro = ['active', 'trialing'].includes(subscription.status)
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000)

  await supabase
    .from('profiles')
    .update({
      is_pro: isPro,
      pro_expires_at: currentPeriodEnd.toISOString(),
      stripe_subscription_id: subscription.id,
      stripe_subscription_status: subscription.status,
      streak_freezes_remaining: isPro ? 3 : 0,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)

  console.log(`Updated subscription for user ${userId}: ${subscription.status}`)
}
