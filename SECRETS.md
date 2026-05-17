# Secrets & Tokens

This document describes the secrets the project needs and the scopes/rotation policy. **No actual secret values live in this repo.**

## GitHub Personal Access Token (PAT) for the scheduled agent

The scheduled remote Claude Code agent that refreshes content needs to push commits to this repo.

### Recommended: fine-grained PAT

Generate at: https://github.com/settings/personal-access-tokens (NOT the legacy "Tokens (classic)" page).

**Scope:**
- **Resource owner**: your GitHub user account
- **Repository access**: Only select repositories → `us-local-foreign-affairs`
- **Repository permissions**:
  - `Contents`: Read and write
  - `Metadata`: Read (auto-included)
  - everything else: No access
- **Expiration**: 90 days (set a calendar reminder to rotate)

**Where the token goes:**

Paste it into the scheduled agent's environment (via the `/schedule` skill's secret field). Never paste it into the repo or any committed file.

### Token rotation

- Calendar reminder: every 90 days.
- To rotate: generate a new fine-grained PAT with the same scope, update the scheduled agent's env, then revoke the old token.
- If you suspect the token has leaked: revoke immediately at https://github.com/settings/personal-access-tokens, audit recent commits to `main`, and rotate.

### Why not a classic PAT?

Classic PATs grant access to all your repos by default and don't expire by default. The fine-grained variant limits blast radius if it leaks.

### Why not a GitHub App?

A GitHub App with installation tokens would be even cleaner (1-hour TTL, repo-scoped). If the `/schedule` runner supports secret rotation hooks, prefer that route. The fine-grained PAT is the pragmatic minimum.

## Vercel

Vercel auto-deploys on push to `main`. No secret needs to live in the repo for that to work — Vercel reads from GitHub via its own integration.

If you set a custom domain or need server-side env vars (e.g., `NEXT_PUBLIC_SITE_URL`), set them in the Vercel project's **Environment Variables** section. Do not commit them.

## TradingView

No API key. The Ticker Tape and chart widgets are loaded client-side from TradingView's public embed CDN. No secret needed.

## Anthropic API key (if applicable)

If the scheduled agent invokes the Anthropic API directly outside the Claude Code runtime (it shouldn't, in this setup), the key would live in the agent env. As designed (`/schedule` skill drives a Claude Code agent), no separate Anthropic key is needed.
