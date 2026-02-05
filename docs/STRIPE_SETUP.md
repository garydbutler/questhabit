# Stripe Integration Setup Guide

This guide walks through setting up Stripe payments for QuestHabit Pro subscriptions.

## Overview

QuestHabit uses Stripe Checkout for subscription payments with these components:
- **Supabase Edge Functions** for secure server-side Stripe API calls
- **Stripe Checkout** for the payment flow (opens in browser)
- **Stripe Webhooks** to sync subscription status to the database
- **Stripe Customer Portal** for subscription management

## 1. Create Stripe Account & Products

### Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete business verification

### Create Products
1. Go to **Products** in Stripe Dashboard
2. Click **Add product**

**Monthly Plan:**
- Name: `QuestHabit Pro Monthly`
- Price: `$4.99 USD / month`
- Billing period: Monthly
- Copy the Price ID (starts with `price_`)

**Yearly Plan:**
- Name: `QuestHabit Pro Yearly`
- Price: `$39.99 USD / year`
- Billing period: Yearly
- Copy the Price ID (starts with `price_`)

## 2. Get API Keys

1. Go to **Developers > API keys** in Stripe Dashboard
2. Copy your **Secret key** (starts with `sk_test_` for test mode or `sk_live_` for production)
3. Copy your **Publishable key** (starts with `pk_test_` or `pk_live_`)

## 3. Configure Supabase Edge Functions

### Set Environment Secrets
In Supabase Dashboard, go to **Edge Functions > Secrets** and add:

```
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx  (get this after creating webhook)
```

### Deploy Edge Functions
```bash
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
supabase functions deploy customer-portal
```

## 4. Set Up Stripe Webhooks

1. Go to **Developers > Webhooks** in Stripe Dashboard
2. Click **Add endpoint**
3. Enter your webhook URL:
   ```
   https://YOUR_PROJECT_REF.supabase.co/functions/v1/stripe-webhook
   ```
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add it to Supabase Edge Function secrets as `STRIPE_WEBHOOK_SECRET`

## 5. Configure App Environment

Update your `.env` file:

```env
EXPO_PUBLIC_STRIPE_PRICE_MONTHLY=price_xxxxxxxxxxxxx
EXPO_PUBLIC_STRIPE_PRICE_YEARLY=price_xxxxxxxxxxxxx
```

## 6. Run Database Migration

Apply the Stripe columns migration:

```sql
-- Run in Supabase SQL Editor
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_status TEXT;

CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id 
ON public.profiles(stripe_customer_id);
```

Or apply the migration file:
```bash
supabase db push
```

## 7. Configure Stripe Customer Portal

1. Go to **Settings > Billing > Customer portal** in Stripe Dashboard
2. Enable the features you want:
   - Update payment method
   - View invoice history
   - Cancel subscription
3. Customize branding to match QuestHabit

## 8. Test the Integration

### Test Mode
1. Use Stripe test mode (toggle in Dashboard)
2. Use test card: `4242 4242 4242 4242`
3. Any future expiry, any CVC

### Test Flow
1. Open app, go to Pro page
2. Select a plan and tap "Start Pro"
3. Complete checkout with test card
4. Verify subscription status updates in app
5. Test "Manage Subscription" opens portal

## 9. Go Live

1. Switch Stripe to live mode
2. Update `STRIPE_SECRET_KEY` to live key
3. Create new webhook endpoint for production URL
4. Update `STRIPE_WEBHOOK_SECRET` with new signing secret
5. Update Price IDs if using different live products

## Troubleshooting

### Checkout doesn't open
- Check Supabase Edge Function logs
- Verify STRIPE_SECRET_KEY is correct
- Check Price IDs are valid

### Subscription status not updating
- Check webhook endpoint is receiving events
- Verify STRIPE_WEBHOOK_SECRET matches
- Check Supabase Edge Function logs for errors

### Customer portal not working
- Ensure user has stripe_customer_id in database
- Verify customer has active/past subscription in Stripe

## Security Notes

- Never expose STRIPE_SECRET_KEY in client code
- All Stripe API calls go through Edge Functions
- Webhook signature is verified before processing
- User can only access their own subscription data (RLS)
