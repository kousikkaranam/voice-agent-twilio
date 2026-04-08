import express, { NextFunction, Request, Response } from "express";
import { AppConfig } from "./config";
import { resolveIntent } from "./intent";
import {
  buildDeflectionTwiml,
  buildFaqTwiml,
  buildIncomingTwiml,
  buildNoInputTwiml,
  VoiceTwiml
} from "./twiml";

type VoiceWebhookBody = {
  SpeechResult?: string;
};

const INCOMING_ROUTE = "/incoming";
const VOICE_ROUTE = "/voice";

export function createApp(config: AppConfig): express.Express {
  const app = express();

  app.disable("x-powered-by");
  app.use(express.urlencoded({ extended: false }));

  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
  });

  app.post(INCOMING_ROUTE, (_req: Request, res: Response) => {
    sendTwiml(res, buildIncomingTwiml(getVoiceActionUrl(config)));
  });

  app.post(
    VOICE_ROUTE,
    (req: Request<Record<string, never>, string, VoiceWebhookBody>, res: Response) => {
      const transcript = getSpeechResult(req.body);
      const intent = resolveIntent(transcript);

      switch (intent) {
        case "where_is_my_money":
          sendTwiml(res, buildFaqTwiml());
          return;
        case "no_input":
          sendTwiml(res, buildNoInputTwiml());
          return;
        default:
          sendTwiml(res, buildDeflectionTwiml());
      }
    }
  );

  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Unhandled request error", error);
    res.status(500).send("Internal Server Error");
  });

  app.use((_req: Request, res: Response) => {
    res.status(404).send("Not Found");
  });

  return app;
}

export function getIncomingRoute(): string {
  return INCOMING_ROUTE;
}

function getVoiceActionUrl(config: AppConfig): string {
  return config.publicBaseUrl ? `${config.publicBaseUrl}${VOICE_ROUTE}` : VOICE_ROUTE;
}

function getSpeechResult(body: VoiceWebhookBody): string {
  return typeof body.SpeechResult === "string" ? body.SpeechResult.trim() : "";
}

function sendTwiml(res: Response, twiml: VoiceTwiml): void {
  res.status(200).type("text/xml").send(twiml.toString());
}
