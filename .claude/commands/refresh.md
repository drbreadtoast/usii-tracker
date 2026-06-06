---
description: Deep parallel research + full content refresh — runs every section through verify + validate + commit
allowed-tools: Read, Write, Edit, Bash, WebSearch, WebFetch, Agent, Glob, Grep
argument-hint: [optional: "dry" to skip commit]
---

# /refresh — Full content refresh

You are performing a **complete deep refresh** of TheOSSreport content. Your job is to research the latest developments in every domain the site covers and update every relevant JSON file so every card, ticker, and detail page has the most current, accurate information with clickable sources.

This procedure is non-negotiable. Follow it exactly. Read `agent-prompt.md` for the canonical rules before starting if it's been more than a day since your last run.

If the user invoked `/refresh dry`, you do everything except the final `git commit && git push` — you still verify + validate, then report what would have been committed.

---

## PHASE 0 — Preflight

### 0a. Capture the start state

```bash
echo "=== /refresh start ==="
date -u +'%Y-%m-%dT%H:%M:%SZ'
TZ='America/New_York' date +'%Y-%m-%d %H:%M %Z'
TZ='America/Los_Angeles' date +'%Y-%m-%d %H:%M %Z'
git log --oneline -3
git status --short
```

**CRITICAL — pin the refresh timestamp NOW.**

The first `date -u` line above is THE canonical timestamp for this run. Copy it verbatim into a variable in your head — call it `REFRESH_TS` — and use that EXACT string for:

- `manifest.lastUpdated`
- Every `section.lastUpdated` (per-file + per-section-meta)
- Every NEW story's `updatedAt` (and `firstSeenAt` if the story is brand new in this run)
- Every UPDATED story's `updatedAt` (continuing stories keep `firstSeenAt` as-is)
- `statements.lastUpdated`
- The commit message and post-flight log

It must be valid ISO 8601 UTC with the `Z` suffix (e.g. `2026-06-01T03:51:49Z`). **Do not round to the nearest minute, do not bump it forward to "look fresh," do not invent a different time, and do not pull yesterday's example timestamp from this playbook.** Stale or fabricated timestamps make the "Last news refresh" displays lie to readers, defeating the entire point of refreshing.

If the run spans more than a few minutes between Phase 0 and Phase 2 writes, that's fine — readers see the time research started, which is what they want. The stamp is "when the snapshot was taken," not "when the file was saved."

You'll also quote this same string in commit messages and log entries.

### 0b. Pull the latest

```bash
git fetch origin main
git status --short
# If anything modified, decide: discard or include in this run?
git pull --rebase origin main
```

### 0c. Read the ground truth (NOT the whole file — just the tails)

You need to know:
- The current state declared in `manifest.json` (full read — small file)
- The current schemas in `content/schema.json` and `content/trackers/schema.json` (full read — small files)
- The last few story IDs per section file (so continuing stories get the same id)
- The current shape of the three tracker files (read in full below — small, and you rewrite values in place)

For each of these, read the TAIL only:

```bash
for f in headlines us-politics foreign markets ai-tech war eyes-on-israel underreported; do
  echo "--- $f.json (last 60 lines) ---"
  tail -60 "content/$f.json"
done
echo "--- statements.json (last 80 lines) ---"
tail -80 content/statements.json 2>/dev/null || echo "(not present)"
echo "--- trackers (full — small structured files you rewrite in place) ---"
for t in oil war-cost israel-funding; do
  echo "=== content/trackers/$t.json ==="
  cat "content/trackers/$t.json"
done
```

**Never read the full section files.** They grow daily; reading them all blows out your context. The last 60 lines have the last 2-3 stories' IDs, which is all you need.

### 0d. Note prior failures

```bash
tail -10 logs/$(date -u +'%Y-%m').log 2>/dev/null || echo "(no log yet this month)"
```

If the most recent entry is `FAIL`, skim back to understand why before starting research.

---

## PHASE 1 — Deep parallel research

Spawn **five research subagents in parallel** via the Agent tool. Each owns a fixed slice of the world; none overlap. Each returns a structured research brief — not finished content.

Send all five Agent calls in **one message** (one tool block, five Agent tool uses inside) so they run concurrently. Wait for all to return before starting Phase 2.

### Subagent A — US Politics & Statements

**Owns:** `us-politics.json`, parts of `headlines.json`, US speakers in `statements.json`.

**Research checklist (last 24h):**
- White House actions, executive orders, statements from the President
- Congressional activity: floor votes, key committee hearings, bipartisan or partisan flashpoints
- Supreme Court / federal court rulings or oral arguments of significance
- State-level news that has national implications (governor actions, attorneys general, ballot fights)
- Election news (primaries, polling shifts, candidate moves)
- Federal Reserve testimony or press conferences (unless purely market-focused — that's Subagent D's lane)
- Any major statement from named US officials: President, VP, Senate Majority/Minority Leader, Speaker, Treasury Secretary, Secretary of State, AG, key Cabinet, party chairs

**Source requirements:**
- For each story: at least one outlet from each lean tier where applicable (left, center, right). Get 2 sources per lean when possible (e.g., NYT + MSNBC for left).
- For statements: official source (whitehouse.gov, senate.gov, state.gov) PLUS one major-outlet write-up that captured the quote in context.

**Return:** 4-6 candidate stories with `{headline, perspectives_outline: [lean → list of URLs with publication times]}`, plus 1-3 candidate speaker statements.

### Subagent B — Foreign Affairs & War

**Owns:** `foreign.json`, `war.json`, foreign+war parts of `headlines.json`, foreign speakers in `statements.json`, the Iran–Israel–US war-cost tracker (`content/trackers/war-cost.json`), and the **Eyes on Israel** page — its incident feed (`content/eyes-on-israel.json`) and its funding tracker (`content/trackers/israel-funding.json`).

**Research checklist (last 24h):**
- Ukraine war: front-line developments, weapons deliveries, diplomatic talks, civilian impact
- Israel/Gaza/Lebanon: military operations, hostage news, regional diplomacy
- Iran / nuclear file: IAEA reports, sanctions, regional posture
- Russia: Kremlin statements, internal politics, energy policy, foreign ops
- China: Xi statements, Taiwan strait, South China Sea, EU/US relations
- EU: European Council, major member-state politics (UK/France/Germany/Italy/Poland), Brexit aftershocks
- ME beyond Israel/Iran: Saudi/UAE/Egypt/Turkey/Qatar moves
- Sub-Saharan Africa: Sahel, Sudan, DRC, election cycles
- Latin America: Mexico/Brazil/Argentina/Venezuela/Cuba
- South + Southeast Asia: India/Pakistan/Bangladesh, ASEAN meetings
- UN Security Council activity
- Cross-conflict: any new country becoming actively involved in any ongoing conflict

**Source diversity rule for war stories:** When covering a contested event (a strike, casualty figure, territorial claim), include perspectives from `foreign-western` (BBC/DW/Le Monde/Haaretz), `foreign-eastern` (TASS/Xinhua/RT — flagged isStateMedia), AND `center` (Reuters/AP/BBC center coverage). State-media sources MUST have `isStateMedia: true`.

**Return:** 5-8 candidate stories split between foreign affairs (non-conflict) and active conflicts, plus 1-3 candidate foreign-leader statements.

**Also for Subagent B — trackers & Eyes on Israel (return as structured briefs):**
- **War cost** (`content/trackers/war-cost.json`): refreshed `daysOfConflict`, `dailyBurnRate`, `totalCost`, per-country `directMilitaryTotal`/`dailyBurnRate`/`breakdown`, `weapons`, `economicRipple`, `keyFacts` — sourced from CBO, DoD comptroller, CSIS, SIPRI, Penn Wharton, Brown Costs of War. Every number carries `source`+`sourceUrl`.
- **Eyes on Israel incidents** (`content/eyes-on-israel.json`): 2-4 sourced stories on documented Israeli influence on US policy (legislation, votes, officials, lobbying). NEUTRAL ≤140-char headlines. Each story MUST include a right-of-reply perspective (`government` lean) citing the org/official's response. Same Story schema as other sections.
- **Funding tracker** (`content/trackers/israel-funding.json`): refreshed `organizations`, `topRecipients`, `votingCorrelations`, `keyFacts` from OpenSecrets, the FEC, ProPublica, and Senate/House roll calls. KEEP the correlation-≠-causation `disclaimer` verbatim; insights stay descriptive, never causal.

### Subagent C — Markets, Economy & Tech

**Owns:** `markets.json`, `ai-tech.json`, parts of `headlines.json`, Fed/Treasury statements in `statements.json`, and the oil/energy tracker (`content/trackers/oil.json`).

**Research checklist (last 24h):**

Markets:
- Fed action (FOMC minutes, speeches, rate decisions, balance sheet)
- Treasury statements, debt-ceiling state
- US equities: S&P, Nasdaq, Dow major moves and the driver
- Energy markets: Brent + WTI prices, OPEC+ announcements, IEA reports
- Crypto: BTC/ETH/SOL moves, regulatory news (SEC, CFTC), major exchange events
- Macro data releases (CPI, PCE, jobs, GDP)
- Earnings: only when systemically significant (mega-cap or sector bellwether)

Tech / AI:
- AI policy: executive actions, congressional hearings, EU/UK/state AI laws
- Big-tech regulation: antitrust, content moderation, Section 230
- Chip export controls (Commerce Dept actions, allied alignment)
- Major model releases or company announcements (Anthropic, OpenAI, Google, Meta, Microsoft, NVIDIA, AMD)
- Labor impact stories (AI displacement, employment shifts)

**Source requirements:** Reuters / Bloomberg / WSJ / Financial Times for market mechanics. For analysis, balance with both lean-left (NYT, Bloomberg) and lean-right (WSJ, Washington Examiner) takes.

**Return:** 3-5 markets stories, 2-3 AI/tech stories, plus the latest oil/gas/commodity baseline values for the OilHero & MarketTicker. Include `{brent, wti, usGasAvg, eggsDozen, milkGallon, rentMedianMonthly}` current + baseline (mid-2024) values with source URLs.

**Also for Subagent C — the oil tracker (`content/trackers/oil.json`):** refresh the `hormuz` status + sourced `timeline`, `gas` (current average, `priceHistory`, pump-price `breakdown`), `food` commodities + grocery basket, `keyPlayers`, `consumerImpact` fuels, and `keyFacts`. Every figure carries `source`+`sourceUrl`. Baselines (`preWar*`) NEVER change — only current values move. This is the contextual data behind the live OilHero quotes; keep it consistent with the prices you report.

### Subagent D — Underreported

**Owns:** `underreported.json`, possibly parts of `foreign.json`.

**Research checklist (last 24h):**
- Browse front pages of: BBC, Al Jazeera, DW, France24, The Hindu, SCMP, Folha, Daily Nation, Mehr News
- Identify 3-5 stories that received SUBSTANTIAL international coverage but are absent from CNN / NYT / Fox News / Washington Post / USA Today front pages right now
- Verify the absence by checking CNN/NYT/Fox homepages OR searching `site:cnn.com [topic]` and `site:nytimes.com [topic]` for last 48h
- Common categories that get underreported: African conflicts, Latin American political crises, climate disasters outside the West, internal European protests, Asia-Pacific tensions short of war

**Source requirements:** Foreign outlets primarily. Add an explicit `keyFraming` line per perspective that names the angle US wires miss (e.g., "Centers humanitarian impact on civilians, not great-power posturing").

**Return:** 3-5 underreported stories.

### Subagent E — Live data & breaking

**Owns:** the AlertTicker breaking headlines list, the OilHero price snapshot, the MarketTicker Costs tab data.

**Research checklist (last 6 hours):**
- The single most important developing story right now (for the alert ticker)
- Live oil benchmarks from TWO independent sources (TradingView's CFD for UKOIL/USOIL AND oilprice.com's published spot)
- AAA national average gas price (https://gasprices.aaa.com)
- Federal Reserve / BLS published economic indicators: most recent CPI, PCE, weekly jobless claims
- USDA / BLS food cost reference: eggs, milk, ground beef, weekly grocery basket — most recent published value
- Median US rent (Zillow / Apartment List / Realtor.com — pick one and stay consistent)

**Critical rule for live data:** Pre-war / baseline values NEVER change. Only update CURRENT values. Baselines = the value as of 2024-06-01 (mid-2024 reference point). If you don't have the baseline already in the data file, use a publicly cited source for it and never change it again.

**Return:** 1-3 breaking-story headlines, plus structured price snapshot:
```json
{
  "lastUpdated": "<ISO 8601 UTC>",
  "oil": {
    "brent": { "tradingview": 91.88, "oilpriceCom": 91.12, "changePctVsBaseline": 7.2 },
    "wti":   { "tradingview": 87.75, "oilpriceCom": 87.36, "changePctVsBaseline": 6.9 }
  },
  "costOfLiving": [
    { "name": "Gas (US avg)", "current": "$X/gal", "baseline": "$X/gal", "changePct": X },
    { "name": "Eggs (dozen)", "current": "$X", "baseline": "$X", "changePct": X },
    ...
  ]
}
```

---

## PHASE 2 — Write content

Order matters. Write CRITICAL first. If anything blocks the run, the CRITICAL files at least ship.

**Reminder on timestamps:** every `lastUpdated` / `updatedAt` you write in this phase MUST be the `REFRESH_TS` value you captured at the top of Phase 0. Do not regenerate `date -u` mid-run, do not bump it forward, do not invent a different time per section. One stamp, applied verbatim, across every file you touch this run.

### 2a. CRITICAL files

**`content/manifest.json`** — write LAST in this phase but plan now. `lastUpdated` = `REFRESH_TS`. Per-section `lastUpdated` + `storyCount` filled in after section files are written.

**`content/headlines.json`** — 3-5 stories curated from all subagents. Each story is a full copy of its origin story (don't reference; the validator checks IDs cross-match section files). Top story is importance 5; the rest importance 4.

### 2b. HIGH files

For each: `us-politics.json`, `foreign.json`, `war.json`, `markets.json`:

Open the file, jump to the end of the `stories` array. Append new stories with fresh sequential-style IDs (kebab + date stamp). For continuing stories already in the file, find them by ID and bump `updatedAt` + refresh `perspectives[].sources`.

**Per-story rules** (from `agent-prompt.md`, repeated here because they matter):
- `id`: kebab-case slug, stable. Reuse for continuing stories.
- `headline`: ≤140 chars, neutral.
- `summary`: 2-3 sentences, ≤500 chars, neutral.
- `category`: matches file (except `headlines.json` stories which keep their original category).
- `importance`: 1-5.
- `firstSeenAt`: preserve for continuing stories; `REFRESH_TS` for brand-new ones.
- `updatedAt`: always `REFRESH_TS` for stories touched this run.
- `perspectives[]`: 1-8, sorted by canonical lean order. Each has `lean`, `keyFraming` (1 sentence ≤220 chars), `summary` (2-4 sentences ≤600 chars), `sources` (1-3).
- `sources[].publishedAt` within 72h.
- Quote ≤1 sentence verbatim per source.

### 2c. MEDIUM files

`ai-tech.json`, `underreported.json` — same rules as HIGH.

### 2d. OPTIONAL files

`content/statements.json` — append new statements gathered by Subagents A and B. Reuse `id` only if the SAME quote is being updated; otherwise mint new IDs.

Schema per statement:
- `id`: kebab `speaker-topic-YYYY-MM-DD`
- `speaker`: short name ("Trump", "Xi Jinping")
- `speakerRole`: full title
- `speakerLean`: one of `red | blue | gold | green | purple | gray`
- `quote`: paraphrased OR ≤1 sentence verbatim, ≤400 chars
- `date`: YYYY-MM-DD of when the speaker said it
- `context`: 1-line venue/event description
- `sourceUrl`: published article OR official source URL
- `sourceOutlet`: outlet name

Sort the array so newest is FIRST (the card already sorts client-side, but matching keeps diffs readable).

### 2e. Trackers & Eyes on Israel

**`content/eyes-on-israel.json`** — append/refresh 2-4 sourced influence stories from Subagent B (same Story schema; neutral ≤140-char headlines; every story includes a `government` right-of-reply perspective). Set `lastUpdated` = `REFRESH_TS`. This file feeds a manifest section count like any other section.

**`content/trackers/oil.json`** (Subagent C), **`content/trackers/war-cost.json`** and **`content/trackers/israel-funding.json`** (Subagent B) — rewrite the metric values in place from the briefs:
- Top-level `lastUpdated` = `REFRESH_TS`.
- Baselines (`preWar*`, the 2024-06-01 reference points) NEVER change.
- `keyFacts` entries are OBJECTS (`{fact, source, sourceUrl, date?}`), never bare strings.
- Every numeric and every claim carries `source`+`sourceUrl`; no bare-domain URLs as primary citations.
- Append-only on `timeline`/history arrays — don't delete past entries.
- `israel-funding.json`: keep the correlation-≠-causation `disclaimer` verbatim.

Trackers are validated against `content/trackers/schema.json` by `npm run validate` (TRACKERS section). They are NOT part of `manifest.json`.

### 2f. Finalize manifest

Update `content/manifest.json`:
- `lastUpdated` = `REFRESH_TS` (same value as every section file)
- `buildId` = `refresh-<YYYY-MM-DD-HH>` derived from `REFRESH_TS` in UTC (lets you trace which refresh produced which build)
- For each section, `sections.{name}.lastUpdated` = `REFRESH_TS`, `storyCount` = actual count

If you ever notice a section file's `lastUpdated` drift away from `REFRESH_TS` while you're writing, stop and fix it before moving on — the front-end "Last news refresh" displays read `manifest.lastUpdated` directly, and if it disagrees with what readers see in story timestamps, trust in the site collapses.

---

## PHASE 3 — Verify, validate, deploy

### 3a. Verify recency

```bash
npm run verify
```

Reads `content/*.json`, checks every file's mtime and declared `lastUpdated` against priority tiers. If any CRITICAL file fails (manifest or headlines), the script exits 1.

If it fails:
- Are you sure you saved `manifest.json` and `headlines.json`? Re-check.
- Did you write to the right paths? `content/headlines.json` not `headlines.json`?
- If CRITICAL files truly weren't supposed to be touched (because nothing happened in 6 hours), still touch them with at least an updated `lastUpdated` field.

### 3b. Validate structure + integrity

```bash
npm run validate
```

Runs 8 sections of checks. Read the output. Fix every ERROR; review every WARNING.

Common error fixes:
- **Schema error** — usually a missing required field. Read the message, jump to the file, add it.
- **Duplicate ID** — happens when you mint a new ID that already exists. Inspect, rename the new one.
- **`headlines.json` story not in section file** — make sure stories you put in `headlines.json` ALSO exist in their `category` section file.
- **manifest count mismatch** — re-count `stories.length` per section, update manifest accordingly.
- **404 on URL** — drop the source. Replace with another from your research notes.
- **Stale `publishedAt`** — drop the source. Either find a more recent article or drop the perspective if it had only one source.

After fixing, run `npm run validate` again. Repeat until PASS.

### 3c. Build (sanity check)

```bash
npm run build
```

Confirms the Next.js build produces all pages (now ~18 routes, including `/follow-the-oil` and `/eyes-on-israel`) and no TypeScript errors. The `prebuild` script stamps a new `public/build-id.json` automatically.

### 3d. Commit + push

If invoked as `/refresh dry`: skip 3d and 3e. Print "DRY RUN — would commit:" and a `git diff --stat` summary.

Otherwise:

```bash
git add content/ logs/ public/build-id.json
git commit -m "chore(content): refresh $(TZ=UTC date +'%Y-%m-%d %H:%M UTC')

Stories: headlines=<N> us-politics=<N> foreign=<N> markets=<N> ai-tech=<N> war=<N> eyes-on-israel=<N> underreported=<N>
Statements: <N> new · Trackers: oil/war-cost/israel-funding refreshed
Notable: <one-line summary of biggest story of this refresh>"
git push origin main
```

Vercel auto-deploys. Open tabs see the new `build-id.json` within 60s and show the reload banner.

### 3e. Post-flight log

```bash
mkdir -p logs
echo "$(date -u +'%Y-%m-%dT%H:%M:%SZ') OK headlines=<N> us-politics=<N> foreign=<N> markets=<N> ai-tech=<N> war=<N> eyes-on-israel=<N> underreported=<N> statements=<N> trackers=3 dry=<true|false>" >> logs/$(date -u +'%Y-%m').log
```

If you failed at validate and DID NOT commit, log `FAIL` with the reason:

```bash
echo "$(date -u +'%Y-%m-%dT%H:%M:%SZ') FAIL validate=stale_url:<count>" >> logs/$(date -u +'%Y-%m').log
```

---

## QUALITY CHECKLIST (verify before commit)

- [ ] Every section file has at least 1 new or updated story this run (or its `lastUpdated` is bumped with an explanation)
- [ ] `headlines.json` has 3-5 stories, all `importance >= 4`
- [ ] Every story has perspectives from at least 2 different leans (3+ ideal); single-lean stories include a `Limited coverage` UI note
- [ ] Every `source.url` is the specific article, not a homepage or section page
- [ ] State-affiliated outlets (RT, TASS, Xinhua, CGTN, Sputnik, Global Times, Mehr News, IRNA, Press TV, KCNA) have `isStateMedia: true`
- [ ] Every `publishedAt` is within 72h of now
- [ ] `manifest.lastUpdated`, every `section.lastUpdated`, every touched `story.updatedAt`, and `statements.lastUpdated` are all the EXACT `REFRESH_TS` captured in Phase 0a — character-for-character identical
- [ ] `manifest.sections.{name}.storyCount` matches actual `stories.length` for every section
- [ ] `content/eyes-on-israel.json` stories each include a `government` right-of-reply perspective; headlines stay neutral
- [ ] The three `content/trackers/*.json` files have `lastUpdated` = `REFRESH_TS`, baselines unchanged, every figure sourced, `keyFacts` as objects
- [ ] `content/trackers/israel-funding.json` retains the correlation-≠-causation disclaimer verbatim
- [ ] `npm run verify` exits 0
- [ ] `npm run validate` exits 0 (or 0 with only known-acceptable warnings like bot-protected URLs)
- [ ] `npm run build` succeeds
- [ ] Commit message names the biggest story of the run in one line

---

## SOURCE URL RULES (read every run — non-negotiable)

1. **URLs are INPUTS, not OUTPUTS.** Search first → collect URLs → write content. Never write a story then go look for URLs that fit.
2. **NEVER fabricate URLs by pattern-matching an outlet's structure.** Search for the actual article.
3. **Every URL must respond.** 404/410 = hard fail and gets stripped by the validator.
4. **Never use bare-domain URLs.** `https://reuters.com/` is not a citation. Find the article path.
5. **Sources must be `{outlet, url, title, publishedAt}` objects**, not strings.

---

## DATA INTEGRITY RULES (read every run — non-negotiable)

1. **NEVER delete stories from a previous run** unless the story has been retracted by all original sources.
2. **NEVER change a story's `id`** between runs. Continuing stories keep their `id`.
3. **NEVER change `firstSeenAt`** for an existing story.
4. **ALL timestamps in ISO 8601 UTC** (`2026-05-17T18:00:00Z`).
5. **ALL `lean` values must be exact enum strings.**
6. **State-affiliated outlets must be tagged `isStateMedia: true`.**

---

## FAILURE MODES

| Failure | Response |
|---|---|
| WebSearch returns no useful results for a section | Ship fewer stories in that section. Do NOT fabricate to fill the quota. |
| `npm run verify` fails on CRITICAL | You skipped writing `manifest.json` or `headlines.json`. Write them and re-verify. |
| `npm run validate` fails on schema | Read the path in the error message. Open that file, fix the missing/wrong field, re-validate. |
| `npm run validate` fails on URL 404 | Drop that source. Replace from your research notes OR remove the perspective entirely if it had only one source. |
| `git push` rejected (non-fast-forward) | Another agent committed first. `git pull --rebase origin main` and retry once. If still failing, log FAIL and exit. |
| Schema has changed since last run | Halt. Write `SCHEMA_CHANGE` entry in the log. Do NOT try to bridge. Humans handle migrations. |
| Build fails (Next.js compile error) | Likely a content file has a structural issue Ajv missed. Read the error, fix, rebuild. If it's a code issue (not content), HALT and log — that's a code regression, not your problem. |

---

## CONTEXT-SAVING TRICKS

- Use `tail -60` not full file reads.
- Spawn all 5 subagents in parallel (one message, five Agent tool uses).
- Each subagent should also spawn WebFetch calls in parallel within itself.
- The validator already runs URL checks concurrently — don't pre-flight URLs serially.
- If you're about to read a 2000-line section file in full, stop. The tail has what you need.

---

## REMINDERS

- **Diversity > completeness.** 2 stories with 3 well-sourced perspectives beat 5 stories with 1 perspective.
- **Neutral framing in `headline` and `summary`.** Spin lives in `perspectives[].keyFraming`.
- **State media is labeled, not censored.** Tag `isStateMedia: true` and let readers decide.
- **The site is read globally.** Audiences open it from Jerusalem, Tehran, DC, Moscow, Beijing, San Francisco. Avoid US-only framing in your summary text.
- **Brent and WTI baseline prices (pre-war / 2024-06-01) NEVER change.** Only current values move.
- **If you can't verify it, omit it.** Hallucinated news destroys the site's value permanently.
