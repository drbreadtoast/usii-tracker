# TheOSSreport

A multi-perspective US & foreign affairs aggregator. Stories are presented from left, center, right, and international viewpoints — with sources cited — so readers can form their own conclusions.

Content is refreshed **four times daily** (00:00, 06:00, 12:00, 18:00 ET) by a scheduled remote Claude Code agent that researches, writes, validates, and pushes content. Vercel auto-deploys on push.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS v4
- **Static-on-push** rendering — every commit triggers a Vercel build
- **TradingView widgets** for live Brent, WTI, BTC, ETH, SOL, gold, silver
- **JSON content** in `/content/` validated by `npm run validate` against `content/schema.json`
- **Source bias map** anchored on [AllSides Media Bias Ratings](https://www.allsides.com/media-bias/ratings)

## Layout

```
app/                       # Next.js App Router pages and routes
components/                # UI components (StoryCard, TickerTape, etc.)
content/                   # JSON content files updated by the agent
  schema.json              # Single source of truth (JSON Schema draft-07)
  manifest.json            # Last-updated timestamps + story counts
  headlines.json           # Top stories for the homepage hero
  us-politics.json         # Per-section files
  foreign.json
  markets.json
  ai-tech.json
  war.json
  foreign-influence.json
  underreported.json
  trackers/                # Structured metric trackers (own schema + loader)
    schema.json
    oil.json               # Follow the Oil page
    war-cost.json          # /war Daily War Cost panel
    israel-funding.json    # Foreign Influence funding tables
lib/                       # Types, content loader, bias map
scripts/
  validate-content.ts      # Validates all content against the schema
logs/                      # Append-only per-month agent run logs
agent-prompt.md            # Playbook the scheduled agent receives each run
SECRETS.md                 # GitHub PAT scope & rotation policy (no values)
```

## Local development

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Validate content

```bash
npm run validate                                 # full check (URL + freshness)
SKIP_URL_CHECK=1 SKIP_FRESHNESS=1 npm run validate   # offline / seed content
```

Validation runs:
- JSON parses
- Schema conformance (per file, plus the trackers against `content/trackers/schema.json`)
- Source URL reachability (404/410 fails; 401/403 is a warning)
- `publishedAt` within 72h (documentary sections like Foreign Influence are exempt)
- `manifest.sections.{name}.storyCount` matches actual story count

## Build & deploy

```bash
npm run build           # static build
```

Push to `main` → Vercel auto-deploys.

## Automation

The site refreshes automatically. To set up (one-time):

1. Generate a fine-grained GitHub PAT with `Contents: Read and write` on this repo (see SECRETS.md).
2. Invoke the `/schedule` skill with:
   - Cron: `0 0,6,12,18 * * *` (interpreted as America/New_York)
   - Prompt: contents of [agent-prompt.md](./agent-prompt.md)
   - Env: the GitHub PAT
3. Watch the first run. Tweak the prompt if needed and commit.

If the agent fails three runs in a row, the homepage shows a red **content >24h old** banner. Check `logs/{YYYY-MM}.log` for the failure summary.

## Content schema (overview)

Every story has:

- A neutral `headline` and `summary`
- An array of `perspectives`, each with a `lean` (`left | center | right | foreign-western | foreign-eastern | foreign-global-south | government | social`), a one-sentence `keyFraming`, a paraphrased `summary`, and 1-3 cited `sources`
- A stable `id` (reused across runs for continuing stories)
- An `importance` 1-5 used for homepage ordering
- `firstSeenAt` and `updatedAt` ISO timestamps

The full schema lives in [content/schema.json](./content/schema.json).

## Disclaimer

Not original reporting. Summaries are generated with AI assistance from cited sources under fair-use principles (no quote exceeds ~one sentence). Visit the linked outlet for full coverage. Bias categorizations follow AllSides where available; foreign-outlet groupings reflect editorial orientation, not endorsement.
