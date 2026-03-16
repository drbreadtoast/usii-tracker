# Full Data & News Refresh

You are performing a FULL data and news refresh for the USII Tracker (Iran-Israel War conflict tracker). This updates ALL 24 data files across ALL 16 pages with the latest news, data, and information.

**CRITICAL RULES:**
- Every source URL must be a REAL, verified link found via web search. NEVER fabricate URLs.
- Every breaking news entry must have an `eventDate` field matching when the event ACTUALLY happened.
- Gas/oil prices must stay in sync across files. Oil prices must be nested objects `{price, change}`, never flat numbers.
- War costs breakdowns must sum to totals. `dailyBurnRate` must be a number, not a string.
- Update ALL 24 files. No exceptions. No skipping fact-check, media, or government pages.

---

## STEP 1: Capture Refresh Timestamp

Run these commands to get the REAL current time:
```bash
date -u '+%Y-%m-%dT%H:%M:%SZ'
TZ='America/Los_Angeles' date '+%I:%M %p %Z on %B %d, %Y'
```

Store both values:
- **ISO_TIMESTAMP**: The UTC timestamp (e.g., `2026-03-16T10:40:00Z`) — used for all `lastUpdated` fields
- **PT_READABLE**: The human-readable PT time (e.g., `3:40 AM PDT on March 16, 2026`) — used for `metadata.json` dataFreshnessWarning

Calculate the **conflict day number**: days since Feb 28, 2026 (Day 1).

---

## STEP 2: Read Current State

1. Read `src/data/UPDATE_MANIFEST.json` to see last IDs and entry counts for all files
2. Read the TAIL (last 15-20 lines) of each CRITICAL and HIGH file to see the latest entries
3. Note the current last ID for each file that uses sequential IDs

---

## STEP 3: Parallel Research — Launch 3 Agents Simultaneously

Launch ALL THREE agents in a SINGLE message (parallel, not sequential). Each agent does thorough web research for its domain.

### Agent 1: Military & Conflict Research
**Prompt template:**
```
Today is [DATE], Day [N] of the Iran-Israel War (started Feb 28, 2026).
Research the LATEST military and conflict developments. Web search for each topic below.
For EVERY finding, record: the event, when it happened, and the REAL source URL you found it at.

Search for:
1. "Iran Israel war today" / "Iran Israel latest strikes [DATE]"
2. "Iran war casualties today" / "death toll Iran war [DATE]"
3. "IDF strikes Iran [DATE]" / "Iran missiles Israel [DATE]"
4. "Hezbollah Lebanon strikes [DATE]"
5. "Iraq militias attacks US forces [DATE]"
6. "Iran war escalation [DATE]"
7. "missile strikes Iran Israel [DATE]"
8. "Iran war damage [DATE]"

For each finding, provide:
- What happened (1-2 sentences)
- Actual event date (YYYY-MM-DD)
- Priority: critical / high / medium
- Source name and VERIFIED URL
- Location with approximate lat/lng if applicable
- Casualty numbers if mentioned
- Verification status: confirmed / likely / rumored

Files this research feeds: events.json, war-timeline.json, breaking.json, death-toll.json, escalations.json, missile-strikes.json, damage-data.json, munitions-data.json
```

### Agent 2: Political & Information Research
**Prompt template:**
```
Today is [DATE], Day [N] of the Iran-Israel War (started Feb 28, 2026).
Research the LATEST political, diplomatic, and information developments.

Search for:
1. "Trump Iran statement today" / "Biden Iran [DATE]"
2. "Netanyahu statement [DATE]" / "Israel government [DATE]"
3. "Iran Khamenei statement [DATE]" / "Iran foreign minister [DATE]"
4. "UN Iran war [DATE]" / "EU Iran response [DATE]"
5. "Iran war misinformation" / "Iran war fact check [DATE]"
6. "Iran war media coverage [DATE]"
7. "OSINT Iran" / "Iran war social media analysis [DATE]"
8. "Iran war international response [DATE]"
9. "[Speaker name] Iran war" for each of: Trump, Rubio, Hegseth, Netanyahu, Khamenei, Pezeshkian, Guterres, Kallas, Araghchi, Pope Leo

For MEDIA PERSPECTIVES — search for latest headlines from:
- US Left: CNN, MSNBC, NYT, WaPo, NPR
- US Right: Fox News, Daily Wire, NY Post, Newsmax
- International: BBC, Al Jazeera, Reuters, AFP
- Israeli: Times of Israel, Haaretz, Jerusalem Post, i24NEWS
- Iranian: PressTV, Tehran Times, IRNA, Tasnim

For each finding, provide:
- The statement/headline/claim (exact quote if possible)
- Speaker/outlet name
- Date
- Source URL (VERIFIED)
- Context/venue if applicable
- Fact-check assessment if applicable

Files this research feeds: statements-timeline.json, government-statements.json, media-perspectives.json, social-posts.json, fact-check.json, global-involvement.json
```

### Agent 3: Economic & Energy Research
**Prompt template:**
```
Today is [DATE], Day [N] of the Iran-Israel War (started Feb 28, 2026).
Research the LATEST economic and energy developments.

Search for:
1. "Brent crude oil price today" / "WTI oil price today"
2. "US gas prices today" / "AAA gas prices average"
3. "Strait of Hormuz today" / "Hormuz shipping [DATE]"
4. "Iran war economic cost" / "war spending [DATE]"
5. "food prices Iran war impact" / "wheat corn prices [DATE]"
6. "Iran war sanctions oil [DATE]"
7. "Iran war aid package Congress [DATE]"
8. "Iran oil exports [DATE]" / "OPEC Iran [DATE]"

For each finding, provide:
- The data point or development
- Date
- Source URL (VERIFIED)
- Exact numerical values where applicable (prices, percentages, dollar amounts)

CRITICAL: For oil prices, always provide as nested objects:
- Brent: {price: XX.XX, change: "+X.X%", changeDollars: "+$X.XX"}
- WTI: {price: XX.XX, change: "+X.X%", changeDollars: "+$X.XX"}
- Pre-war reference: Brent $79.84, WTI $75.51

For gas prices: Get the current AAA national average (currently ~$3.70)

Files this research feeds: oil-tracker.json, gas-prices.json, food-prices.json, hormuz-shipping.json, war-costs.json
```

---

## STEP 4: Process Research & Update Files

After all 3 agents return, update files in this EXACT order:

### TIER 1 — CRITICAL (4 files)
1. **events.json** — Add new events with sequential IDs after current last ID. Each needs: id, title, description, type, lat, lng, location, timestamp, isMajor, verificationStatus, attributedTo, sources[], tags[]
2. **war-timeline.json** — Add day's events chronologically. Each needs: id, date, time, day, dayLabel, title, description, actor, type, verificationStatus, factCheck, factCheckNote, sources[], significance
3. **breaking.json** — Replace stale entries (eventDate >24h old) with fresh ones. Each needs: id, text, timestamp, eventDate, priority, sources[]. The `eventDate` MUST be the actual date the event happened.
4. **death-toll.json** — Update casualty numbers for all parties. Update `lastUpdated`.

### TIER 2 — HIGH (11 files)
5. **statements-timeline.json** — Add new statements to appropriate speaker arrays. Update metadata.lastUpdated.
6. **war-costs.json** — Update cost figures, add new weapon costs/aid packages. Verify all math sums. Update lastUpdated.
7. **oil-tracker.json** — Update current oil prices (MUST be nested objects). Update consumer fuel prices. Verify gas price sync. Update lastUpdated.
8. **gas-prices.json** — Update currentAverage. Add new priceHistory entry. Recalculate changePercent. Update lastUpdated.
9. **food-prices.json** — Update commodity prices. Update groceryImpact. Update lastUpdated.
10. **hormuz-shipping.json** — Update straitStatus, blockadeDay, statistics. Add timeline entries. Update lastUpdated.
11. **social-posts.json** — Add new OSINT posts with sequential IDs.
12. **government-statements.json** — Add new official statements with sequential IDs.
13. **escalations.json** — Add major escalation events with sequential IDs.
14. **media-perspectives.json** — Update ALL 5 categories with fresh headlines/URLs. Update lastUpdated.
15. **global-involvement.json** — Add new actions/statements to country entries.

### TIER 3 — MEDIUM (3 files)
16. **missile-strikes.json** — Add new strike locations with coordinates and sequential IDs.
17. **damage-data.json** — Add new damage reports. Update summary counts. Update metadata.lastUpdated.
18. **munitions-data.json** — Update weapon expenditure/remaining if significant changes.

### TIER 4 — LOW (4 files, update only if relevant)
19. **conflict-countries.json** — Only if new country involved
20. **lobby-data.json** — Only if new lobbying data
21. **bases.json** — Only if bases struck or new bases relevant
22. **military-assets.json** — Only if major deployments changed

### TIER 5 — FACT CHECK (always update)
23. **fact-check.json** — Add new viral claims/rumors. Update verdicts on existing claims. Every claim needs: id, claim, summary, origin, viralPlatforms[], verdict, category, dateAdded, lastChecked, trending, sources[]. Update lastUpdated and totalClaims.

---

## STEP 5: Cross-File Consistency Checks

Before running validation, manually verify these CRITICAL sync points:

1. **Gas ↔ Oil sync:**
   - `gas-prices.json → currentAverage` must equal `oil-tracker.json → consumerImpact.fuels[Regular Gasoline].current.price`
   - `gas-prices.json → preWarAverage` must equal `oil-tracker.json → consumerImpact.fuels[Regular Gasoline].preWar.price`
   - `gas-prices.json → changePercent` must equal `((current - preWar) / preWar * 100)` rounded to 1 decimal

2. **Oil price structure:**
   - `oil-tracker.json → oilPrices.current.brent` MUST be `{price: X, change: "+Y%", ...}` — NOT a flat number
   - Same for `.wti`

3. **War costs math:**
   - Each country's `directMilitaryCosts.breakdown` values must sum to `directMilitaryCosts.total`
   - Each country's `indirectCosts.breakdown` values must sum to `indirectCosts.total`
   - `totals.allCountriesDirectMilitary` = sum of all 3 countries' direct totals
   - `totals.combinedTotalCosts` = direct + indirect totals
   - `dailyBurnRate` must be a NUMBER (not string)

4. **Hormuz barrels:**
   - `breakdownBlocked.crudeOil + refinedProducts + lngEquivalent` must equal `barrelsBlockedDaily`

5. **Site metadata counts:**
   - Count actual entries in each file and update `site-metadata.json → dataFiles` accordingly

---

## STEP 6: Validate, Build & Push

```bash
npm run deploy:check
```

This runs all validation checks (90+ checks). If errors:
- Fix the specific issues flagged
- Re-run validation until clean

If validation passes:

```bash
# Update metadata files LAST
# metadata.json: set lastUpdated, updateNote, dataFreshnessWarning
# site-metadata.json: set lastUpdated, conflictDay, all entry counts
# UPDATE_MANIFEST.json: update lastId, totalEntries, lastUpdated for each changed file

npm run build
git add [list all changed files explicitly — never use git add -A]
git commit -m "Day [N] [time] data refresh — [brief summary of key changes]"
git push
```

---

## REFERENCE: Data File Schemas

### events.json (array)
```json
{"id": "evt-new-XXX", "title": "", "description": "", "type": "strike|movement|naval|diplomatic|protest|infrastructure|cyber|humanitarian", "lat": 0, "lng": 0, "location": "", "timestamp": "ISO", "isMajor": false, "verificationStatus": "confirmed|likely|rumored", "attributedTo": "us|israel|iran|hezbollah|houthis|iraq_militias|qatar|multiple|unknown", "sources": [{"name": "", "url": ""}], "tags": []}
```

### war-timeline.json (array)
```json
{"id": "tl-XXX", "date": "YYYY-MM-DD", "time": "HH:MM", "day": N, "dayLabel": "DAY N", "title": "", "description": "", "actor": "us|israel|iran|hezbollah|houthis|iraq_militias|qatar|multiple", "type": "military|diplomatic|humanitarian|economic", "verificationStatus": "confirmed|likely|rumored", "factCheck": "verified|misleading|unverified", "factCheckNote": "", "sources": [{"name": "", "url": ""}], "significance": "critical|high|medium|low"}
```

### breaking.json (array)
```json
{"id": "brk-XXX", "text": "CATEGORY: Description", "timestamp": "ISO", "eventDate": "YYYY-MM-DD", "priority": "critical|high|medium", "sources": [{"name": "", "url": ""}]}
```

### fact-check.json claims (array inside object)
```json
{"id": "fc-XXX", "claim": "", "summary": "", "origin": "", "viralPlatforms": [], "verdict": "confirmed|debunked|likely|unlikely|unverified", "category": "", "dateAdded": "ISO", "lastChecked": "ISO", "trending": false, "sources": [{"name": "", "url": ""}]}
```
