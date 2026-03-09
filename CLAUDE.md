# CLAUDE.md — Iran-Israel Conflict Tracker (LIVEFRONT)

## Project Overview
Live conflict tracking website for the 2026 Iran-Israel War. Built with React 19 + Vite 7 + Tailwind CSS 4.
All data is static JSON imported at build time — no API, no backend, no database.
Updated manually 1-3x daily via Claude Code. Deployed as a static site.

## Tech Stack
- React 19.2.4, React DOM 19.2.4
- React Router DOM 7.13.1
- Vite 7.3.1 + @vitejs/plugin-react 5.1.4
- Tailwind CSS 4.2.1 via @tailwindcss/vite
- Leaflet 1.9.4 + react-leaflet 5.0.0 (interactive maps)
- Lucide React 0.577.0 (icons — use ONLY lucide-react for icons)
- date-fns 4.1.0

## Commands
- Dev server: `npm run dev` (port 5173)
- Build: `npm run build` (outputs to dist/)
- Verify update: `npm run verify` (checks all files were updated)
- Validate data: `npm run validate` (checks JSON integrity, duplicate IDs, coordinates)
- Safe build: `npm run build:safe` (validate + build)
- Full deploy check: `npm run deploy:check` (verify + validate + build)

## Project Structure
```
src/
  App.jsx              — Router with 16 routes
  main.jsx             — Entry point
  index.css            — Global styles (Tailwind)
  data/                — 24 JSON data files (ALL DATA LIVES HERE)
  hooks/
    useEvents.js       — Imports: events, social-posts, breaking, death-toll, metadata
    useFilters.js      — Filter state management
  components/
    Map/ConflictMap.jsx           — Imports: bases, hormuz-shipping, conflict-countries,
                                    missile-strikes, global-involvement, military-assets
    Layout/Escalations.jsx        — Imports: escalations.json
    Layout/DeathToll.jsx          — Receives data via props from useEvents
    Layout/BreakingBanner.jsx     — Receives data via props
    Layout/FilterPanel.jsx        — Filter UI
    Layout/NavBar.jsx             — Navigation bar for sub-pages
    Layout/UpdateBadge.jsx        — "Last updated" indicator
    Media/MediaPerspectives.jsx   — Imports: media-perspectives.json
    Media/GovernmentStatements.jsx — Imports: government-statements.json
    Energy/GasPriceTracker.jsx    — Imports: gas-prices.json
    Energy/FoodImpact.jsx         — Imports: food-prices.json
    Energy/HormuzStatus.jsx       — Imports: hormuz-shipping.json
    Commodities/CommodityTicker.jsx — Imports: gas-prices.json, food-prices.json
  pages/
    Dashboard.jsx                 — Main page, uses useEvents + useFilters
    TimelinePage.jsx              — Imports: war-timeline.json
    BreakingNewsPage.jsx          — Imports: breaking.json
    EventsPage.jsx                — Uses useEvents hook
    EscalationsPage.jsx           — Uses Escalations component
    SocialPage.jsx                — Uses useEvents hook
    MediaPage.jsx                 — Uses MediaPerspectives component
    GovernmentPage.jsx            — Uses GovernmentStatements component
    EnergyPage.jsx                — Uses Energy sub-components
    DeathsPage.jsx                — Uses useEvents hook
    FollowTheMoneyPage.jsx        — Imports: lobby-data.json
    FollowTheOilPage.jsx          — Imports: oil-tracker.json
    FollowTheMunitionsPage.jsx    — Imports: munitions-data.json
    FollowTheCostPage.jsx         — Imports: war-costs.json
    FollowTheStatementsPage.jsx   — Imports: statements-timeline.json
    FollowTheDamagePage.jsx       — Imports: damage-data.json
```

## Routes (16 total)
`/` Dashboard, `/timeline`, `/breaking-news`, `/events`, `/escalations`, `/social`, `/media`, `/government`, `/energy`, `/deaths`, `/follow-the-money`, `/follow-the-oil`, `/follow-the-munitions`, `/follow-the-cost`, `/follow-the-statements`, `/follow-the-damage`

---

## Data Files — Complete Reference (24 files)

### CRITICAL — Update EVERY time (4 files)

**events.json** — Main event entries (63 entries)
- Structure: Top-level array
- IDs: `evt-001` through `evt-048`, then `evt-new-001` through `evt-new-015`
- Schema: `{id, title, description, type, lat, lng, location, timestamp, isMajor, verificationStatus, attributedTo, sources[], socialRefs[], casualties, tags[]}`
- Valid types: strike, movement, naval, diplomatic, protest, infrastructure, cyber, humanitarian
- Valid verificationStatus: confirmed, likely, rumored
- Valid attributedTo: us, israel, iran, hezbollah, houthis, iraq_militias, qatar, multiple, unknown

**war-timeline.json** — Day-by-day timeline (73 entries)
- Structure: Top-level array
- IDs: `tl-001` through `tl-073`
- Schema: `{id, date, time, day, dayLabel, title, description, actor, type, verificationStatus, factCheck, factCheckNote, sources[], significance}`
- Valid actors: us, israel, iran, hezbollah, houthis, iraq_militias, qatar, multiple

**breaking.json** — Breaking news ticker (28 entries)
- Structure: Top-level array
- IDs: `brk-001` through `brk-018` (some gaps from deletions)
- Schema: `{id, text, timestamp, priority, sources[]}`
- Valid priority: critical, high, medium

**death-toll.json** — Casualty tracking
- Structure: `{lastUpdated, conflicts[{name, period, parties[]}]}`
- 3 conflicts: "Iran War", "Lebanon Front", "Iraq/Proxy Front"
- Each party has: `{name, flag, confirmed{military, civilian, total, source, sourceUrl}, estimated{...}, rumored{total, military, civilian, note, socialSources[]}, injured, displaced, arrested}`

### HIGH — Update every time (11 files)

**statements-timeline.json** — Political statements (72 statements, 12 speakers)
- Structure: `{metadata{}, speakers[{id, name, title, country, color, shortName, statements[]}]}`
- Speaker IDs: trump, rubio, hegseth, netanyahu, khamenei, pezeshkian, guterres, kallas, mojtaba_khamenei, araghchi, pope_leo, pfister
- Statement schema: `{id, date, text, context, venue, factCheck, factCheckNote, source, sourceUrl}`

**war-costs.json** — Financial tracking
- Structure: `{metadata{}, daysOfConflict, lastUpdated, countryCosts{us, israel, iran}, weaponCosts[], navalDeployments{}, aidPackages[], economicImpact{}, keyFacts[], totals{}}`

**oil-tracker.json** — Oil market data
- Structure: `{metadata{}, oilPrices{preWar{brent, wti}, current{brent, wti, changePercent}}, keyPlayers[], hormuzImpact{}, consumerImpact{}, keyFacts[]}`

**social-posts.json** — OSINT social media (29 posts)
- Structure: Top-level array
- IDs: `social-001` through `social-019` (some gaps)
- Schema: `{id, platform, handle, displayName, text, timestamp, sourceCategory, verificationStatus, verificationNote, engagement{likes, retweets, replies}}`
- Valid sourceCategory: osint_analyst, lead_source

**government-statements.json** — Official government statements (25 entries)
- Structure: Top-level array
- IDs: `gov-001` through `gov-025`
- Schema: `{id, platform, handle, displayName, country, text, timestamp, verificationStatus, verificationNote, engagement{}}`

**escalations.json** — Major escalation events (20 entries)
- Structure: Top-level array
- IDs: `esc-001` through `esc-019` (plus `esc-011b`)
- Schema: `{id, title, description, category, severity, timestamp, impact, sources[]}`
- Valid categories: military, economic, diplomatic, humanitarian, naval
- Valid severity: critical, high, medium

**gas-prices.json** — US gas price tracking
- Structure: `{lastUpdated, currentAverage, preWarAverage, changePercent, unit, priceHistory[{date, price, label?, isEvent?}], formula, breakdown{preWar{}, current{}}, context}`

**media-perspectives.json** — Media coverage comparison
- Structure: `{lastUpdated, categories[{id, label, color, icon, outlets[{name, headline, timestamp, url, summary}]}]}`
- Categories: us-left, us-right, international, israeli, iranian

**global-involvement.json** — Country involvement (6 countries)
- Structure: Top-level array
- IDs: gi-russia, gi-china, gi-eu, gi-france, gi-germany, gi-switzerland
- Schema: `{id, country, key, flag, lat, lng, level, summary, actions[{date, type, text}], statements[{date, speaker, text}]}`
- Valid levels: combatant, military_support, diplomatic, economic, observer

**hormuz-shipping.json** — Strait of Hormuz status
- Structure: `{straitStatus, blockadeDay, blockadeStartDate, lastUpdated, statistics{}, timeline[{date, event, status, barrels}], impactedGoods[]}`
- Valid straitStatus: effectively_closed, blocked, partially_blocked, open

**food-prices.json** — Food/commodity prices
- Structure: `{lastUpdated, commodities[{name, unit, preWar, current, change, detail}], groceryImpact{preWarWeekly, currentWeekly, changePercent, averageWeeklyIncrease}, context}`

### MEDIUM — Update with new strikes/events (3 files)

**munitions-data.json** — Weapons tracking (1,169 lines)
- Complex nested structure with metadata, weapon categories, inventory tiers
- No sequential IDs — entries indexed by weapon name/type

**damage-data.json** — Damage locations (51 sites)
- Structure: `{metadata{}, summary{totalSites, countriesAffected, confirmed, reported, rumored, categories{}}, damageLocations[]}`
- IDs: `dmg-001` through `dmg-051`

**missile-strikes.json** — Strike locations (51 strikes)
- Structure: Top-level array
- IDs: `ms-001` through `ms-051`
- Schema: `{id, city, country, lat, lng, strikeType, attributedTo, date, description, source, sourceUrl, weaponType, casualties}`

### LOW — Update as needed (4 files)

**conflict-countries.json** — GeoJSON FeatureCollection (12 countries)
- Only update when a new country becomes involved in the conflict
- Countries: Iran, Israel, Iraq, Syria, Lebanon, Yemen, Kuwait, Bahrain, Qatar, Azerbaijan, Saudi Arabia, Cyprus

**lobby-data.json** — Historical lobbying data (2024 cycle)
- Rarely needs updating

**bases.json** — Military base locations (13 bases)
- IDs: `base-001` through `base-013`
- Only update if new bases become relevant or bases are struck

**military-assets.json** — Naval/military asset positions (10 assets)
- IDs: asset-type-based (e.g., `asset-us-cvn-68`, `asset-isr-dolphin`)
- Only update for major deployments/changes

### METADATA — Update LAST (2 files)

**metadata.json** — `{lastUpdated, updateNote, dataFreshnessWarning}`
**site-metadata.json** — `{lastUpdated, updateFrequency, version, conflictDay, totalSocialPosts, dataFiles{}}`

---

## Shared Data Imports (components that import the same file)
- `hormuz-shipping.json` → HormuzStatus.jsx AND ConflictMap.jsx
- `breaking.json` → BreakingNewsPage.jsx AND useEvents.js
- `gas-prices.json` → GasPriceTracker.jsx AND CommodityTicker.jsx
- `food-prices.json` → FoodImpact.jsx AND CommodityTicker.jsx

---

## Update Procedure

### Full Refresh
1. Read UPDATE_MANIFEST.json for the checklist
2. Research latest developments from news/OSINT sources
3. Update files in order: CRITICAL → HIGH → MEDIUM → LOW → METADATA
4. For each file:
   - Read TAIL only (last 10-20 entries) to see current state + last ID
   - Append new entries with sequential IDs (next after last)
   - Update lastUpdated timestamps
   - Ensure valid JSON
5. Run: `npm run deploy:check`
6. If all pass → commit and push

### Partial Update
1. Update only specified files
2. Always also update metadata.json and site-metadata.json
3. Run: `npm run build:safe`

### Data Integrity Rules
- NEVER delete existing entries (append only)
- NEVER change IDs of existing entries
- ALWAYS use sequential IDs (check last ID before adding)
- ALWAYS maintain valid JSON (no trailing commas)
- ALWAYS update lastUpdated fields
- Sources must include name and URL
- Events/strikes must have valid lat/lng coordinates
- verificationStatus: confirmed | likely | rumored
- All timestamps: ISO 8601 format "2026-03-09T18:00:00Z"

---

## Growth Management
- Current total: ~13,200 lines / ~632 KB across 24 files
- Growth rate: ~100-200 lines/day
- At ~20,000 lines (Day 45-60): Archive old entries from war-timeline and events
- Archive to: `src/data/archive/` with monthly files
- Read TAIL of files during updates — never need to read entire files
