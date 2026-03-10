/**
 * stamp-version.js
 *
 * Writes the current timestamp to public/version.json before each build.
 * The useVersionCheck hook on the client polls this file to detect new deploys.
 *
 * Reads the version string from src/data/site-metadata.json so it stays in sync.
 */

import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

// Read current version from site-metadata
const siteMetadata = JSON.parse(
  readFileSync(resolve(root, 'src/data/site-metadata.json'), 'utf-8')
)

const versionData = {
  v: siteMetadata.version || '1.0',
  t: Math.floor(Date.now() / 1000),
}

const outPath = resolve(root, 'public/version.json')
writeFileSync(outPath, JSON.stringify(versionData))

console.log(`✅ Stamped version.json — v${versionData.v} at ${new Date().toISOString()}`)
