import { parishes } from "../../server/data/parishes.js";

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const parish = parishes.find((p) => p.id === req.query.id);
  if (!parish) {
    return res.status(404).json({ error: "Parish not found" });
  }

  return res.status(200).json(parish);
}
