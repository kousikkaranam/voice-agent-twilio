# Voice Agent with Twilio and TypeScript

This project is a focused customer support voice agent built with Twilio, Express, and TypeScript.

It supports one FAQ category from Wise's "Sending money" help content:

- "Where is my money?"

For any question outside that scope, the agent deflects to a human support agent and ends the call.

## Architecture

- `src/config.ts`: runtime configuration loading
- `src/intent.ts`: FAQ intent detection
- `src/twiml.ts`: Twilio voice response builders
- `src/server.ts`: Express routes and request handling
- `src/index.ts`: application bootstrap and shutdown

## Call flow

1. A caller hits the Twilio number.
2. Twilio sends the call to `POST /incoming`.
3. The agent asks, "Hello. How can I help you today?"
4. Twilio sends the speech transcript to `POST /voice`.
5. The app either:
   - answers the supported FAQ, or
   - deflects to human support and hangs up.

## Tech stack

- Node.js
- TypeScript
- Express
- Twilio Voice

## Environment variables

Create a `.env` file with:

```env
PORT=3000
PUBLIC_BASE_URL=https://your-render-service.onrender.com
TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+16066606314
```

`PUBLIC_BASE_URL` is optional and is only used for a cleaner startup log.

## Local development

Install dependencies:

```bash
npm install
```

Run the app locally:

```bash
npm run build
npm start
```

Run the test suite:

```bash
npm test
```

## Twilio setup

Configure your Twilio phone number's voice webhook as:

- URL: `https://your-domain/incoming`
- Method: `POST`

For local testing, expose `localhost:3000` with a tunneling service such as ngrok and use the public URL in Twilio.

## Smoke tests

Test the incoming call webhook:

```bash
curl -X POST http://localhost:3000/incoming -i
```

Test the supported FAQ path:

```bash
curl -X POST http://localhost:3000/voice -i --data-urlencode "SpeechResult=I didn't receive my money"
```

Test the unsupported path:

```bash
curl -X POST http://localhost:3000/voice -i --data-urlencode "SpeechResult=I want to change my phone number"
```

## Deployment

This app can be deployed on Render or any Node.js hosting platform.

Recommended Render settings:

- Build command: `npm install`
- Start command: `npm start`

Once deployed, point your Twilio phone number to:

```text
https://your-render-service.onrender.com/incoming
```
