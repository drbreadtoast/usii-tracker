/**
 * Types for the "tracker" data files in content/trackers/. Unlike the
 * story-and-perspectives Section model (lib/types.ts), these hold structured
 * metrics — oil/Hormuz/gas/food, war-cost breakdowns, and pro-Israel funding
 * tables. Loaded by lib/trackers.ts; validated by content/trackers/schema.json.
 *
 * Every claim carries a source where possible; baselines (preWar*) are fixed
 * reference points that never change once set.
 */

/** A provenance entry shown in a tracker page's "sources" footer. */
export interface TrackerSourceRef {
  name: string;
  url: string;
  description?: string;
}

/** A sourced standalone fact, rendered by KeyFactsList. */
export interface KeyFact {
  fact: string;
  source: string;
  sourceUrl: string;
  date?: string;
}

// ─── Oil (content/trackers/oil.json) ─────────────────────────────────────

export type HormuzStatus =
  | "open"
  | "partially_blocked"
  | "blocked"
  | "effectively_closed";

export type ExportStatus = "active" | "disrupted" | "blocked";

export interface HormuzTimelineEntry {
  date: string;
  event: string;
  status: HormuzStatus;
  source?: string;
  sourceUrl?: string;
}

export interface GasPricePoint {
  date: string;
  price: number;
  label?: string;
  isEvent?: boolean;
}

export interface GasBreakdownRow {
  component: string;
  current: number;
  preWar: number;
}

export interface OilPlayer {
  country: string;
  flag: string;
  dailyProductionMbpd: number;
  globalSharePercent: number;
  provenReservesBillionBarrels: number;
  exportStatus: ExportStatus;
  warImpact: string;
  sourceUrl?: string;
}

export interface FoodCommodity {
  name: string;
  unit: string;
  preWar: number;
  current: number;
  changePercent: number;
  detail: string;
  source?: string;
  sourceUrl?: string;
}

export interface ConsumerFuel {
  type: string;
  icon: string;
  preWarPrice: number;
  currentPrice: number;
  changePercent: number;
  source?: string;
  sourceUrl?: string;
}

export interface OilTracker {
  lastUpdated: string;
  disclaimer: string;
  sources: TrackerSourceRef[];
  hormuz: {
    status: HormuzStatus;
    blockadeDay: number;
    blockadeStartDate: string;
    dailyTransits: number;
    preWarDailyTransits: number;
    barrelsBlockedDaily: number;
    globalOilSharePercent: number;
    insuranceStatus: string;
    summary: string;
    source: string;
    sourceUrl: string;
    timeline: HormuzTimelineEntry[];
  };
  gas: {
    currentAverage: number;
    preWarAverage: number;
    changePercent: number;
    unit: string;
    source: string;
    sourceUrl: string;
    priceHistory: GasPricePoint[];
    breakdown: GasBreakdownRow[];
  };
  food: {
    commodities: FoodCommodity[];
    groceryImpact: {
      preWarWeekly: number;
      currentWeekly: number;
      changePercent: number;
      source: string;
      sourceUrl: string;
    };
  };
  keyPlayers: OilPlayer[];
  consumerImpact: {
    note: string;
    fuels: ConsumerFuel[];
  };
  keyFacts: KeyFact[];
}

// ─── War cost (content/trackers/war-cost.json) ───────────────────────────

export type WarParty = "us" | "israel" | "iran";

export interface CostBreakdownRow {
  label: string;
  amount: number;
  description: string;
  source?: string;
  sourceUrl?: string;
}

export interface CountryCost {
  key: WarParty;
  name: string;
  flag: string;
  directMilitaryTotal: number;
  dailyBurnRate: number;
  breakdown: CostBreakdownRow[];
  source?: string;
  sourceUrl?: string;
}

export interface WeaponCost {
  weapon: string;
  country: WarParty;
  unitCost: number;
  quantityUsed: number;
  totalCost: number;
  description?: string;
  source?: string;
  sourceUrl?: string;
}

export interface EconomicRippleRow {
  label: string;
  value: string;
  detail: string;
  source?: string;
  sourceUrl?: string;
}

export interface WarCostTracker {
  lastUpdated: string;
  conflictStartDate: string;
  daysOfConflict: number;
  dailyBurnRate: number;
  totalCost: number;
  disclaimer: string;
  sources: TrackerSourceRef[];
  countries: CountryCost[];
  weapons: WeaponCost[];
  economicRipple: EconomicRippleRow[];
  keyFacts: KeyFact[];
}

// ─── Israel funding (content/trackers/israel-funding.json) ────────────────

export type Party = "D" | "R" | "I";
export type Chamber = "House" | "Senate";
export type OrgType = "lobby" | "superPAC" | "pac" | "advocacy";

export interface FundingOrg {
  id: string;
  name: string;
  type: OrgType;
  founded: number;
  totalSpending2024Cycle: number;
  description: string;
  source?: string;
  sourceUrl?: string;
}

export interface RecipientVote {
  bill: string;
  date: string;
  vote: string;
  description?: string;
}

export interface FundingRecipient {
  id: string;
  name: string;
  party: Party;
  state: string;
  chamber: Chamber;
  role: string;
  totalProIsraelFunding: number;
  topDonors: { organization: string; amount: number }[];
  relevantVotes: RecipientVote[];
  source?: string;
  sourceUrl?: string;
}

export interface VotingCorrelation {
  id: string;
  bill: string;
  date: string;
  chamber: Chamber;
  description: string;
  yea: number;
  nay: number;
  avgProIsraelFundingYea: number;
  avgProIsraelFundingNay: number;
  insight: string;
  source?: string;
  sourceUrl?: string;
}

export interface IsraelFundingTracker {
  lastUpdated: string;
  disclaimer: string;
  sources: string[];
  organizations: FundingOrg[];
  topRecipients: FundingRecipient[];
  votingCorrelations: VotingCorrelation[];
  keyFacts: KeyFact[];
}
