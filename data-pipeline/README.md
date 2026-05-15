# Louisiana Opportunity Navigator — data pipeline

This directory is a **scaffold** for future ingestion of official public datasets. The running app today uses **sample parish-level records** in `client/src/data/parishes.js`; nothing in this folder is executed by the web app automatically.

## Intended sources

- **Louisiana Department of Education** — performance, attendance, enrollment, report cards  
- **NCES EDGE** — school geocodes and geography layers  
- **U.S. Census Bureau (ACS)** — demographics and poverty context  
- **Louisiana Workforce Commission** — occupational projections and regional demand  
- **Bureau of Labor Statistics** — employment and wage estimates  

## Future flow

1. **Raw downloads** — versioned pulls from agency portals or APIs  
2. **Clean files** — validated CSV/Parquet with documented columns  
3. **Normalized parish table** — one row per parish with aligned keys  
4. **Exported JSON or database** — consumed by the API (`/api/parishes`) instead of static demo data  

See `sources.json` for a structured registry and `schema.md` for target parish-level fields.

## Scripts

`ingest_placeholder.js` documents steps and TODOs only; it does **not** scrape or download data.
