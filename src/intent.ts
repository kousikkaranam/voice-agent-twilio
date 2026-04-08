export type SupportIntent = "where_is_my_money" | "unsupported" | "no_input";

const MONEY_TERMS = ["money", "transfer", "payment", "funds"] as const;
const TRACKING_TERMS = ["where", "track", "status", "check", "locate"] as const;
const DELIVERY_TERMS = [
  "receive",
  "received",
  "arrive",
  "arrived",
  "pending",
  "delay",
  "delayed",
  "late",
  "stuck",
  "missing"
] as const;
const NEGATION_TERMS = ["not", "didnt", "havent", "never", "still", "yet"] as const;

const DIRECT_MATCHERS: readonly RegExp[] = [
  /\bwhere\b.*\b(money|transfer|payment|funds)\b/,
  /\b(track|status|locate)\b.*\b(transfer|payment|funds)\b/,
  /\bwhen\b.*\b(money|transfer|payment|funds)\b.*\b(arrive|arriving)\b/,
  /\b(didnt|did not|havent|have not|never)\b.*\b(receive|received|arrive|arrived)\b.*\b(money|transfer|payment|funds)\b/,
  /\b(money|transfer|payment|funds)\b.*\b(not received|not arrived|still pending|delayed|late|stuck|missing)\b/,
  /\breceive\b.*\bmy\b.*\b(money|transfer|payment|funds)\b/
];

const COMPOUND_NEGATION_PATTERNS: readonly RegExp[] = [
  /\bdid not\b/,
  /\bhave not\b/,
  /\bnot received\b/,
  /\bnot arrived\b/,
  /\bstill pending\b/
];

export function resolveIntent(transcript: string): SupportIntent {
  const normalizedTranscript = normalizeTranscript(transcript);

  if (!normalizedTranscript) {
    return "no_input";
  }

  return isWhereIsMyMoneyInquiry(normalizedTranscript)
    ? "where_is_my_money"
    : "unsupported";
}

export function isWhereIsMyMoneyInquiry(transcript: string): boolean {
  const normalizedTranscript = normalizeTranscript(transcript);

  if (!normalizedTranscript) {
    return false;
  }

  if (DIRECT_MATCHERS.some((matcher) => matcher.test(normalizedTranscript))) {
    return true;
  }

  const tokens = new Set(normalizedTranscript.split(" "));
  const mentionsMoney = hasAnyToken(tokens, MONEY_TERMS);
  const mentionsTracking = hasAnyToken(tokens, TRACKING_TERMS);
  const mentionsDelivery = hasAnyToken(tokens, DELIVERY_TERMS);
  const mentionsNegation =
    hasAnyToken(tokens, NEGATION_TERMS) ||
    COMPOUND_NEGATION_PATTERNS.some((pattern) => pattern.test(normalizedTranscript));

  return mentionsMoney && ((mentionsTracking && mentionsDelivery) || (mentionsDelivery && mentionsNegation));
}

export function normalizeTranscript(value: string): string {
  return value
    .toLowerCase()
    .replace(/['\u2019]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasAnyToken(tokens: ReadonlySet<string>, candidates: readonly string[]): boolean {
  return candidates.some((candidate) => tokens.has(candidate));
}
