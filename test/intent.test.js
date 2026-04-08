const assert = require("node:assert/strict");
const {
  isWhereIsMyMoneyInquiry,
  normalizeTranscript,
  resolveIntent
} = require("../dist/src/intent.js");

run();

function run() {
  verifyNormalization();
  verifySupportedUtterances();
  verifyUnsupportedUtterances();
  verifyNoInputHandling();
  console.log("Intent tests passed");
}

function verifyNormalization() {
  assert.equal(
    normalizeTranscript("I didn't receive my money!!!"),
    "i didnt receive my money"
  );
}

function verifySupportedUtterances() {
  const supportedUtterances = [
    "Where is my money?",
    "I didn't receive my money",
    "Can you track my transfer?",
    "My payment is still pending",
    "When will my funds arrive?"
  ];

  for (const utterance of supportedUtterances) {
    assert.equal(isWhereIsMyMoneyInquiry(utterance), true, utterance);
    assert.equal(resolveIntent(utterance), "where_is_my_money", utterance);
  }
}

function verifyUnsupportedUtterances() {
  const unsupportedUtterances = [
    "I want to change my phone number",
    "How do I close my account?",
    "Can I cancel my transfer?",
    "I need help updating my address"
  ];

  for (const utterance of unsupportedUtterances) {
    assert.equal(isWhereIsMyMoneyInquiry(utterance), false, utterance);
    assert.equal(resolveIntent(utterance), "unsupported", utterance);
  }
}

function verifyNoInputHandling() {
  assert.equal(resolveIntent(""), "no_input");
  assert.equal(resolveIntent("   "), "no_input");
}
