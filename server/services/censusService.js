import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FALLBACK_PATH = path.join(__dirname, "../data/censusParishProfiles.fallback.json");

const CENSUS_BASE =
  "https://api.census.gov/data/2023/acs/acs5?get=NAME,B01003_001E,B17001_001E,B17001_002E,B19013_001E,B08201_001E,B08201_002E&for=county:*&in=state:22";

function buildCensusUrl() {
  const key = process.env.CENSUS_API_KEY?.trim();
  return key ? `${CENSUS_BASE}&key=${key}` : CENSUS_BASE;
}

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

let cache = null; // { profiles: [...], fetchedAt: timestamp }

// ── helpers ────────────────────────────────────────────────────────────────

/**
 * Remove "Parish, Louisiana" and similar suffixes for clean display names.
 * e.g. "East Baton Rouge Parish, Louisiana" → "East Baton Rouge Parish"
 */
export function normalizeParishName(rawName) {
  return rawName.replace(/,\s*Louisiana$/i, "").trim();
}

/**
 * Turn a Census NAME value into a URL/ID slug.
 * e.g. "East Baton Rouge Parish, Louisiana" → "east-baton-rouge"
 * e.g. "St. John the Baptist Parish, Louisiana" → "st-john-the-baptist"
 * e.g. "LaSalle Parish, Louisiana" → "lasalle"
 */
export function slugifyParishName(rawName) {
  return rawName
    .replace(/,\s*Louisiana$/i, "")   // strip ", Louisiana"
    .replace(/\s+Parish$/i, "")       // strip " Parish"
    .replace(/\./g, "")               // remove dots (St. → St)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");            // spaces → hyphens
}

/**
 * Parse the 2D array returned by the Census API into parish profile objects.
 * First row is the header row.
 */
export function parseCensusRows(rows) {
  if (!Array.isArray(rows) || rows.length < 2) return [];

  const [header, ...dataRows] = rows;
  const idx = (name) => header.indexOf(name);

  const iNAME = idx("NAME");
  const iPop = idx("B01003_001E");
  const iPovUniverse = idx("B17001_001E");
  const iPovBelow = idx("B17001_002E");
  const iIncome = idx("B19013_001E");
  const iVehicleTotal = idx("B08201_001E");
  const iVehicleNone = idx("B08201_002E");

  return dataRows.map((row) => {
    const rawName = row[iNAME] || "";
    const totalPopulation = parseInt(row[iPop], 10) || 0;
    const povertyUniverse = parseInt(row[iPovUniverse], 10) || 0;
    const populationBelowPoverty = parseInt(row[iPovBelow], 10) || 0;
    const medianHouseholdIncome = parseInt(row[iIncome], 10) || 0;
    const totalHouseholdsVehicle = parseInt(row[iVehicleTotal], 10) || 0;
    const householdsNoVehicle = parseInt(row[iVehicleNone], 10) || 0;

    const povertyRate =
      povertyUniverse > 0
        ? Math.round((populationBelowPoverty / povertyUniverse) * 1000) / 10
        : 0;

    const noVehicleHouseholdRate =
      totalHouseholdsVehicle > 0
        ? Math.round((householdsNoVehicle / totalHouseholdsVehicle) * 1000) / 10
        : 0;

    return {
      parishId: slugifyParishName(rawName),
      parishName: normalizeParishName(rawName),
      source: "U.S. Census Bureau ACS 5-Year",
      sourceYear: "2023",
      sourceType: "Public source",
      dataStatus: "Live public API",
      population: totalPopulation,
      medianHouseholdIncome,
      povertyRate,
      noVehicleHouseholdRate,
      rawFields: {
        totalPopulation,
        povertyUniverse,
        populationBelowPoverty,
        medianHouseholdIncome,
        totalHouseholdsVehicle,
        householdsNoVehicle
      }
    };
  });
}

// ── fetch / cache ──────────────────────────────────────────────────────────

function loadFallback() {
  if (!existsSync(FALLBACK_PATH)) return null;
  try {
    const raw = readFileSync(FALLBACK_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function fetchFromCensus() {
  const url = buildCensusUrl();
  const res = await fetch(url, {
    headers: { "Accept": "application/json" },
    redirect: "follow"
  });

  if (!res.ok) {
    throw new Error(`Census API responded with status ${res.status}`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json") && !contentType.includes("text/plain")) {
    const snippet = (await res.text()).slice(0, 120);
    throw new Error(`Census API returned non-JSON response. Hint: set CENSUS_API_KEY in server/.env. Snippet: ${snippet}`);
  }

  const rows = await res.json();
  return parseCensusRows(rows);
}

/**
 * Returns all 64 Louisiana parish Census profiles.
 * Uses a 24-hour in-memory cache; falls back to the local JSON file if the API fails.
 */
export async function getAllLouisianaCensusProfiles() {
  // Return cache if still fresh
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.profiles;
  }

  try {
    const profiles = await fetchFromCensus();
    cache = { profiles, fetchedAt: Date.now() };
    return profiles;
  } catch (err) {
    console.warn("[censusService] Census API fetch failed:", err?.message || err);
    const fallback = loadFallback();
    if (fallback) {
      console.info("[censusService] Serving fallback Census profiles.");
      return fallback;
    }
    throw new Error("Census API is temporarily unavailable and no local fallback exists.");
  }
}

/**
 * Returns a single parish profile by slug id (e.g. "east-baton-rouge").
 * Returns null if not found.
 */
export async function getCensusProfileByParishId(parishId) {
  const profiles = await getAllLouisianaCensusProfiles();
  return profiles.find((p) => p.parishId === parishId) || null;
}
