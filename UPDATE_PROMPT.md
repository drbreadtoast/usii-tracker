# USII Tracker — Full Website Refresh

You are performing a **complete data refresh** of usiitracker.com (the US · Israel · Iran War Tracker). Your job is to research the latest developments and update every single data file so every page on the site has the most current, accurate information with clickable sources.

Read CLAUDE.md first for full project context, then follow this procedure exactly.

---

## PHASE 1: RESEARCH

Search the web thoroughly for the latest information on ALL of these topics. Do not skip any. Open multiple searches in parallel to save time.

### Military & Conflict
- Latest Iran-Israel war developments (last 24 hours)
- New airstrikes, missile strikes, or military operations (locations, casualties, attribution)
- Strait of Hormuz status (blockade status, shipping, vessels, naval incidents)
- Military asset movements (US carrier groups, Israeli navy, Iranian forces)
- New base activity or strikes on bases
- Weapons/munitions used in recent strikes
- Damage assessments from recent strikes (infrastructure, military, civilian)

### Political & Diplomatic
- Official statements from: Trump, Rubio, Hegseth, Netanyahu, Khamenei/successor, Pezeshkian, Guterres, Kallas, Araghchi, Pope Leo XIV, and any new significant leaders
- Government statements from US, Israel, Iran, and other involved nations
- UN Security Council activity
- Diplomatic negotiations or peace proposals
- Congressional votes or legislation related to the conflict

### Economic & Energy
- Brent crude oil price (current, source: Reuters or TradingView)
- WTI crude oil price (current, source: Reuters or TradingView)
- US average gas price (current, source: AAA Gas Prices — gasprices.aaa.com)
- US diesel price (current, source: EIA)
- Natural gas price
- Food commodity prices (wheat, corn, soybeans, rice, sugar, cooking oil, coffee, beef)
- War cost estimates by country
- New aid packages or military spending

### Casualties & Humanitarian
- Updated death tolls from all sides (confirmed, estimated, rumored)
- Civilian casualties
- Displaced populations
- Humanitarian developments

### Intelligence & Media
- OSINT analyst posts (Twitter/X accounts: @sentdefender, @inikiforov, @oaboron, @NOELreports, @Faytuks, @ELINTNews, @Aurora_Intel, etc.)
- Media coverage: US left (CNN, NYT, MSNBC), US right (Fox, Daily Wire, NY Post), international (BBC, Al Jazeera, Reuters), Israeli (Times of Israel, Haaretz, Jerusalem Post), Iranian (IRNA, PressTV, Tehran Times)
- New countries becoming involved in the conflict
- Escalation events or de-escalation signals

---

## PHASE 2: UPDATE DATA FILES

Update files in this exact order. For each file, read the TAIL (last 20-30 lines) to see the current state and last ID before making changes.

### CRITICAL — Update These First

#### 1. `src/data/events.json`
- **Structure:** Top-level array, newest entries appended at end
- **Last ID:** Read tail to find current last ID (format: `evt-new-XXX`)
- **Action:** Add new events for any strikes, movements, diplomatic actions, etc. from research
- **Required fields:** `id, title, description, type, lat, lng, location, timestamp, isMajor, verificationStatus, attributedTo, sources[], socialRefs[], casualties, tags[]`
- **Valid types:** `strike, movement, naval, diplomatic, protest, infrastructure, cyber, humanitarian`
- **Valid verificationStatus:** `confirmed, likely, rumored`
- **Valid attributedTo:** `us, israel, iran, hezbollah, houthis, iraq_militias, qatar, multiple, unknown`
- **Every entry MUST have at least one source with `name` and `url`**

#### 2. `src/data/war-timeline.json`
- **Structure:** Top-level array, ordered chronologically
- **Last ID:** Read tail to find current last ID (format: `tl-XXX`)
- **Action:** Add new day entries for today's developments. Include fact-check assessments.
- **Required fields:** `id, date, time, day, dayLabel, title, description, actor, type, verificationStatus, factCheck, factCheckNote, sources[], significance`
- **Valid actors:** `us, israel, iran, hezbollah, houthis, iraq_militias, qatar, multiple`
- **Valid factCheck:** `verified, partial, disputed, false`
- **Calculate `day` field:** Day 1 = Feb 28, 2026. Count forward from there.

#### 3. `src/data/breaking.json`
- **Structure:** Top-level array, **newest entries at the TOP** (reverse chronological)
- **Last ID:** Read head to find current highest ID (format: `brk-XXX`)
- **Action:** Add new breaking news items at the TOP of the array. Remove items older than 48 hours if list exceeds 50 entries (from the bottom).
- **Required fields:** `id, text, timestamp, priority, sources[]`
- **Valid priority:** `critical, high, medium`
- **Text format:** Start with "BREAKING:" or "DAY X:" prefix

#### 4. `src/data/death-toll.json`
- **Structure:** `{lastUpdated, conflicts[]}`
- **Action:** Update casualty numbers for all parties in all conflicts. Update `lastUpdated`.
- **Conflicts tracked:** "2026 Iran War (Feb 28 - Present)" and any sub-conflicts
- **Parties per conflict:** Each has `confirmed{military, civilian, total, source, sourceUrl}`, `estimated{}`, `rumored{}`, `injured`, `displaced`, `arrested`
- **CRITICAL: Every number must have a source with URL**

### HIGH — Update These Second

#### 5. `src/data/statements-timeline.json`
- **Structure:** `{metadata{}, speakers[]}`
- **Speakers (12):** trump, rubio, hegseth, netanyahu, khamenei, pezeshkian, guterres, kallas, mojtaba_khamenei, araghchi, pope_leo, pfister
- **Action:** Add new statements to the relevant speaker's `statements[]` array. Statement IDs follow pattern: `speakerid-XXX` (e.g., `trump-015`). Check each speaker's last statement ID.
- **Required fields per statement:** `id, date, text, context, venue, factCheck, factCheckNote, source, sourceUrl`
- **If a new world leader makes significant statements, add them as a new speaker**

#### 6. `src/data/war-costs.json`
- **Structure:** `{metadata{}, daysOfConflict, countryCosts{us, israel, iran}, weaponCosts[], navalDeployments{}, aidPackages[], economicImpact{}, keyFacts[], totals{}}`
- **Action:** Update `daysOfConflict`, update cost figures, add new aid packages or weapon expenditures. Update `lastUpdated`.

#### 7. `src/data/oil-tracker.json`
- **Structure:** `{metadata{}, oilPrices{preWar{}, current{}}, keyPlayers[], hormuzImpact{}, consumerImpact{}, keyFacts[]}`
- **Action:** Update `current` oil prices (Brent + WTI), update `changePercent` and `changeDollars`, update Hormuz impact stats, update consumer fuel prices. Update `lastUpdated`.
- **Pre-war prices stay the same — only update `current` fields**

#### 8. `src/data/social-posts.json`
- **Structure:** Top-level array
- **Last ID:** Read tail (format: `social-XXX`)
- **Action:** Add new notable OSINT analyst posts. Include engagement metrics.
- **Required fields:** `id, platform, handle, displayName, text, timestamp, sourceCategory, verificationStatus, verificationNote, engagement{likes, retweets, replies}`
- **Valid sourceCategory:** `osint_analyst, lead_source`

#### 9. `src/data/government-statements.json`
- **Structure:** Top-level array
- **Last ID:** Read tail (format: `gov-XXX`)
- **Action:** Add new official government statements.
- **Required fields:** `id, platform, handle, displayName, country, text, timestamp, verificationStatus, verificationNote, engagement{}`

#### 10. `src/data/escalations.json`
- **Structure:** Top-level array
- **Last ID:** Read tail (format: `esc-XXX`)
- **Action:** Add new major escalation events ONLY if they represent significant turning points.
- **Required fields:** `id, title, description, category, severity, timestamp, impact, sources[]`
- **Valid categories:** `military, economic, diplomatic, humanitarian, naval`
- **Valid severity:** `critical, high, medium`

#### 11. `src/data/gas-prices.json`
- **Structure:** `{lastUpdated, currentAverage, preWarAverage, changePercent, unit, priceHistory[], breakdown{}, context}`
- **Action:** Update `currentAverage` with latest AAA gas price. Add new entry to `priceHistory[]`. Recalculate `changePercent`. Update `breakdown.current` if crude prices changed significantly. Update `lastUpdated`.
- **Source:** gasprices.aaa.com

#### 12. `src/data/food-prices.json`
- **Structure:** `{lastUpdated, commodities[], groceryImpact{}, context}`
- **Action:** Update commodity prices and grocery impact figures. Update `lastUpdated`.

#### 13. `src/data/media-perspectives.json`
- **Structure:** `{lastUpdated, categories[]}`
- **Categories:** `us-left, us-right, international, israeli, iranian`
- **Action:** Update with latest headlines from each category's outlets. Each outlet needs: `name, headline, timestamp, url, summary`. Update `lastUpdated`.

#### 14. `src/data/global-involvement.json`
- **Structure:** Top-level array
- **Last ID:** Read tail (format: `gi-XXX`)
- **Action:** Update existing country entries with new actions/statements. Add new countries if they've become involved.
- **Required fields:** `id, country, key, flag, lat, lng, level, summary, actions[], statements[]`
- **Valid levels:** `combatant, military_support, diplomatic, economic, observer`

#### 15. `src/data/hormuz-shipping.json`
- **Structure:** `{straitStatus, blockadeDay, lastUpdated, statistics{}, timeline[], impactedGoods[]}`
- **Action:** Update `blockadeDay` (calculate from `blockadeStartDate`), update `statistics`, add new `timeline[]` entries for shipping events. Update `lastUpdated`.
- **Valid straitStatus:** `effectively_closed, blocked, partially_blocked, open`

### MEDIUM — Update If New Strikes/Events

#### 16. `src/data/munitions-data.json`
- **Action:** Update expenditure figures, add new weapon systems if used. Update `lastUpdated`.

#### 17. `src/data/damage-data.json`
- **Structure:** `{metadata{}, summary{}, damageLocations[]}`
- **Last ID:** Read tail (format: `dmg-XXX`)
- **Action:** Add new damage sites from recent strikes. Update `summary` counts.
- **Required fields per location:** `id, name, city, country, lat, lng, category, status, date, attributedTo, damageLevel`
- **Valid categories:** `military, nuclear, civilian, infrastructure, energy`
- **Valid status:** `confirmed, reported, rumored`

#### 18. `src/data/missile-strikes.json`
- **Structure:** Top-level array
- **Last ID:** Read tail (format: `ms-XXX`)
- **Action:** Add new confirmed or reported strikes with coordinates.
- **Required fields:** `id, city, country, lat, lng, strikeType, attributedTo, date, description, source, sourceUrl, weaponType, casualties`

### LOW — Update Only If Relevant Changes

#### 19. `src/data/conflict-countries.json`
- GeoJSON FeatureCollection. Only update if a new country becomes involved.

#### 20. `src/data/lobby-data.json`
- Historical lobbying data. Rarely needs updating.

#### 21. `src/data/bases.json`
- **Last ID:** `base-013`. Only update if new bases become relevant or existing bases are struck.

#### 22. `src/data/military-assets.json`
- Only update for major naval/military deployment changes.

### METADATA — Update These LAST

#### 23. `src/data/metadata.json`
- **Update:** `lastUpdated` to current ISO timestamp, `updateNote` with brief summary of what changed, `dataFreshnessWarning` to `false`

#### 24. `src/data/site-metadata.json`
- **Update:** `lastUpdated` to current ISO timestamp, increment `conflictDay`, update `totalSocialPosts` count, update each entry in `dataFiles{}` with current date and entry counts

---

## PHASE 3: VALIDATE & DEPLOY

Run these commands in order:

```bash
npm run deploy:check
```

This runs: verify → validate → stamp-version → build

If there are errors:
1. Fix any JSON syntax errors (missing commas, trailing commas, unclosed brackets)
2. Fix any duplicate IDs
3. Fix any invalid coordinates (lat must be -90 to 90, lng must be -180 to 180)
4. Fix any invalid enum values
5. Re-run `npm run deploy:check`

Once the build passes:

```bash
git add -A
git commit -m "Day X data refresh: [brief summary of key updates]

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
git push origin main
```

Replace `X` with the current conflict day number and include a brief summary of the most significant updates.

---

## DATA INTEGRITY RULES (NON-NEGOTIABLE)

1. **NEVER delete existing entries** — append only
2. **NEVER change IDs** of existing entries
3. **ALWAYS use sequential IDs** — read the last ID in each file before adding new ones
4. **ALWAYS maintain valid JSON** — no trailing commas, proper bracket closure
5. **ALL timestamps in ISO 8601** — `"2026-03-10T18:00:00Z"`
6. **ALL sources must have `name` AND `url`** — every single one must be clickable
7. **ALL geographic entries must have valid `lat` and `lng`** — verify coordinates are in the right country
8. **ONLY use valid enum values** — check the valid options listed for each field above
9. **Update ALL `lastUpdated` timestamps** in every file you touch
10. **Pre-war baseline prices NEVER change** — only update `current` values

---

## QUALITY CHECKLIST

Before committing, verify:
- [ ] Every new entry has at least one source with a working URL
- [ ] No duplicate IDs in any file
- [ ] All timestamps are today's date (ISO 8601 format)
- [ ] `conflictDay` in site-metadata.json is correct (Day 1 = Feb 28, 2026)
- [ ] `metadata.json` updateNote summarizes what changed
- [ ] `site-metadata.json` dataFiles entries are all updated
- [ ] Breaking news has newest items at the TOP
- [ ] Oil prices, gas prices, and commodity prices are updated to latest available
- [ ] Build passes with `npm run deploy:check`
