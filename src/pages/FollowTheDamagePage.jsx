import { useState, useMemo } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import {
  Flame, ChevronDown, ChevronUp, ExternalLink,
  Shield, AlertTriangle, MessageCircle, Map, Clock,
  Building2, Bomb, Factory, Zap, Target,
  Filter, Eye, EyeOff, Satellite
} from 'lucide-react'
import UpdateBadge from '../components/Layout/UpdateBadge'
import damageData from '../data/damage-data.json'
import 'leaflet/dist/leaflet.css'

// --- Status config ---
const statusConfig = {
  confirmed: { label: 'Confirmed', color: '#22c55e', icon: Shield, bg: 'bg-green-950/30', text: 'text-green-400', border: 'border-green-900/30' },
  reported: { label: 'Reported', color: '#f59e0b', icon: AlertTriangle, bg: 'bg-amber-950/30', text: 'text-amber-400', border: 'border-amber-900/30' },
  rumored: { label: 'Rumored', color: '#a855f7', icon: MessageCircle, bg: 'bg-purple-950/30', text: 'text-purple-400', border: 'border-purple-900/40' },
}

const categoryConfig = {
  military: { label: 'Military', icon: Target, color: 'text-red-400', bg: 'bg-red-950/30' },
  nuclear: { label: 'Nuclear', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-950/30' },
  civilian: { label: 'Civilian', icon: Building2, color: 'text-blue-400', bg: 'bg-blue-950/30' },
  infrastructure: { label: 'Infrastructure', icon: Factory, color: 'text-cyan-400', bg: 'bg-cyan-950/30' },
  energy: { label: 'Energy', icon: Flame, color: 'text-orange-400', bg: 'bg-orange-950/30' },
}

const damageLevelConfig = {
  destroyed: { label: 'Destroyed', color: 'text-red-500', bg: 'bg-red-950/40' },
  severe: { label: 'Severe', color: 'text-orange-400', bg: 'bg-orange-950/40' },
  moderate: { label: 'Moderate', color: 'text-amber-400', bg: 'bg-amber-950/40' },
  minor: { label: 'Minor', color: 'text-yellow-400', bg: 'bg-yellow-950/40' },
  unknown: { label: 'Unknown', color: 'text-gray-400', bg: 'bg-gray-800' },
}

const attributionConfig = {
  us: { label: 'US', flag: '🇺🇸', color: 'text-blue-400' },
  israel: { label: 'Israel', flag: '🇮🇱', color: 'text-cyan-400' },
  iran: { label: 'Iran', flag: '🇮🇷', color: 'text-red-400' },
  hezbollah: { label: 'Hezbollah', flag: '🇱🇧', color: 'text-green-400' },
}

function getMarkerColor(loc) {
  return statusConfig[loc.status]?.color || '#6b7280'
}

function getMarkerRadius(loc) {
  if (loc.damageLevel === 'destroyed') return 10
  if (loc.damageLevel === 'severe') return 8
  if (loc.damageLevel === 'moderate') return 6
  return 5
}

// --- Damage Map ---
function DamageMap({ locations, onSelect, selectedId }) {
  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-gray-800">
      <MapContainer
        center={[30, 48]}
        zoom={4}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        {locations.map(loc => {
          const isSelected = loc.id === selectedId
          return (
            <CircleMarker
              key={loc.id}
              center={[loc.lat, loc.lng]}
              radius={isSelected ? getMarkerRadius(loc) + 4 : getMarkerRadius(loc)}
              pathOptions={{
                color: isSelected ? '#ffffff' : getMarkerColor(loc),
                fillColor: getMarkerColor(loc),
                fillOpacity: loc.status === 'rumored' ? 0.4 : 0.7,
                weight: isSelected ? 3 : 1.5,
                dashArray: loc.status === 'rumored' ? '4 4' : undefined,
              }}
              eventHandlers={{ click: () => onSelect(loc.id) }}
            >
              <Popup>
                <div className="text-xs max-w-[250px]">
                  <div className="font-bold text-gray-900 mb-1">{loc.name}</div>
                  <div className="text-gray-600 mb-1">{loc.city}, {loc.country}</div>
                  <div className="text-gray-700 text-[11px] leading-relaxed">{loc.description}</div>
                  {loc.casualties && <div className="text-red-600 font-medium mt-1 text-[11px]">{loc.casualties}</div>}
                </div>
              </Popup>
            </CircleMarker>
          )
        })}
      </MapContainer>
    </div>
  )
}

// --- Damage Card ---
function DamageCard({ loc, isSelected, onSelect }) {
  const [expanded, setExpanded] = useState(false)
  const sInfo = statusConfig[loc.status]
  const cInfo = categoryConfig[loc.category]
  const dInfo = damageLevelConfig[loc.damageLevel] || damageLevelConfig.unknown
  const aInfo = attributionConfig[loc.attributedTo]
  const StatusIcon = sInfo?.icon || Shield

  return (
    <div
      className={`bg-gray-900/60 rounded-lg border overflow-hidden transition-all ${
        isSelected ? 'border-blue-500 ring-1 ring-blue-500/30' : sInfo?.border || 'border-gray-800'
      }`}
    >
      <button
        onClick={() => { onSelect(loc.id); setExpanded(!expanded) }}
        className="w-full text-left px-3 py-2.5 flex items-start gap-2.5 hover:bg-gray-900/80 transition-colors"
      >
        <div className="shrink-0 mt-0.5">
          {cInfo && <cInfo.icon size={14} className={cInfo.color} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-xs font-bold text-gray-100 leading-snug">{loc.name}</h4>
            <span className={`text-[9px] font-bold px-1 py-0.5 rounded ${sInfo?.text} ${sInfo?.bg}`}>
              {sInfo?.label}
            </span>
            <span className={`text-[9px] font-medium px-1 py-0.5 rounded ${dInfo.color} ${dInfo.bg}`}>
              {dInfo.label}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap text-[10px]">
            <span className="text-gray-500">{loc.city}, {loc.country}</span>
            <span className="text-gray-700">•</span>
            <span className="text-gray-500 font-mono">{loc.date}</span>
            {aInfo && (
              <>
                <span className="text-gray-700">•</span>
                <span className={aInfo.color}>{aInfo.flag} {aInfo.label}</span>
              </>
            )}
          </div>
        </div>
        <div className="shrink-0 text-gray-600 pt-0.5">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>
      {expanded && (
        <div className="px-3 pb-3 space-y-2 ml-[24px]">
          <p className="text-[11px] text-gray-400 leading-relaxed">{loc.description}</p>
          {loc.casualties && (
            <div className="flex items-center gap-1.5">
              <Bomb size={10} className="text-red-400" />
              <span className="text-[10px] text-red-400 font-medium">{loc.casualties}</span>
            </div>
          )}
          <div className="flex items-center gap-3 flex-wrap text-[10px] text-gray-500">
            {loc.weaponUsed && (
              <span>Weapon: <span className="text-gray-300 font-medium">{loc.weaponUsed}</span></span>
            )}
            {loc.satelliteImagery && (
              <span className="flex items-center gap-0.5 text-blue-400"><Satellite size={9} /> Satellite verified</span>
            )}
          </div>
          <a
            href={loc.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 bg-blue-950/30 px-1.5 py-0.5 rounded transition-colors"
          >
            {loc.source} <ExternalLink size={8} />
          </a>
        </div>
      )}
    </div>
  )
}

// --- Timeline Entry ---
function TimelineEntry({ loc }) {
  const sInfo = statusConfig[loc.status]
  const cInfo = categoryConfig[loc.category]
  const dInfo = damageLevelConfig[loc.damageLevel] || damageLevelConfig.unknown
  const aInfo = attributionConfig[loc.attributedTo]

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center shrink-0">
        <div
          className="w-3 h-3 rounded-full border-2 shrink-0"
          style={{ borderColor: sInfo?.color, backgroundColor: `${sInfo?.color}40` }}
        />
        <div className="w-px flex-1 bg-gray-800" />
      </div>
      <div className="pb-4 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-gray-500 font-mono">{loc.date}</span>
          {aInfo && <span className={`text-[10px] ${aInfo.color}`}>{aInfo.flag}</span>}
          <span className={`text-[9px] font-bold px-1 py-0.5 rounded ${cInfo?.color} ${cInfo?.bg}`}>
            {cInfo?.label}
          </span>
          <span className={`text-[9px] font-medium px-1 py-0.5 rounded ${dInfo.color} ${dInfo.bg}`}>
            {dInfo.label}
          </span>
        </div>
        <h4 className="text-xs font-bold text-gray-200 mt-1">{loc.name}</h4>
        <p className="text-[10px] text-gray-500">{loc.city}, {loc.country}</p>
        <p className="text-[11px] text-gray-400 leading-relaxed mt-1" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {loc.description}
        </p>
        {loc.casualties && (
          <p className="text-[10px] text-red-400 font-medium mt-1">{loc.casualties}</p>
        )}
      </div>
    </div>
  )
}

// --- Main Page ---
export default function FollowTheDamagePage() {
  const { metadata, summary, damageLocations } = damageData

  const [selectedId, setSelectedId] = useState(null)
  const [activeView, setActiveView] = useState('map') // 'map' | 'timeline'
  const [statusFilters, setStatusFilters] = useState(new Set(['confirmed', 'reported', 'rumored']))
  const [categoryFilters, setCategoryFilters] = useState(new Set(['military', 'nuclear', 'civilian', 'infrastructure', 'energy']))
  const [countryFilter, setCountryFilter] = useState('all')

  const toggleStatus = (s) => {
    setStatusFilters(prev => {
      const next = new Set(prev)
      next.has(s) ? next.delete(s) : next.add(s)
      return next
    })
  }

  const toggleCategory = (c) => {
    setCategoryFilters(prev => {
      const next = new Set(prev)
      next.has(c) ? next.delete(c) : next.add(c)
      return next
    })
  }

  const countries = useMemo(() => {
    const set = new Set(damageLocations.map(l => l.country))
    return ['all', ...Array.from(set).sort()]
  }, [damageLocations])

  const filtered = useMemo(() => {
    return damageLocations.filter(loc => {
      if (!statusFilters.has(loc.status)) return false
      if (!categoryFilters.has(loc.category)) return false
      if (countryFilter !== 'all' && loc.country !== countryFilter) return false
      return true
    })
  }, [damageLocations, statusFilters, categoryFilters, countryFilter])

  const sortedByDate = useMemo(() => {
    return [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [filtered])

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="bg-gray-900/50 border-b border-gray-800 px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame size={16} className="text-orange-400" />
            <h1 className="text-sm font-bold text-gray-300">Follow the Damage</h1>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-orange-400 font-bold">{summary.totalSites}</span>
              <span>damage sites across</span>
              <span className="text-orange-400 font-bold">{summary.countriesAffected}</span>
              <span>countries</span>
            </div>
          </div>
        </div>
      </header>

      {/* Summary Stats Bar */}
      <div className="bg-gray-900/30 border-b border-gray-800 px-6 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Shield size={12} className="text-green-400" />
                <span className="text-xs font-bold text-green-400">{summary.confirmed}</span>
                <span className="text-[10px] text-gray-500">Confirmed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <AlertTriangle size={12} className="text-amber-400" />
                <span className="text-xs font-bold text-amber-400">{summary.reported}</span>
                <span className="text-[10px] text-gray-500">Reported</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageCircle size={12} className="text-purple-400" />
                <span className="text-xs font-bold text-purple-400">{summary.rumored}</span>
                <span className="text-[10px] text-gray-500">Rumored</span>
              </div>
            </div>
            <div className="h-4 w-px bg-gray-700" />
            <div className="flex items-center gap-3 flex-wrap">
              {Object.entries(summary.categories).map(([key, count]) => {
                const cfg = categoryConfig[key]
                return (
                  <div key={key} className="flex items-center gap-1">
                    {cfg && <cfg.icon size={10} className={cfg.color} />}
                    <span className={`text-[10px] font-bold ${cfg?.color}`}>{count}</span>
                    <span className="text-[10px] text-gray-600">{cfg?.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-900/20 border-b border-gray-800 px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Filter size={12} className="text-gray-500" />
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Filters:</span>
          </div>

          {/* Status filters */}
          <div className="flex items-center gap-1">
            {Object.entries(statusConfig).map(([key, cfg]) => {
              const active = statusFilters.has(key)
              return (
                <button
                  key={key}
                  onClick={() => toggleStatus(key)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium transition-colors border ${
                    active
                      ? `${cfg.bg} ${cfg.text} ${cfg.border}`
                      : 'bg-gray-800/30 text-gray-600 border-gray-800 line-through opacity-50'
                  }`}
                >
                  {active ? <Eye size={9} /> : <EyeOff size={9} />}
                  {cfg.label}
                </button>
              )
            })}
          </div>

          <div className="h-4 w-px bg-gray-800" />

          {/* Category filters */}
          <div className="flex items-center gap-1">
            {Object.entries(categoryConfig).map(([key, cfg]) => {
              const active = categoryFilters.has(key)
              return (
                <button
                  key={key}
                  onClick={() => toggleCategory(key)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium transition-colors border ${
                    active
                      ? `${cfg.bg} ${cfg.color} border-gray-700/50`
                      : 'bg-gray-800/30 text-gray-600 border-gray-800 line-through opacity-50'
                  }`}
                >
                  <cfg.icon size={9} />
                  {cfg.label}
                </button>
              )
            })}
          </div>

          <div className="h-4 w-px bg-gray-800" />

          {/* Country filter */}
          <select
            value={countryFilter}
            onChange={e => setCountryFilter(e.target.value)}
            className="bg-gray-800 text-gray-300 text-[10px] px-2 py-1 rounded border border-gray-700 outline-none"
          >
            {countries.map(c => (
              <option key={c} value={c}>{c === 'all' ? 'All Countries' : c}</option>
            ))}
          </select>

          <span className="text-[10px] text-gray-600 ml-auto">
            Showing {filtered.length} of {damageLocations.length} sites
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        {/* View Toggle */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setActiveView('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeView === 'map' ? 'bg-orange-950/40 text-orange-400 border border-orange-900/40' : 'bg-gray-800/50 text-gray-500 border border-gray-800 hover:text-gray-300'
            }`}
          >
            <Map size={14} /> Map View
          </button>
          <button
            onClick={() => setActiveView('timeline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeView === 'timeline' ? 'bg-orange-950/40 text-orange-400 border border-orange-900/40' : 'bg-gray-800/50 text-gray-500 border border-gray-800 hover:text-gray-300'
            }`}
          >
            <Clock size={14} /> Timeline View
          </button>
        </div>

        {activeView === 'map' ? (
          /* Map + List Layout */
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4" style={{ height: 'calc(100vh - 300px)', minHeight: '500px' }}>
            {/* Map */}
            <DamageMap locations={filtered} onSelect={setSelectedId} selectedId={selectedId} />

            {/* Scrollable damage list */}
            <div className="overflow-y-auto space-y-2 pr-1">
              <div className="flex items-center gap-2 mb-2 sticky top-0 bg-gray-950 z-10 pb-2">
                <Flame size={14} className="text-orange-400" />
                <span className="text-xs font-bold text-gray-300">Damage Sites</span>
                <span className="text-[10px] bg-orange-950/40 text-orange-400 px-1.5 py-0.5 rounded-full">
                  {filtered.length} sites
                </span>
              </div>
              {sortedByDate.map(loc => (
                <DamageCard
                  key={loc.id}
                  loc={loc}
                  isSelected={loc.id === selectedId}
                  onSelect={setSelectedId}
                />
              ))}
              {filtered.length === 0 && (
                <div className="flex items-center justify-center h-32 text-sm text-gray-600">
                  No damage sites match current filters
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Timeline View */
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={16} className="text-orange-400" />
              <h2 className="text-sm font-bold text-gray-200">Damage Timeline</h2>
              <span className="text-[10px] text-gray-600">Newest first</span>
            </div>
            <div className="space-y-0">
              {sortedByDate.map(loc => (
                <TimelineEntry key={loc.id} loc={loc} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="flex items-center justify-center h-32 text-sm text-gray-600">
                No damage sites match current filters
              </div>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-4">
        <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-4">
          <h3 className="text-xs font-bold text-gray-300 mb-3">Map Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Verification Status</span>
              <div className="mt-1 space-y-1">
                {Object.entries(statusConfig).map(([key, cfg]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cfg.color, opacity: key === 'rumored' ? 0.5 : 0.8, border: key === 'rumored' ? '1px dashed' + cfg.color : 'none' }} />
                    <span className={`text-[10px] ${cfg.text}`}>{cfg.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Damage Level (Dot Size)</span>
              <div className="mt-1 space-y-1">
                {Object.entries(damageLevelConfig).filter(([k]) => k !== 'unknown').map(([key, cfg]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className={`text-[10px] ${cfg.color}`}>●</span>
                    <span className={`text-[10px] ${cfg.color}`}>{cfg.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Category</span>
              <div className="mt-1 space-y-1">
                {Object.entries(categoryConfig).map(([key, cfg]) => (
                  <div key={key} className="flex items-center gap-2">
                    <cfg.icon size={10} className={cfg.color} />
                    <span className={`text-[10px] ${cfg.color}`}>{cfg.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Attribution</span>
              <div className="mt-1 space-y-1">
                {Object.entries(attributionConfig).map(([key, cfg]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="text-[10px]">{cfg.flag}</span>
                    <span className={`text-[10px] ${cfg.color}`}>{cfg.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sources & Methodology */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-4">
        <div className="bg-gray-900/40 border border-gray-800 rounded-lg p-4">
          <h3 className="text-xs font-bold text-gray-300 mb-2">Sources & Methodology</h3>
          <p className="text-[10px] text-gray-500 leading-relaxed mb-2">
            Damage assessments compiled from official military briefings, satellite imagery analysis (Maxar, Planet Labs), credible media reporting, and verified OSINT analysis. Status classifications:
            <strong className="text-green-400"> Confirmed</strong> = officially acknowledged or satellite-verified;
            <strong className="text-amber-400"> Reported</strong> = credible reports from multiple sources, awaiting official confirmation;
            <strong className="text-purple-400"> Rumored</strong> = unverified claims from social media or single sources.
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Data Sources:</span>
            {metadata.sources.map((src, i) => (
              <a
                key={i}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-blue-400 bg-blue-950/30 px-1.5 py-0.5 rounded hover:text-blue-300 transition-colors"
              >
                {src.name}
              </a>
            ))}
          </div>
          <div className="text-[10px] text-gray-600 mt-2">
            Last updated: {new Date(metadata.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <UpdateBadge />
        <div className="px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-500">USII Tracker</span>
              <span className="text-blue-400 font-mono text-[9px]">usiitracker.com</span>
              <span>Follow the Damage — Conflict Damage Tracker</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield size={10} />
              <span>All data is fact-checked where possible. Unverified reports clearly marked.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
