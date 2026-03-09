#!/usr/bin/env node
/**
 * validate-build.js
 *
 * Pre-deploy validation suite. Catches data corruption before it ships.
 * Checks: JSON syntax, duplicate IDs, coordinate validity, timestamp freshness, file count.
 *
 * Usage: node scripts/validate-build.js
 * Exit code 1 = errors found (blocks deploy)
 * Exit code 0 = all good or only warnings
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.resolve(__dirname, '..', 'src', 'data')

let errorCount = 0
let warnCount = 0
let passCount = 0

// Colors for terminal output
const RED = '\x1b[31m'
const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const RESET = '\x1b[0m'
const BOLD = '\x1b[1m'

function error(msg) { console.log(`  ${RED}✗ ERROR${RESET}  ${msg}`); errorCount++ }
function warn(msg) { console.log(`  ${YELLOW}⚠ WARN${RESET}   ${msg}`); warnCount++ }
function ok(msg) { console.log(`  ${GREEN}✓ OK${RESET}     ${msg}`); passCount++ }

console.log(`\n${BOLD}═══════════════════════════════════════════════════${RESET}`)
console.log(`${BOLD}  PRE-DEPLOY DATA VALIDATION${RESET}`)
console.log(`${BOLD}═══════════════════════════════════════════════════${RESET}\n`)

// Expected file count (excluding UPDATE_MANIFEST.json which is operational, not data)
const EXPECTED_DATA_FILES = 24

// ─────────────────────────────────────────────────
// 1. FILE COUNT CHECK
// ─────────────────────────────────────────────────
console.log(`${BOLD}1. FILE COUNT${RESET}`)
const allJsonFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json') && f !== 'UPDATE_MANIFEST.json')
if (allJsonFiles.length >= EXPECTED_DATA_FILES) {
  ok(`Found ${allJsonFiles.length} data files (expected ${EXPECTED_DATA_FILES})`)
} else {
  error(`Expected ${EXPECTED_DATA_FILES} data files, found ${allJsonFiles.length}`)
  const expectedFiles = [
    'events.json', 'war-timeline.json', 'breaking.json', 'death-toll.json',
    'statements-timeline.json', 'war-costs.json', 'oil-tracker.json',
    'social-posts.json', 'government-statements.json', 'escalations.json',
    'gas-prices.json', 'media-perspectives.json', 'global-involvement.json',
    'hormuz-shipping.json', 'food-prices.json', 'munitions-data.json',
    'damage-data.json', 'missile-strikes.json', 'conflict-countries.json',
    'lobby-data.json', 'bases.json', 'military-assets.json',
    'metadata.json', 'site-metadata.json'
  ]
  const missing = expectedFiles.filter(f => !allJsonFiles.includes(f))
  if (missing.length > 0) {
    error(`Missing files: ${missing.join(', ')}`)
  }
}

// ─────────────────────────────────────────────────
// 2. JSON SYNTAX VALIDATION
// ─────────────────────────────────────────────────
console.log(`\n${BOLD}2. JSON SYNTAX${RESET}`)
const parsedFiles = {}
for (const file of allJsonFiles) {
  const filePath = path.join(DATA_DIR, file)
  try {
    parsedFiles[file] = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    ok(file)
  } catch (e) {
    error(`${file}: ${e.message}`)
  }
}

// ─────────────────────────────────────────────────
// 3. DATA COMPLETENESS
// ─────────────────────────────────────────────────
console.log(`\n${BOLD}3. DATA COMPLETENESS${RESET}`)

const arrayChecks = {
  'events.json': { min: 10, label: 'events' },
  'breaking.json': { min: 5, label: 'breaking news items' },
  'war-timeline.json': { min: 10, label: 'timeline entries' },
  'social-posts.json': { min: 5, label: 'social posts' },
  'escalations.json': { min: 5, label: 'escalation events' },
  'government-statements.json': { min: 5, label: 'government statements' },
  'missile-strikes.json': { min: 10, label: 'missile strikes' },
  'bases.json': { min: 5, label: 'bases' },
  'global-involvement.json': { min: 3, label: 'countries' },
}

for (const [file, check] of Object.entries(arrayChecks)) {
  const data = parsedFiles[file]
  if (!data) continue
  const arr = Array.isArray(data) ? data : []
  if (arr.length >= check.min) {
    ok(`${file}: ${arr.length} ${check.label}`)
  } else {
    error(`${file}: Only ${arr.length} ${check.label} (expected >= ${check.min})`)
  }
}

// Check nested structures
if (parsedFiles['death-toll.json']) {
  const dt = parsedFiles['death-toll.json']
  const conflicts = dt.conflicts || []
  if (conflicts.length > 0) {
    ok(`death-toll.json: ${conflicts.length} conflicts tracked`)
  } else {
    error(`death-toll.json: No conflicts found`)
  }
}

if (parsedFiles['damage-data.json']) {
  const dmg = parsedFiles['damage-data.json']
  const locations = dmg.damageLocations || []
  if (locations.length >= 10) {
    ok(`damage-data.json: ${locations.length} damage locations`)
  } else {
    error(`damage-data.json: Only ${locations.length} damage locations (expected >= 10)`)
  }
}

// ─────────────────────────────────────────────────
// 4. DUPLICATE ID CHECK
// ─────────────────────────────────────────────────
console.log(`\n${BOLD}4. DUPLICATE IDS${RESET}`)

const idArrayFiles = [
  'events.json', 'breaking.json', 'social-posts.json',
  'government-statements.json', 'escalations.json', 'missile-strikes.json',
  'bases.json', 'military-assets.json', 'war-timeline.json',
  'global-involvement.json'
]

for (const file of idArrayFiles) {
  const data = parsedFiles[file]
  if (!data) continue
  const arr = Array.isArray(data) ? data : []
  const ids = arr.map(e => e.id).filter(Boolean)
  const seen = new Set()
  const dupes = []
  for (const id of ids) {
    if (seen.has(id)) dupes.push(id)
    seen.add(id)
  }
  if (dupes.length > 0) {
    error(`${file}: Duplicate IDs: ${dupes.join(', ')}`)
  } else {
    ok(`${file}: ${ids.length} unique IDs`)
  }
}

// Check damage-data.json (nested)
if (parsedFiles['damage-data.json']) {
  const locations = parsedFiles['damage-data.json'].damageLocations || []
  const ids = locations.map(e => e.id).filter(Boolean)
  const seen = new Set()
  const dupes = []
  for (const id of ids) {
    if (seen.has(id)) dupes.push(id)
    seen.add(id)
  }
  if (dupes.length > 0) {
    error(`damage-data.json: Duplicate IDs: ${dupes.join(', ')}`)
  } else {
    ok(`damage-data.json: ${ids.length} unique IDs`)
  }
}

// ─────────────────────────────────────────────────
// 5. COORDINATE VALIDATION
// ─────────────────────────────────────────────────
console.log(`\n${BOLD}5. COORDINATES${RESET}`)

const coordFiles = [
  { file: 'events.json', nested: false },
  { file: 'missile-strikes.json', nested: false },
  { file: 'bases.json', nested: false },
  { file: 'military-assets.json', nested: false },
  { file: 'global-involvement.json', nested: false },
]

for (const { file, nested } of coordFiles) {
  const data = parsedFiles[file]
  if (!data) continue
  const arr = Array.isArray(data) ? data : []
  let badCount = 0
  let totalChecked = 0

  for (const entry of arr) {
    if (entry.lat !== undefined && entry.lng !== undefined) {
      totalChecked++
      if (entry.lat < -90 || entry.lat > 90 || entry.lng < -180 || entry.lng > 180) {
        badCount++
        error(`${file}: Invalid coords for ${entry.id || entry.name}: lat=${entry.lat}, lng=${entry.lng}`)
      }
    }
  }

  if (badCount === 0 && totalChecked > 0) {
    ok(`${file}: ${totalChecked} coordinate pairs valid`)
  } else if (totalChecked === 0) {
    warn(`${file}: No coordinates found to validate`)
  }
}

// Check damage-data.json coordinates
if (parsedFiles['damage-data.json']) {
  const locations = parsedFiles['damage-data.json'].damageLocations || []
  let bad = 0
  for (const loc of locations) {
    if (loc.lat < -90 || loc.lat > 90 || loc.lng < -180 || loc.lng > 180) {
      bad++
      error(`damage-data.json: Invalid coords for ${loc.id}: lat=${loc.lat}, lng=${loc.lng}`)
    }
  }
  if (bad === 0) {
    ok(`damage-data.json: ${locations.length} coordinate pairs valid`)
  }
}

// ─────────────────────────────────────────────────
// 6. TIMESTAMP FRESHNESS
// ─────────────────────────────────────────────────
console.log(`\n${BOLD}6. TIMESTAMP FRESHNESS${RESET}`)

const now = Date.now()
const STALE_HOURS = 48  // warn if metadata older than 48 hours

const timestampFiles = [
  { file: 'metadata.json', path: 'lastUpdated' },
  { file: 'site-metadata.json', path: 'lastUpdated' },
  { file: 'death-toll.json', path: 'lastUpdated' },
  { file: 'gas-prices.json', path: 'lastUpdated' },
  { file: 'food-prices.json', path: 'lastUpdated' },
  { file: 'hormuz-shipping.json', path: 'lastUpdated' },
  { file: 'media-perspectives.json', path: 'lastUpdated' },
]

for (const { file, path: tsPath } of timestampFiles) {
  const data = parsedFiles[file]
  if (!data) continue

  const lu = data[tsPath] || data.metadata?.[tsPath]
  if (!lu) {
    warn(`${file}: No lastUpdated timestamp found`)
    continue
  }

  const luDate = new Date(lu)
  if (isNaN(luDate.getTime())) {
    error(`${file}: Invalid timestamp: "${lu}"`)
    continue
  }

  const ageHours = (now - luDate.getTime()) / 3600000
  if (ageHours > STALE_HOURS) {
    warn(`${file}: lastUpdated is ${ageHours.toFixed(0)}h old (${lu})`)
  } else {
    ok(`${file}: lastUpdated ${ageHours.toFixed(1)}h ago`)
  }
}

// ─────────────────────────────────────────────────
// 7. CROSS-REFERENCE CHECKS
// ─────────────────────────────────────────────────
console.log(`\n${BOLD}7. CROSS-REFERENCES${RESET}`)

// Check hormuz-shipping straitStatus is valid
if (parsedFiles['hormuz-shipping.json']) {
  const validStatuses = ['effectively_closed', 'blocked', 'partially_blocked', 'open']
  const status = parsedFiles['hormuz-shipping.json'].straitStatus
  if (validStatuses.includes(status)) {
    ok(`hormuz-shipping.json: Valid straitStatus "${status}"`)
  } else {
    error(`hormuz-shipping.json: Invalid straitStatus "${status}"`)
  }
}

// Check escalation severity/category values
if (parsedFiles['escalations.json']) {
  const validSeverity = ['critical', 'high', 'medium']
  const validCategory = ['military', 'economic', 'diplomatic', 'humanitarian', 'naval']
  const esc = parsedFiles['escalations.json']
  let badSeverity = 0
  let badCategory = 0
  for (const e of esc) {
    if (!validSeverity.includes(e.severity)) badSeverity++
    if (!validCategory.includes(e.category)) badCategory++
  }
  if (badSeverity > 0) error(`escalations.json: ${badSeverity} entries with invalid severity`)
  if (badCategory > 0) error(`escalations.json: ${badCategory} entries with invalid category`)
  if (badSeverity === 0 && badCategory === 0) ok(`escalations.json: All severity/category values valid`)
}

// Check event verificationStatus values
if (parsedFiles['events.json']) {
  const validStatuses = ['confirmed', 'likely', 'rumored']
  const events = parsedFiles['events.json']
  let badStatus = 0
  for (const e of events) {
    if (e.verificationStatus && !validStatuses.includes(e.verificationStatus)) badStatus++
  }
  if (badStatus > 0) {
    error(`events.json: ${badStatus} entries with invalid verificationStatus`)
  } else {
    ok(`events.json: All verificationStatus values valid`)
  }
}

// ─────────────────────────────────────────────────
// SUMMARY
// ─────────────────────────────────────────────────
console.log(`\n${BOLD}═══════════════════════════════════════════════════${RESET}`)
console.log(`  Passed: ${GREEN}${passCount}${RESET}  |  Warnings: ${YELLOW}${warnCount}${RESET}  |  Errors: ${RED}${errorCount}${RESET}`)

if (errorCount > 0) {
  console.log(`\n  ${RED}${BOLD}FAIL — ${errorCount} error(s) found. Do not deploy.${RESET}`)
  console.log(`${BOLD}═══════════════════════════════════════════════════${RESET}\n`)
  process.exit(1)
} else if (warnCount > 0) {
  console.log(`\n  ${YELLOW}${BOLD}PASS WITH WARNINGS — Review before deploying.${RESET}`)
  console.log(`${BOLD}═══════════════════════════════════════════════════${RESET}\n`)
  process.exit(0)
} else {
  console.log(`\n  ${GREEN}${BOLD}PASS — All validation checks passed! Safe to deploy.${RESET}`)
  console.log(`${BOLD}═══════════════════════════════════════════════════${RESET}\n`)
  process.exit(0)
}
