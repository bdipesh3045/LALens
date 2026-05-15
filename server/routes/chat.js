import express from "express";
import { parishes } from "../data/parishes.js";
import { generateInsight } from "../services/insightEngine.js";
import { resolveParishFromUserMessage } from "../services/parishResolve.js";

const router = express.Router();

/** In-memory rate limit for chat. Production should use Redis or an API gateway. */
const CHAT_WINDOW_MS = 5 * 60 * 1000;
const CHAT_MAX_PER_WINDOW = 30;
const chatBuckets = new Map();

function getClientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length) return fwd.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}

function chatRateLimit(req, res, next) {
  const ip = getClientIp(req);
  const now = Date.now();
  let bucket = chatBuckets.get(ip);
  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 0, resetAt: now + CHAT_WINDOW_MS };
    chatBuckets.set(ip, bucket);
  }
  if (bucket.count >= CHAT_MAX_PER_WINDOW) {
    return res.status(429).json({ error: "Too many chat requests. Please try again in a few minutes." });
  }
  bucket.count += 1;
  next();
}

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

router.post("/", chatRateLimit, async (req, res) => {
  const err = validateChatBody(req.body);
  if (err) return res.status(400).json({ error: err });

  const { message, selectedParishId, history = [] } = req.body;
  const trimmed = String(message).trim();
  const fromUi = selectedParishId ? parishes.find((p) => p.id === selectedParishId) : null;
  const fromMessage = resolveParishFromUserMessage(trimmed, parishes);
  const selectedParish = fromMessage || fromUi || parishes.find((p) => p.hasMetrics) || parishes[0];
  const insight = await generateInsight({
    message: trimmed,
    selectedParish,
    parishes,
    history: Array.isArray(history) ? history : []
  });
  res.json({
    ...insight,
    resolvedParishId: selectedParish?.id,
    resolvedParishName: selectedParish?.name,
    parishMentionInMessage: Boolean(fromMessage)
  });
});

export default router;
