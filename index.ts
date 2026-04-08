import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import twilio from "twilio";

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const VoiceResponse = twilio.twiml.VoiceResponse;

// --- FAQ Answer ---
const FAQ_RESPONSE = `
Your transfer may still be processing.
You can check its status in your Wise account under activity.
Most transfers are instant, but some can take up to 2 days depending on verification or bank delays.
`;

// --- Intent Detection ---
function isWhereIsMyMoney(query: string): boolean {
  const q = query.toLowerCase();

  const keywords = [
    "where is my money",
    "track transfer",
    "transfer status",
    "money not received",
    "payment status",
    "where is my transfer"
  ];

  return keywords.some(k => q.includes(k));
}

// --- Voice Webhook ---
app.post("/voice", (req: Request, res: Response) => {
  const userInput = req.body.SpeechResult || "";

  console.log("User said:", userInput);

  const twiml = new VoiceResponse();

  if (isWhereIsMyMoney(userInput)) {
    twiml.say(
      { voice: "alice" },
      FAQ_RESPONSE
    );
  } else {
    twiml.say(
      { voice: "alice" },
      "I'm transferring your request to a human agent. Please wait."
    );
    twiml.hangup();
  }

  res.type("text/xml");
  res.send(twiml.toString());
});

// --- Initial Route (Greeting + Gather Speech) ---
app.post("/incoming", (req: Request, res: Response) => {
  const twiml = new VoiceResponse();

  const gather = twiml.gather({
    input: ["speech"],
    action: "/voice",
    method: "POST",
    speechTimeout: "auto"
  });

  gather.say(
    { voice: "alice" },
    "Hello. How can I help you today?"
  );

  res.type("text/xml");
  res.send(twiml.toString());
});

app.use((err: any, req: Request, res: Response, next: any) => {
  console.error("Error:", err);
  res.status(500).send("Internal Server Error");
});

// --- 404 Handler ---
app.use((req: Request, res: Response) => {
  console.warn(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).send("Not Found");
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`✅ Voice Agent Server running on port ${PORT}`);
  console.log(`📞 Webhook URL: https://your-domain/incoming`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});