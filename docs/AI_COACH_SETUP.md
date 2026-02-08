# AI Coach Setup Guide

The AI Coach is a Pro feature that provides personalized habit coaching using GPT-4. This guide covers deployment and configuration.

## Architecture

- **Client**: React Native component (`AICoach.tsx`) sends user messages
- **Backend**: Supabase Edge Function (`ai-coach`) handles OpenAI API calls
- **Model**: GPT-4o-mini (cost-effective, fast, capable)

## Prerequisites

1. Supabase project with Edge Functions enabled
2. OpenAI API account with API key
3. Supabase CLI installed (`npm install -g supabase`)

## Deployment Steps

### 1. Set Up OpenAI API Key

Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys).

Set it as a Supabase secret:

```bash
cd projects/questhabit
supabase secrets set OPENAI_API_KEY=sk-your-key-here
```

### 2. Deploy the Edge Function

```bash
# Login to Supabase CLI
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy the AI coach function
supabase functions deploy ai-coach
```

### 3. Verify Deployment

Test the function is working:

```bash
curl -X POST 'https://your-project.supabase.co/functions/v1/ai-coach' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "message": "Hello!",
    "userId": "test-user-id",
    "context": {
      "level": 1,
      "totalXP": 0,
      "habitCount": 0,
      "habits": [],
      "completedToday": 0
    },
    "history": []
  }'
```

## Cost Considerations

- **Model**: GPT-4o-mini costs ~$0.15 per 1M input tokens, $0.60 per 1M output tokens
- **Estimate**: At 500 tokens per conversation turn, 1000 daily active users sending 5 messages each = ~$0.02/day
- **Monthly**: ~$0.60 for 1000 DAU (very affordable)

## Rate Limiting

The function doesn't currently implement rate limiting. For production, consider:

1. **Supabase RLS**: Limit requests per user per hour
2. **Redis/Upstash**: Add a rate limiter in the edge function
3. **OpenAI**: Set spending limits in OpenAI dashboard

## Customizing the AI

The AI personality is defined in the `SYSTEM_PROMPT` constant in `ai-coach/index.ts`. Key traits:

- Encouraging and supportive
- Uses gaming/RPG metaphors naturally
- References user's actual habits and progress
- Keeps responses concise (2-4 paragraphs)

To modify the personality, edit the `SYSTEM_PROMPT` and redeploy.

## Troubleshooting

### "OPENAI_API_KEY not configured"
- Run `supabase secrets set OPENAI_API_KEY=sk-...`
- Redeploy the function

### "User not found"
- Check the user ID is being passed correctly
- Verify the profiles table has the user record

### "Pro subscription required"
- This is expected for non-Pro users
- AI Coach is a Pro-only feature

### Slow responses
- GPT-4o-mini is fast but network latency varies
- Consider showing "Thinking..." state in UI (already implemented)

## Security Notes

1. OpenAI API key is stored as a Supabase secret (never exposed to client)
2. User ID is verified against the profiles table
3. Pro status is checked server-side (can't be bypassed)
4. Conversation history is limited to last 6 messages to prevent abuse

## Future Improvements

- [ ] Add conversation persistence in Supabase
- [ ] Implement rate limiting per user
- [ ] Add usage analytics
- [ ] Support conversation "memory" across sessions
- [ ] Fine-tune responses based on user feedback
