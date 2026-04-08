# Voice Agent with Twilio and TypeScript

This is a TypeScript-based voice agent that uses Twilio for handling phone calls, Express for the webhook server, and optionally OpenAI for intent detection.

## Architecture

```
Call → Twilio → Express webhook → intent check
     → FAQ answer OR deflect → TwiML response
```

## Setup

1. **Install Dependencies**
   - Already done: `npm install`

2. **Environment Variables**
   - Copy `.env` and fill in your Twilio credentials:
     - `TWILIO_ACCOUNT_SID`
     - `TWILIO_AUTH_TOKEN`
     - `TWILIO_PHONE_NUMBER`
   - Optional: `OPENAI_API_KEY` for LLM-based intent detection

3. **Twilio Configuration**
   - Buy a phone number in Twilio Console
   - Set Voice Webhook URL to: `https://your-domain/incoming`
   - Method: POST

## Running the Server

- Local: `npm start`
- Expose to internet: Use ngrok - `npx ngrok http 3000`
- Use the ngrok URL in Twilio webhook

## Features

- Handles incoming calls
- Speech-to-text via Twilio
- Keyword-based intent detection for "Where is my money?" queries
- Responds with FAQ or deflects to human agent

## Optional: OpenAI Integration

To use OpenAI for better intent detection:

1. Install: `npm install openai`
2. Add `OPENAI_API_KEY` to `.env`
3. Uncomment and use the OpenAI version in `index.ts`

## Call Flow Example

- User calls
- Bot: "Hello, how can I help you today?"
- User: "I didn't receive my money"
- Bot: Provides FAQ response
- Or for unsupported: "Transferring to human agent." (hangs up)

## Next Steps

- Real-time streaming agent
- Whisper + WebSockets
- Multi-intent FAQ with RAG