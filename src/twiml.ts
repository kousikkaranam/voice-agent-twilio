import twilio from "twilio";

const VoiceResponse = twilio.twiml.VoiceResponse;
const VOICE_NAME = "alice";

export const INITIAL_PROMPT = "Hello. How can I help you today?";
export const FAQ_RESPONSE = [
  "Your transfer may still be processing.",
  "You can check its status in your Wise account under Activity.",
  "Most transfers are instant, but some can take up to 2 days because of verification checks or bank delays."
].join(" ");
export const DEFLECTION_RESPONSE =
  "This request needs a human support agent. Please contact support for further assistance. Goodbye.";
export const NO_INPUT_RESPONSE =
  "I did not hear a question. Please call again when you are ready.";

export type VoiceTwiml = InstanceType<typeof twilio.twiml.VoiceResponse>;

export function buildIncomingTwiml(actionUrl: string): VoiceTwiml {
  const twiml = new VoiceResponse();
  const gather = twiml.gather({
    action: actionUrl,
    input: ["speech"],
    method: "POST",
    speechTimeout: "auto"
  });

  gather.say({ voice: VOICE_NAME }, INITIAL_PROMPT);
  twiml.say({ voice: VOICE_NAME }, NO_INPUT_RESPONSE);
  twiml.hangup();

  return twiml;
}

export function buildFaqTwiml(): VoiceTwiml {
  return buildMessageTwiml(FAQ_RESPONSE);
}

export function buildNoInputTwiml(): VoiceTwiml {
  return buildMessageTwiml(NO_INPUT_RESPONSE, { hangup: true });
}

export function buildDeflectionTwiml(): VoiceTwiml {
  return buildMessageTwiml(DEFLECTION_RESPONSE, { hangup: true });
}

function buildMessageTwiml(
  message: string,
  options: { hangup?: boolean } = {}
): VoiceTwiml {
  const twiml = new VoiceResponse();
  twiml.say({ voice: VOICE_NAME }, message);

  if (options.hangup) {
    twiml.hangup();
  }

  return twiml;
}
