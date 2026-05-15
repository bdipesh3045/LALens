# LALens

Civic-tech prototype for the **Nexus DevDays EdTech Challenge**: a single place to explore **where** to invest in education pathways, **what** to build, and **why**—with transparent scoring, a parish map, dashboards, and an AI insight assistant.

## What it does

- **Platform** — Gap map, parish dashboard, filters, and ranked “top opportunities” using a weighted **Opportunity Score**.  
- **Methodology** — Explains factor weights; includes an illustrative weighting demo on a sample parish.  
- **Data Sources** — Honest status of planned integrations vs the current demo dataset.  
- **AI Insight Engine** — `POST /api/chat` answers from the parish JSON in context (**Groq** when configured, otherwise a **rule-based** fallback).

This prototype is **decision-support only** and **does not prove causal impact**.

## Tech stack

- **Client** — React (Vite), React Router, Recharts, Leaflet  
- **Server** — Node.js, Express, CORS, dotenv  

## Run locally

```bash
npm install
npm run install-all
npm run dev
```

- Client (Vite, default **5173**) proxies `/api` to **`LALENS_API_PROXY`** if set, otherwise **`http://127.0.0.1:5050`**.
- API: `GET /api/parishes`, `GET /api/parishes/:id`, `POST /api/chat` on **`PORT`** (default **5050**).

If **5050** is in use, run both processes with a matching backend URL, for example:

```bash
PORT=5052 LALENS_API_PROXY=http://127.0.0.1:5052 npm run dev
```

## Environment variables

Create `.env` in the **project root** or **`server/`** (see `.env.example`):

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | No | If set and valid, chat uses Groq; otherwise rules-based replies. |
| `PORT` | No | API port (default **5050**). |
| `LALENS_API_PROXY` | No | **Dev only:** URL Vite proxies `/api` to (default `http://127.0.0.1:5050`). Set when `PORT` is not 5050. |

**Security:** Do **not** commit real API keys. `.env` is gitignored; only `.env.example` belongs in the repo (with empty placeholders).

## Prototype data status

The app uses a **12-parish sample dataset** in `client/src/data/parishes.js` with **illustrative** metrics. Louisiana has **64** parishes; full coverage is a **data integration roadmap** item, not claimed in the UI.

Opportunity scores on the Platform are **computed** from the five factor scores using the published weights in `client/src/utils/scoring.js`.

## AI behavior

- **Groq** — When `GROQ_API_KEY` is set, the model is instructed to stay within the JSON context (12-parish sample, no invented stats or statewide claims).  
- **Rules** — If the key is missing or the API fails, deterministic answers use only the sample catalog.

Chat requests are **validated** (message length, optional `selectedParishId`) and **rate-limited** in memory (30 requests / 5 minutes / IP). Production deployments should use **Redis** or an **API gateway** for rate limiting.

## Methodology (Opportunity Score)

Weighted blend of five factors (each 0–100, then rounded):

- **35%** Student need  
- **20%** Enrollment pressure  
- **25%** Workforce gap  
- **10%** Pathway access gap  
- **10%** Feasibility  

Priority bands: **Urgent** (85–100), **High** (70–84), **Moderate** (50–69), **Low** (0–49).

## Data integration roadmap

Planned official inputs: **LDOE**, **NCES EDGE**, **U.S. Census (ACS)**, **Louisiana Workforce Commission**, **BLS**. A scaffold for future ETL lives under **`/data-pipeline`** (`README.md`, `sources.json`, `schema.md`, `ingest_placeholder.js`).

## Limitations

- Sample data and demo narratives are **not** official LDOE, LWC, or statewide calculations.  
- No proof of program **causal** impact; use for prioritization conversations and further validation only.
