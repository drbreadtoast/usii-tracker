#!/usr/bin/env node
/**
 * verify-update.js
 *
 * Run after every data refresh to confirm all required files were updated.
 * Checks file modification times and validates JSON integrity.
 *
 * Usage: node scripts/verify-update.js
 * Exit code 1 = CRITICAL files missed (blocks deploy)
 * Exit code 0 = All good or only warnings
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.resolve(__dirname, '..', 'src', 'data')

// File priority groups
const CRITICAL = [
  'events.json',
  'war-timeline.json',
  'breaking.json',
  'death-toll.json'
]

const HIGH = [
  'statements-timeline.json',
  'war-costs.json',
  'oil-tracker.json',
  'social-posts.json',
  'government-statements.json',
  'escalations.json',
  'gas-prices.json',
  'media-perspectives.json',
  'global-involvement.json',
  'hormuz-shipping.json',
  'food-prices.json'
]

const MEDIUM = [
  'munitions-data.json',
  'damage-data.json',
  'missile-strikes.json'
]

const LOW = [
  'conflict-countries.json',
  'lobby-data.json',
  'bases.json',
  'military-assets.json'
]

const METADATA = [
  'metadata.json',
  'site-metadata.json'
]

const ALL_FILES = [...CRITICAL, ...HIGH, ...MEDIUM, ...LOW, ...METADATA]

// Files that have a lastUpdated field (top-level or in metadata)
const FILES_WITH_TIMESTAMPS = [
  'death-toll.json',
  'metadata.json',
  'site-metadata.json',
  'gas-prices.json',
  'food-prices.json',
  'hormuz-shipping.json',
  'media-perspectives.json',
  'oil-tracker.json',
  'war-costs.json',
  'damage-data.json',
  'munitions-data.json',
  'statements-timeline.json'
]

// How recent a file modification must be to count as "updated"
const RECENCY_MINUTES = parseInt(process.argv[2]) || 120  // default 2 hours
const now = Date.now()
const threshold = now - (RECENCY_MINUTES * 60 * 1000)

// Colors for terminal output
const RED = '\x1b[31m'
const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const CYAN = '\x1b[36m'
const RESET = '\x1b[0m'
const BOLD = '\x1b[1m'

console.log(`\n${BOLD}═══════════════════════════════════════════════════${RESET}`)
console.log(`${BOLD}  DATA UPDATE VERIFICATION${RESET}`)
console.log(`${BOLD}═══════════════════════════════════════════════════${RESET}\n`)
console.log(`Checking files modified in the last ${RECENCY_MINUTES} minutes...\n`)

const updated = []
const missed = []
const errors = []

// Check each file
for (const file of ALL_FILES) {
  const filePath = path.join(DATA_DIR, file)

  // Check file exists
  if (!fs.existsSync(filePath)) {
    errors.push(`FILE MISSING: ${file}`)
    continue
  }

  // Check modification time
  const stat = fs.statSync(filePath)
  if (stat.mtimeMs >= threshold) {
    updated.push(file)
  } else {
    missed.push(file)
  }

  // Validate JSON is parseable
  try {
    JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (e) {
    errors.push(`INVALID JSON: ${file} — ${e.message}`)
  }
}

// Check lastUpdated timestamps for staleness (>24 hours)
const STALE_HOURS = 26  // slightly more than 24 to allow for timezone variance
for (const file of FILES_WITH_TIMESTAMPS) {
  const filePath = path.join(DATA_DIR, file)
  if (!fs.existsSync(filePath)) continue

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    const lu = data.lastUpdated || data.metadata?.lastUpdated
    if (lu) {
      const luDate = new Date(lu)
      const ageHours = (now - luDate.getTime()) / 3600000
      if (ageHours > STALE_HOURS) {
        errors.push(`STALE TIMESTAMP: ${file} — lastUpdated is ${ageHours.toFixed(0)}h old (${lu})`)
      }
    }
  } catch (e) {
    // Already caught above
  }
}

// Categorize missed files
const missedCritical = missed.filter(f => CRITICAL.includes(f))
const missedHigh = missed.filter(f => HIGH.includes(f))
const missedMedium = missed.filter(f => MEDIUM.includes(f))
const missedLow = missed.filter(f => LOW.includes(f))
const missedMeta = missed.filter(f => METADATA.includes(f))

// Report updated files
console.log(`${GREEN}${BOLD}UPDATED: ${updated.length}/${ALL_FILES.length} files${RESET}`)
for (const f of updated) {
  const priority = CRITICAL.includes(f) ? `${RED}CRITICAL${RESET}` :
                   HIGH.includes(f) ? `${YELLOW}HIGH${RESET}` :
                   MEDIUM.includes(f) ? `${CYAN}MEDIUM${RESET}` : 'LOW'
  console.log(`  ${GREEN}✓${RESET} ${f} [${priority}]`)
}

// Report missed files
if (missed.length > 0) {
  console.log(`\n${RED}${BOLD}MISSED: ${missed.length} files${RESET}`)
  for (const f of missed) {
    const tag = CRITICAL.includes(f) ? `${RED}${BOLD}CRITICAL!${RESET}` :
                HIGH.includes(f) ? `${YELLOW}HIGH${RESET}` :
                MEDIUM.includes(f) ? `${CYAN}MEDIUM${RESET}` : 'LOW'
    console.log(`  ${RED}✗${RESET} ${f} [${tag}]`)
  }
}

// Report errors
if (errors.length > 0) {
  console.log(`\n${RED}${BOLD}ERRORS:${RESET}`)
  for (const e of errors) {
    console.log(`  ${RED}⚠${RESET} ${e}`)
  }
}

// Summary verdict
console.log(`\n${BOLD}───────────────────────────────────────────────────${RESET}`)
if (missedCritical.length > 0) {
  console.log(`${RED}${BOLD}FAIL: ${missedCritical.length} CRITICAL files missed!${RESET}`)
  console.log(`Missing: ${missedCritical.join(', ')}`)
  console.log(`${RED}Update is INCOMPLETE. Do not deploy.${RESET}`)
  process.exit(1)
} else if (errors.length > 0) {
  console.log(`${YELLOW}${BOLD}WARNING: ${errors.length} error(s) found. Review before deploying.${RESET}`)
} else if (missedHigh.length > 0) {
  console.log(`${YELLOW}${BOLD}WARNING: ${missedHigh.length} HIGH-priority files missed. Review before deploying.${RESET}`)
  console.log(`Missing: ${missedHigh.join(', ')}`)
} else if (missed.length > 0) {
  console.log(`${GREEN}${BOLD}PASS${RESET} — All CRITICAL + HIGH files updated. ${missed.length} lower-priority files skipped.`)
} else {
  console.log(`${GREEN}${BOLD}PASS — All ${ALL_FILES.length} files updated and validated!${RESET}`)
}
console.log(`${BOLD}───────────────────────────────────────────────────${RESET}\n`)
