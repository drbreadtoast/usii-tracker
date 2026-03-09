// Event type color mapping
export const EVENT_COLORS = {
  strike: { color: '#EF4444', label: 'Strikes / Attacks', bg: 'bg-red-500', text: 'text-red-400', border: 'border-red-500' },
  movement: { color: '#F97316', label: 'Troop Movements', bg: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-500' },
  naval: { color: '#3B82F6', label: 'Naval Activity', bg: 'bg-blue-500', text: 'text-blue-400', border: 'border-blue-500' },
  diplomatic: { color: '#EAB308', label: 'Diplomatic', bg: 'bg-yellow-500', text: 'text-yellow-400', border: 'border-yellow-500' },
  protest: { color: '#A855F7', label: 'Protests / Unrest', bg: 'bg-purple-500', text: 'text-purple-400', border: 'border-purple-500' },
  infrastructure: { color: '#6B7280', label: 'Infrastructure', bg: 'bg-gray-500', text: 'text-gray-400', border: 'border-gray-500' },
  cyber: { color: '#06B6D4', label: 'Cyber Attacks', bg: 'bg-cyan-500', text: 'text-cyan-400', border: 'border-cyan-500' },
  humanitarian: { color: '#22C55E', label: 'Humanitarian', bg: 'bg-green-500', text: 'text-green-400', border: 'border-green-500' },
}

// Verification status colors
export const VERIFICATION_COLORS = {
  confirmed: { color: '#22C55E', label: 'Confirmed', bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500', icon: '✓' },
  likely: { color: '#EAB308', label: 'Likely', bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500', icon: '~' },
  rumored: { color: '#EF4444', label: 'Unverified', bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500', icon: '?' },
}

// Country attribution colors and labels
export const COUNTRY_COLORS = {
  us: { color: '#3B82F6', label: 'United States', flag: '🇺🇸', short: 'US' },
  israel: { color: '#60A5FA', label: 'Israel', flag: '🇮🇱', short: 'ISR' },
  iran: { color: '#EF4444', label: 'Iran', flag: '🇮🇷', short: 'IRN' },
  hezbollah: { color: '#F97316', label: 'Hezbollah', flag: '🇱🇧', short: 'HZB' },
  iraq_militias: { color: '#A855F7', label: 'Iraqi Militias', flag: '🇮🇶', short: 'IRQ' },
  houthis: { color: '#EAB308', label: 'Houthis (Yemen)', flag: '🇾🇪', short: 'HTH' },
  uk: { color: '#6366F1', label: 'United Kingdom', flag: '🇬🇧', short: 'UK' },
  multiple: { color: '#6B7280', label: 'Multiple Parties', flag: '🌐', short: 'MUL' },
  russia: { color: '#B91C1C', label: 'Russia', flag: '🇷🇺', short: 'RUS' },
  china: { color: '#DC2626', label: 'China', flag: '🇨🇳', short: 'CHN' },
  eu: { color: '#2563EB', label: 'European Union', flag: '🇪🇺', short: 'EU' },
  france: { color: '#1D4ED8', label: 'France', flag: '🇫🇷', short: 'FRA' },
  germany: { color: '#1E40AF', label: 'Germany', flag: '🇩🇪', short: 'DEU' },
}

// Global involvement levels for non-combatant countries
export const INVOLVEMENT_LEVELS = {
  combatant: { color: '#EF4444', label: 'Combatant' },
  military_support: { color: '#F97316', label: 'Military Support' },
  diplomatic: { color: '#3B82F6', label: 'Diplomatic' },
  economic: { color: '#EAB308', label: 'Economic' },
  observer: { color: '#6B7280', label: 'Observer' },
}

// Time filter presets
export const TIME_FILTERS = {
  today: { label: 'Today', days: 1 },
  week: { label: 'Past Week', days: 7 },
  month: { label: '30 Days', days: 30 },
  year: { label: 'This Year', days: 365 },
  all: { label: 'All Time', days: null },
}

// US military base marker colors
export const BASE_COLORS = {
  struck: { color: '#EF4444', label: 'Struck Base', bg: 'bg-red-500' },
  safe: { color: '#3B82F6', label: 'Intact Base', bg: 'bg-blue-500' },
}

// Escalation severity colors
export const SEVERITY_COLORS = {
  critical: { color: '#EF4444', label: 'Critical', bg: 'bg-red-950/30' },
  high: { color: '#F97316', label: 'High', bg: 'bg-orange-950/30' },
  medium: { color: '#EAB308', label: 'Medium', bg: 'bg-yellow-950/30' },
}

// Escalation category colors
export const CATEGORY_COLORS = {
  military: { color: '#EF4444', label: 'Military' },
  economic: { color: '#EAB308', label: 'Economic' },
  diplomatic: { color: '#3B82F6', label: 'Diplomatic' },
  humanitarian: { color: '#22C55E', label: 'Humanitarian' },
}

export const EVENT_TYPES = Object.keys(EVENT_COLORS)
export const VERIFICATION_STATUSES = Object.keys(VERIFICATION_COLORS)
export const COUNTRIES = Object.keys(COUNTRY_COLORS)
