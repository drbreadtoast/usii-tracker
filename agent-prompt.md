# TheOSSreport — Scheduled Refresh Agent (Pointer)

You are a scheduled Claude Code agent running every 6 hours (00:00 / 06:00 / 12:00 / 18:00 America/New_York). Your job is to refresh all content on TheOSSreport with deep parallel research, then commit + push so Vercel deploys the fresh build.

**The canonical procedure is `.claude/commands/refresh.md`.** Read it and execute it now.

> **Deploy target — non-negotiable.** This is a scheduled deploy job. The final commit MUST land on `main` (Vercel auto-deploys from `main`). Push directly to `main` per the playbook. If the session has placed you on an auto-generated feature branch and forbids pushing to `main`, push your refresh commit to that branch anyway and DO NOT block — a repo workflow (`.github/workflows/auto-merge-refresh.yml`) fast-forwards `chore(content): refresh` commits from `claude/**` branches into `main` automatically. Either path ends on `main`; never leave a refresh stranded on a branch with no path to `main`.

```bash
cat .claude/commands/refresh.md
```

Follow every phase exactly as written:

- **PHASE 0** — Preflight (git pull, read tails not full files)
- **PHASE 1** — Spawn 6 parallel research subagents (Politics, Foreign+War, Markets+Tech, Underreported, Live data, Money & Influence). Markets+Tech maintains the oil tracker; Money & Influence maintains the war-cost + funding trackers and the Foreign Influence incident feed.
- **PHASE 2** — Write content in priority order (CRITICAL → HIGH → MEDIUM → OPTIONAL → trackers + Foreign Influence → manifest)
- **PHASE 3** — Verify (`npm run verify`) → Validate (`npm run validate`) → Build (`npm run build`) → Commit + push

The slash command is more comprehensive than this pointer. Do not skip reading it.

---

## Non-negotiable rules (also in /refresh, repeated here for emphasis)

### Source URL rules

1. URLs are INPUTS, not OUTPUTS. Search first → collect URLs → write content.
2. NEVER fabricate URLs by pattern-matching outlet structures.
3. Every URL must respond — 404/410 = hard fail. 401/403 = warning OK.
4. Never use bare-domain URLs (`https://reuters.com/`). Find the article path.
5. Sources are `{outlet, url, title, publishedAt}` objects, not strings.

### Data integrity rules

1. NEVER delete stories from a previous run unless retracted by source.
2. NEVER change a story's `id` between runs. Continuing stories keep their `id`.
3. NEVER change `firstSeenAt` for an existing story.
4. ALL timestamps in ISO 8601 UTC (`2026-05-17T18:00:00Z`).
5. ALL `lean` values are exact enum strings (`left`, `center`, `right`, `foreign-western`, `foreign-eastern`, `foreign-global-south`, `government`, `social`).
6. State-affiliated outlets (RT, TASS, Xinhua, CGTN, Sputnik, Global Times, Mehr News, IRNA, Press TV, KCNA) must be tagged `isStateMedia: true`.
7. Pre-war / 2024-06-01 baseline values in live-data NEVER change. Only current values move.

### Context-saving tricks

- Use `tail -60 content/<file>.json` not full reads.
- Spawn all 6 subagents in ONE message (parallel, not serial).
- Each subagent spawns WebFetch calls in parallel within itself.
- The validator already runs URL checks concurrently — don't pre-flight serially.

### Commit gate

Do not commit if `npm run verify` or `npm run validate` exits non-zero. Log FAIL and exit; the next 6-hour run retries from a clean state.

---

## Why this file exists separately from /refresh

The `/schedule` skill (Anthropic's scheduled-tasks runner) requires a self-contained prompt to be configured once. This file IS that prompt. It tells the scheduled agent to execute the slash-command playbook from the repo.

When the slash-command playbook changes (and it will — we'll tune it over time), the scheduled agent picks up the new version automatically on its next run because it reads `.claude/commands/refresh.md` from the freshly-pulled repo.

If you ever need to invoke a refresh manually as a human at a keyboard, just type `/refresh` in Claude Code. Same procedure.
