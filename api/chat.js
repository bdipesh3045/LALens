import { parishes } from "../server/data/parishes.js";
import { generateInsight } from "../server/services/insightEngine.js";
import { resolveParishFromUserMessage } from "../server/services/parishResolve.js";

const MAX_MESSAGE_LEN = 1500;
const MAX_HISTORY = 16;

function validateChatBody(body) {
  if (!body || typeof body !== "object") return "Invalid JSON body.";
  const { message, selectedParishId, history } = body;
  if (typeof message !== "string") return "message must be a string.";
  const trimmed = message.trim();
  if (!trimmed) return "message must be a non-empty string.";
  if (trimmed.length > MAX_MESSAGE_LEN) return `message must be at most ${MAX_MESSAGE_LEN} characters.`;
  if (selectedParishId !== undefined && selectedParishId !== null) {
    if (typeof selectedParishId !== "string") return "selectedParishId must be a string when provided.";
    if (selectedParishId.length > 80) return "selectedParishId is too long.";
  }
  if (history !== undefined && !Array.isArray(history)) return "history must be an array when provided.";
  if (Array.isArray(history)) {
    if (history.length > MAX_HISTORY) return `history may contain at most ${MAX_HISTORY} messages.`;
    for (let i = 0; i < history.length; i++) {
      const m = history[i];
      if (!m || typeof m !== "object") return "Each history item must be an object.";
      if (m.role !== "user" && m.role !== "assistant") return "history role must be user or assistant.";
      if (typeof m.content !== "string") return "history content must be a string.";
      if (m.content.length > 4000) return "history content is too long.";
    }
  }
  return null;
}

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const err = validateChatBody(req.body);
  if (err) return res.status(400).json({ error: err });

  const { message, selectedParishId, history = [] } = req.body;
  const trimmed = String(message).trim();
  const fromUi = selectedParishId ? parishes.find((p) => p.id === selectedParishId) : null;
  const fromMessage = resolveParishFromUserMessage(trimmed, parishes);
  const selectedParish = fromMessage || fromUi || parishes.find((p) => p.hasMetrics) || parishes[0];

  try {
    const insight = await generateInsight({
      message: trimmed,
      selectedParish,
      parishes,
      history: Array.isArray(history) ? history : []
    });

    return res.status(200).json({
      ...insight,
      resolvedParishId: selectedParish?.id,
      resolvedParishName: selectedParish?.name,
      parishMentionInMessage: Boolean(fromMessage)
    });
  } catch (e) {
    console.error("[api/chat]", e);
    return res.status(500).json({ error: "Insight engine failed. Please try again." });
  }
}
