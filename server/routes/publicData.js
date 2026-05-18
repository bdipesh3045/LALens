import express from "express";
import { getAllLouisianaCensusProfiles, getCensusProfileByParishId } from "../services/censusService.js";

const router = express.Router();

/**
 * GET /api/public-data/parishes
 * Returns Census ACS profiles for all 64 Louisiana parishes.
 */
router.get("/parishes", async (_req, res) => {
  try {
    const profiles = await getAllLouisianaCensusProfiles();
    res.json({
      source: "U.S. Census Bureau ACS 5-Year",
      sourceYear: "2023",
      sourceType: "Public source",
      dataStatus: "Live public API",
      parishCount: profiles.length,
      parishes: profiles
    });
  } catch (err) {
    console.error("[publicData] /parishes error:", err?.message || err);
    res.status(503).json({
      error: "Census data is temporarily unavailable.",
      detail: err?.message || "Unknown error",
      sourceType: "Public source",
      dataStatus: "Temporarily unavailable"
    });
  }
});

/**
 * GET /api/public-data/parish/:id
 * Returns the Census profile for a single parish by slug id.
 * Example: /api/public-data/parish/east-baton-rouge
 */
router.get("/parish/:id", async (req, res) => {
  const parishId = req.params.id?.toLowerCase().trim();
  if (!parishId) {
    return res.status(400).json({ error: "Parish id is required." });
  }

  try {
    const profile = await getCensusProfileByParishId(parishId);
    if (!profile) {
      return res.status(404).json({
        error: `No Census profile found for parish id "${parishId}".`,
        tip: "Use slugified parish name, e.g. east-baton-rouge, st-landry, orleans."
      });
    }
    res.json(profile);
  } catch (err) {
    console.error("[publicData] /parish/:id error:", err?.message || err);
    res.status(503).json({
      error: "Census data is temporarily unavailable.",
      detail: err?.message || "Unknown error",
      sourceType: "Public source",
      dataStatus: "Temporarily unavailable"
    });
  }
});

export default router;
