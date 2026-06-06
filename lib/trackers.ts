import { promises as fs } from "node:fs";
import path from "node:path";
import type {
  OilTracker,
  WarCostTracker,
  IsraelFundingTracker,
} from "./trackers-types";

const TRACKERS_DIR = path.join(process.cwd(), "content", "trackers");

async function readTracker<T>(filename: string): Promise<T> {
  const filePath = path.join(TRACKERS_DIR, filename);
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

export async function getOilTracker(): Promise<OilTracker> {
  return readTracker<OilTracker>("oil.json");
}

export async function getWarCostTracker(): Promise<WarCostTracker> {
  return readTracker<WarCostTracker>("war-cost.json");
}

export async function getIsraelFundingTracker(): Promise<IsraelFundingTracker> {
  return readTracker<IsraelFundingTracker>("israel-funding.json");
}

/**
 * Compact USD formatter: 46_000_000_000 → "$46B", 1_700_000_000 → "$1.7B",
 * 450_000_000 → "$450M", 50_000 → "$50K". One decimal only below 10× the unit
 * so large round numbers stay clean ("$46B", not "$46.0B").
 */
export function formatUsd(n: number): string {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  const unit = (value: number, suffix: string): string => {
    const scaled = abs / value;
    const decimals = scaled >= 10 ? 0 : 1;
    return `${sign}$${scaled.toFixed(decimals)}${suffix}`;
  };
  if (abs >= 1e12) return unit(1e12, "T");
  if (abs >= 1e9) return unit(1e9, "B");
  if (abs >= 1e6) return unit(1e6, "M");
  if (abs >= 1e3) return unit(1e3, "K");
  return `${sign}$${abs.toFixed(0)}`;
}

/** Format a percentage; pass signed=true to prefix a "+" on positive values. */
export function formatPct(n: number, signed = false): string {
  const body = `${n.toFixed(1)}%`;
  return signed && n > 0 ? `+${body}` : body;
}
