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
// 8. SOURCE URL VALIDATION
// ─────────────────────────────────────────────────
console.log(`\n${BOLD}8. SOURCE URLS${RESET}`)

// Check that key files have sources on all entries
const sourceChecks = [
  {
    file: 'breaking.json',
    getEntries: (d) => (Array.isArray(d) ? d : []),
    check: (entry) => {
      if (!entry.sources || entry.sources.length === 0) return 'missing sources'
      for (const src of entry.sources) {
        if (typeof src === 'string') return 'string-only source (no URL)'
        if (!src.url) return 'source missing url'
        if (!src.name) return 'source missing name'
      }
      return null
    }
  },
  {
    file: 'escalations.json',
    getEntries: (d) => (Array.isArray(d) ? d : []),
    check: (entry) => {
      if (!entry.sources || entry.sources.length === 0) return 'missing sources'
      for (const src of entry.sources) {
        if (!src.url) return 'source missing url'
        if (!src.name) return 'source missing name'
      }
      return null
    }
  },
  {
    file: 'media-perspectives.json',
    getEntries: (d) => (d.categories || []).flatMap(c => (c.outlets || []).map(o => ({ ...o, _cat: c.id }))),
    check: (entry) => {
      if (!entry.url) return 'missing url'
      // Check for bare domain URLs (no path)
      try {
        const u = new URL(entry.url)
        if (u.pathname === '/' && !u.search && !u.hash) return `bare domain URL: ${entry.url}`
      } catch { return `invalid URL: ${entry.url}` }
      return null
    }
  },
]

for (const { file, getEntries, check } of sourceChecks) {
  const data = parsedFiles[file]
  if (!data) continue
  const entries = getEntries(data)
  let issues = 0
  for (const entry of entries) {
    const problem = check(entry)
    if (problem) {
      issues++
      warn(`${file}: ${entry.id || entry.name || 'entry'}: ${problem}`)
    }
  }
  if (issues === 0) {
    ok(`${file}: All ${entries.length} entries have valid sources`)
  }
}

// Check for bare domain URLs across all source arrays
const bareDomainCheck = [
  { file: 'events.json', getUrls: (d) => (Array.isArray(d) ? d : []).flatMap(e => (e.sources || []).map(s => s.url).filter(Boolean)) },
  { file: 'war-timeline.json', getUrls: (d) => (Array.isArray(d) ? d : []).flatMap(e => (e.sources || []).map(s => s.url).filter(Boolean)) },
  { file: 'missile-strikes.json', getUrls: (d) => (Array.isArray(d) ? d : []).map(e => e.sourceUrl).filter(Boolean) },
]

for (const { file, getUrls } of bareDomainCheck) {
  const data = parsedFiles[file]
  if (!data) continue
  const urls = getUrls(data)
  let bareCount = 0
  for (const url of urls) {
    try {
      const u = new URL(url)
      if (u.pathname === '/' && !u.search) bareCount++
    } catch { /* invalid URL already caught elsewhere */ }
  }
  if (bareCount > 0) {
    warn(`${file}: ${bareCount} bare domain URLs found (should link to specific articles)`)
  } else if (urls.length > 0) {
    ok(`${file}: ${urls.length} source URLs have article paths`)
  }
}

// ─────────────────────────────────────────────────
// 9. CROSS-FILE CONSISTENCY
// ─────────────────────────────────────────────────
console.log(`\n${BOLD}9. CROSS-FILE CONSISTENCY${RESET}`)

// Gas price consistency: gas-prices.json vs oil-tracker.json consumer fuel
if (parsedFiles['gas-prices.json'] && parsedFiles['oil-tracker.json']) {
  const gas = parsedFiles['gas-prices.json']
  const oil = parsedFiles['oil-tracker.json']
  const oilGas = oil.consumerImpact?.fuels?.find(f => f.type === 'Regular Gasoline')

  if (oilGas) {
    // Price match
    if (gas.currentAverage === oilGas.current.price) {
      ok(`Gas price matches: gas-prices ($${gas.currentAverage}) = oil-tracker ($${oilGas.current.price})`)
    } else {
      error(`Gas price MISMATCH: gas-prices.json ($${gas.currentAverage}) ≠ oil-tracker.json ($${oilGas.current.price})`)
    }

    // Pre-war match
    if (gas.preWarAverage === oilGas.preWar.price) {
      ok(`Pre-war gas matches: gas-prices ($${gas.preWarAverage}) = oil-tracker ($${oilGas.preWar.price})`)
    } else {
      error(`Pre-war gas MISMATCH: gas-prices.json ($${gas.preWarAverage}) ≠ oil-tracker.json ($${oilGas.preWar.price})`)
    }
  }

  // Gas changePercent math check
  const gasPctCalc = parseFloat(((gas.currentAverage - gas.preWarAverage) / gas.preWarAverage * 100).toFixed(1))
  if (Math.abs(gas.changePercent - gasPctCalc) < 0.2) {
    ok(`Gas changePercent math: ${gas.changePercent}% ≈ calc ${gasPctCalc}%`)
  } else {
    error(`Gas changePercent WRONG: stored ${gas.changePercent}% ≠ calc ${gasPctCalc}%`)
  }

  // Oil price structure check (must be nested objects, not flat numbers)
  const cur = oil.oilPrices?.current
  if (cur) {
    if (typeof cur.brent === 'object' && cur.brent.price != null) {
      ok(`Oil current.brent is nested object (price: $${cur.brent.price})`)
    } else {
      error(`Oil current.brent is NOT a nested object — will crash site! Got: ${typeof cur.brent}`)
    }
    if (typeof cur.wti === 'object' && cur.wti.price != null) {
      ok(`Oil current.wti is nested object (price: $${cur.wti.price})`)
    } else {
      error(`Oil current.wti is NOT a nested object — will crash site! Got: ${typeof cur.wti}`)
    }

    // Oil % math check
    if (cur.brent?.price && oil.oilPrices.preWar?.brent?.price) {
      const bPre = oil.oilPrices.preWar.brent.price
      const bNow = cur.brent.price
      const bCalc = `+${((bNow - bPre) / bPre * 100).toFixed(1)}%`
      if (cur.brent.change === bCalc) {
        ok(`Brent change math: ${cur.brent.change} = calc ${bCalc}`)
      } else {
        error(`Brent change WRONG: stored ${cur.brent.change} ≠ calc ${bCalc}`)
      }
    }
    if (cur.wti?.price && oil.oilPrices.preWar?.wti?.price) {
      const wPre = oil.oilPrices.preWar.wti.price
      const wNow = cur.wti.price
      const wCalc = `+${((wNow - wPre) / wPre * 100).toFixed(1)}%`
      if (cur.wti.change === wCalc) {
        ok(`WTI change math: ${cur.wti.change} = calc ${wCalc}`)
      } else {
        error(`WTI change WRONG: stored ${cur.wti.change} ≠ calc ${wCalc}`)
      }
    }
  }

  // Consumer fuel math check (all fuels)
  if (oil.consumerImpact?.fuels) {
    for (const fuel of oil.consumerImpact.fuels) {
      const pre = fuel.preWar.price
      const cur = fuel.current.price
      const calcPct = `+${((cur - pre) / pre * 100).toFixed(1)}%`
      const calcDol = `+$${(cur - pre).toFixed(2)}`
      if (fuel.changePercent !== calcPct) {
        error(`${fuel.type} changePercent WRONG: ${fuel.changePercent} ≠ calc ${calcPct}`)
      }
      if (fuel.change !== calcDol) {
        error(`${fuel.type} change WRONG: ${fuel.change} ≠ calc ${calcDol}`)
      }
    }
    ok(`Consumer fuel price math verified for ${oil.consumerImpact.fuels.length} fuel types`)
  }

  // Household impact sum check
  if (oil.consumerImpact?.householdImpact) {
    const hh = oil.consumerImpact.householdImpact
    const hhSum = hh.breakdown.reduce((s, b) => s + b.monthlyIncrease, 0)
    if (hhSum === hh.averageMonthlyIncrease) {
      ok(`Household breakdown sum $${hhSum} = stored $${hh.averageMonthlyIncrease}`)
    } else {
      error(`Household breakdown MISMATCH: sum $${hhSum} ≠ stored $${hh.averageMonthlyIncrease}`)
    }
    if (hh.annualizedCost === hh.averageMonthlyIncrease * 12) {
      ok(`Household annualized $${hh.annualizedCost} = $${hh.averageMonthlyIncrease} × 12`)
    } else {
      error(`Household annualized WRONG: $${hh.annualizedCost} ≠ $${hh.averageMonthlyIncrease} × 12`)
    }
  }

  // Hormuz barrel breakdown sum
  if (oil.hormuzImpact?.breakdownBlocked) {
    const hz = oil.hormuzImpact
    const hzSum = hz.breakdownBlocked.crudeOil + hz.breakdownBlocked.refinedProducts + hz.breakdownBlocked.lngEquivalent
    if (hz.barrelsBlockedDaily === hzSum) {
      ok(`Hormuz blocked total ${hz.barrelsBlockedDaily / 1e6}M = breakdown sum ${hzSum / 1e6}M`)
    } else {
      error(`Hormuz blocked MISMATCH: total ${hz.barrelsBlockedDaily / 1e6}M ≠ breakdown ${hzSum / 1e6}M`)
    }
  }
}

// War costs math check
if (parsedFiles['war-costs.json']) {
  const wc = parsedFiles['war-costs.json']
  const { us, israel, iran } = wc.countryCosts || {}
  if (us && israel && iran) {
    const totalDirect = (us.directMilitaryCosts?.total || 0) + (israel.directMilitaryCosts?.total || 0) + (iran.directMilitaryCosts?.total || 0)
    const totalIndirect = (us.indirectCosts?.total || 0) + (israel.indirectCosts?.total || 0) + (iran.indirectCosts?.total || 0)
    const combined = totalDirect + totalIndirect

    if (wc.totals?.allCountriesDirectMilitary === totalDirect) {
      ok(`War costs direct total $${(totalDirect / 1e9).toFixed(1)}B matches`)
    } else {
      error(`War costs direct MISMATCH: stored $${(wc.totals?.allCountriesDirectMilitary / 1e9).toFixed(1)}B ≠ calc $${(totalDirect / 1e9).toFixed(1)}B`)
    }
    if (wc.totals?.allCountriesIndirectCosts === totalIndirect) {
      ok(`War costs indirect total $${(totalIndirect / 1e9).toFixed(1)}B matches`)
    } else {
      error(`War costs indirect MISMATCH: stored $${(wc.totals?.allCountriesIndirectCosts / 1e9).toFixed(1)}B ≠ calc $${(totalIndirect / 1e9).toFixed(1)}B`)
    }
    if (wc.totals?.combinedTotalCosts === combined) {
      ok(`War costs combined $${(combined / 1e9).toFixed(1)}B matches`)
    } else {
      error(`War costs combined MISMATCH: stored $${(wc.totals?.combinedTotalCosts / 1e9).toFixed(1)}B ≠ calc $${(combined / 1e9).toFixed(1)}B`)
    }

    // Check each country's breakdown sums
    for (const [name, data] of [['US', us], ['Israel', israel], ['Iran', iran]]) {
      if (data.directMilitaryCosts?.breakdown) {
        const sum = Object.values(data.directMilitaryCosts.breakdown).reduce((s, v) => s + (v.amount || 0), 0)
        if (sum === data.directMilitaryCosts.total) {
          ok(`${name} direct breakdown sum matches total`)
        } else {
          error(`${name} direct breakdown MISMATCH: sum $${(sum/1e9).toFixed(2)}B ≠ total $${(data.directMilitaryCosts.total/1e9).toFixed(2)}B`)
        }
      }
      if (data.indirectCosts?.breakdown) {
        const sum = Object.values(data.indirectCosts.breakdown).reduce((s, v) => s + (v.amount || 0), 0)
        if (sum === data.indirectCosts.total) {
          ok(`${name} indirect breakdown sum matches total`)
        } else {
          error(`${name} indirect breakdown MISMATCH: sum $${(sum/1e9).toFixed(2)}B ≠ total $${(data.indirectCosts.total/1e9).toFixed(2)}B`)
        }
      }
    }

    // dailyBurnRate must be a number, not a string
    if (typeof us.dailyBurnRate === 'number') {
      ok(`US dailyBurnRate is number ($${(us.dailyBurnRate / 1e9).toFixed(1)}B/day)`)
    } else {
      error(`US dailyBurnRate is ${typeof us.dailyBurnRate} — must be number! Will crash cost page.`)
    }
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
