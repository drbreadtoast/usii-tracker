import { useEffect, useRef, useCallback } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, Tooltip, ZoomControl, GeoJSON, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { createEventIcon, createBaseIcon, createHormuzIcon, createStrikeIcon, createInvolvementIcon, createAssetIcon } from '../../utils/markers'
import { EVENT_COLORS, VERIFICATION_COLORS, COUNTRY_COLORS, INVOLVEMENT_LEVELS } from '../../utils/colors'
import { formatTimestamp, formatFullTimestamp, getVerificationDescription } from '../../utils/verification'
import basesData from '../../data/bases.json'
import hormuzData from '../../data/hormuz-shipping.json'
import conflictCountries from '../../data/conflict-countries.json'
import missileStrikesData from '../../data/missile-strikes.json'
import globalInvolvementData from '../../data/global-involvement.json'
import militaryAssetsData from '../../data/military-assets.json'
import MapLegend from './MapLegend'
import { ExternalLink, MapPin, Clock, Shield, Star, Anchor } from 'lucide-react'

const MAP_CENTER = [31.5, 47.0]
const MAP_ZOOM = 5

// Style function for GeoJSON country borders
function countryStyle(feature) {
  return {
    fillColor: feature.properties.color,
    fillOpacity: feature.properties.fillOpacity || 0.06,
    color: feature.properties.color,
    weight: feature.properties.weight || 1.5,
    opacity: feature.properties.borderOpacity || 0.5,
    dashArray: feature.properties.dashed ? '6 4' : null,
  }
}

// Attach country name tooltip on hover
function onEachCountry(feature, layer) {
  layer.bindTooltip(feature.properties.name, {
    permanent: false,
    direction: 'center',
    className: 'country-label-tooltip',
  })
}

const NOW = Date.now()
const DAY_MS = 24 * 60 * 60 * 1000

// Inner component to handle programmatic map actions (flyTo, open popups)
function MapController({ selectedEvent, markerRefs }) {
  const map = useMap()

  useEffect(() => {
    if (!selectedEvent || !selectedEvent.lat || !selectedEvent.lng) return

    // Fly to the event location
    map.flyTo([selectedEvent.lat, selectedEvent.lng], 9, {
      duration: 1.2,
    })

    // After fly animation, open the popup
    const timeout = setTimeout(() => {
      const markerRef = markerRefs.current?.[selectedEvent.id]
      if (markerRef) {
        markerRef.openPopup()
      }
    }, 1300)

    return () => clearTimeout(timeout)
  }, [selectedEvent, map, markerRefs])

  return null
}

export default function ConflictMap({ events, onEventSelect, showBases = true, showMissileStrikes = true, selectedEvent }) {
  const markerRefs = useRef({})

  const setMarkerRef = useCallback((id, ref) => {
    if (ref) {
      markerRefs.current[id] = ref
    }
  }, [])
  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        zoomControl={false}
        className="w-full h-full"
        style={{ background: '#0a0a0a' }}
        minZoom={3}
        maxZoom={15}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          subdomains="abcd"
          maxZoom={20}
        />
        <ZoomControl position="bottomright" />
        <MapController selectedEvent={selectedEvent} markerRefs={markerRefs} />

        {/* Country borders for conflict nations */}
        <GeoJSON
          data={conflictCountries}
          style={countryStyle}
          onEachFeature={onEachCountry}
        />

        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={35}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
          zoomToBoundsOnClick={true}
          disableClusteringAtZoom={10}
          iconCreateFunction={(cluster) => {
            const count = cluster.getChildCount()
            const size = count < 10 ? 'small' : count < 30 ? 'medium' : 'large'
            const sizeMap = { small: 30, medium: 40, large: 50 }
            return L.divIcon({
              html: `<div style="
                background: rgba(239, 68, 68, 0.85);
                border: 2px solid rgba(239, 68, 68, 0.5);
                border-radius: 50%;
                width: ${sizeMap[size]}px;
                height: ${sizeMap[size]}px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: ${size === 'large' ? 14 : 12}px;
                box-shadow: 0 0 12px rgba(239, 68, 68, 0.4);
              ">${count}</div>`,
              className: 'custom-cluster-icon',
              iconSize: L.point(sizeMap[size], sizeMap[size]),
            })
          }}
        >
        {events.map((event) => {
          const isRecent = (NOW - new Date(event.timestamp).getTime()) < DAY_MS
          return (
          <Marker
            key={event.id}
            position={[event.lat, event.lng]}
            icon={createEventIcon(event.type, event.verificationStatus, event.isMajor, isRecent)}
            ref={(ref) => setMarkerRef(event.id, ref)}
            eventHandlers={{
              click: () => onEventSelect && onEventSelect(event),
            }}
          >
            <Popup maxWidth={280} minWidth={220}>
              <div className="text-sm space-y-2 p-1">
                {/* Title */}
                <div className="flex items-start gap-2">
                  {event.isMajor && <Star size={14} className="text-amber-400 mt-0.5 shrink-0" fill="currentColor" />}
                  <h3 className="font-bold text-gray-100 leading-tight">{event.title}</h3>
                </div>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                    style={{
                      backgroundColor: `${VERIFICATION_COLORS[event.verificationStatus]?.color}25`,
                      color: VERIFICATION_COLORS[event.verificationStatus]?.color,
                      border: `1px ${event.verificationStatus === 'rumored' ? 'dashed' : 'solid'} ${VERIFICATION_COLORS[event.verificationStatus]?.color}50`,
                    }}
                  >
                    {VERIFICATION_COLORS[event.verificationStatus]?.icon} {VERIFICATION_COLORS[event.verificationStatus]?.label}
                  </span>
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]"
                    style={{
                      backgroundColor: `${EVENT_COLORS[event.type]?.color}20`,
                      color: EVENT_COLORS[event.type]?.color,
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: EVENT_COLORS[event.type]?.color }} />
                    {EVENT_COLORS[event.type]?.label}
                  </span>
                </div>

                <p className="text-gray-300 text-xs leading-relaxed">{event.description}</p>
                <p className="text-[10px] italic text-gray-500">{getVerificationDescription(event.verificationStatus)}</p>

                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><MapPin size={11} />{event.location}</span>
                  <span className="flex items-center gap-1"><Clock size={11} />{formatTimestamp(event.timestamp)}</span>
                </div>

                {event.casualties && event.casualties !== 'N/A' && (
                  <p className="text-xs text-red-300"><span className="font-semibold">Casualties:</span> {event.casualties}</p>
                )}

                {event.sources && event.sources.length > 0 && (
                  <div className="pt-1 border-t border-gray-700">
                    <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Sources</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {event.sources.map((src, i) => (
                        <a key={i} href={src.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 bg-blue-950/30 px-1.5 py-0.5 rounded">
                          {src.name}<ExternalLink size={8} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {event.socialRefs && event.socialRefs.length > 0 && (
                  <div className="pt-1 border-t border-gray-700">
                    <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Social Media</span>
                    {event.socialRefs.map((ref, i) => (
                      <div key={i} className="mt-1 text-xs text-gray-400 bg-gray-800/50 p-1.5 rounded">
                        <span className="text-blue-400 font-semibold">{ref.handle}</span>
                        <span className="ml-1">"{ref.text}"</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
          )
        })}
        </MarkerClusterGroup>

        {/* US Military Bases with hover tooltips */}
        {showBases && basesData.map((base) => (
          <Marker
            key={base.id}
            position={[base.lat, base.lng]}
            icon={createBaseIcon(base.wasStruck)}
          >
            <Tooltip direction="top" offset={[0, -20]} opacity={0.95} className="base-tooltip">
              <span style={{ fontWeight: 700 }}>{base.name}</span>
              <span style={{ marginLeft: 6, color: base.wasStruck ? '#FCA5A5' : '#93C5FD' }}>
                {base.wasStruck ? '⚠ STRUCK' : '✓ INTACT'}
              </span>
            </Tooltip>
            <Popup maxWidth={280} minWidth={240}>
              <div className="text-sm space-y-1.5 p-1">
                <h3 className="font-bold text-gray-100">{base.name}</h3>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="text-gray-400">{base.country}</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-400">{base.branch}</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-500">{base.personnel}</span>
                </div>
                <p className="text-xs text-gray-300">{base.description}</p>
                {base.wasStruck ? (
                  <div className="bg-red-950/40 border border-red-900/30 rounded p-1.5">
                    <p className="text-[10px] text-red-400 font-semibold">⚠ STRUCK</p>
                    <p className="text-[10px] text-red-300/80 mt-0.5">{base.strikeDetails}</p>
                  </div>
                ) : (
                  <p className="text-[10px] text-blue-400">✓ Base intact — not targeted</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        {/* Missile Strike Markers */}
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={30}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
          zoomToBoundsOnClick={true}
          disableClusteringAtZoom={10}
          iconCreateFunction={(cluster) => {
            const count = cluster.getChildCount()
            const size = count < 10 ? 30 : count < 30 ? 40 : 50
            return L.divIcon({
              html: `<div style="
                background: rgba(249, 115, 22, 0.85);
                border: 2px solid rgba(249, 115, 22, 0.5);
                border-radius: 50%;
                width: ${size}px;
                height: ${size}px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 12px;
                box-shadow: 0 0 12px rgba(249, 115, 22, 0.4);
              ">${count}</div>`,
              className: 'custom-cluster-icon',
              iconSize: L.point(size, size),
            })
          }}
        >
        {showMissileStrikes && missileStrikesData.map((strike) => {
          const attacker = COUNTRY_COLORS[strike.attributedTo]
          return (
            <Marker
              key={strike.id}
              position={[strike.lat, strike.lng]}
              icon={createStrikeIcon(strike.strikeType, strike.attributedTo)}
            >
              <Popup maxWidth={300} minWidth={240}>
                <div className="text-sm space-y-2 p-1">
                  <div>
                    <h3 className="font-bold text-gray-100 leading-tight">{strike.city}, {strike.country}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{
                          backgroundColor: `${attacker?.color || '#EF4444'}20`,
                          color: attacker?.color || '#EF4444',
                          border: `1px solid ${attacker?.color || '#EF4444'}40`,
                        }}
                      >
                        {attacker?.flag} {attacker?.label || strike.attributedTo}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          strike.strikeType === 'confirmed'
                            ? 'bg-green-900/30 text-green-400 border border-green-800'
                            : 'bg-amber-900/30 text-amber-400 border border-amber-800 border-dashed'
                        }`}
                      >
                        {strike.strikeType === 'confirmed' ? '✓ Confirmed' : '? Reported'}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">{strike.description}</p>
                  <div className="flex items-center gap-3 text-[10px] text-gray-500">
                    <span>{strike.date}</span>
                    {strike.weaponType && <span>• {strike.weaponType}</span>}
                  </div>
                  {strike.casualties && (
                    <p className="text-xs text-red-300"><span className="font-semibold">Casualties:</span> {strike.casualties}</p>
                  )}
                  <div className="pt-1 border-t border-gray-700">
                    <a href={strike.sourceUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300">
                      {strike.source} <ExternalLink size={8} />
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
        </MarkerClusterGroup>

        {/* Global Involvement Markers (Russia, China, EU, France, Germany) */}
        {globalInvolvementData.map((inv) => (
          <Marker
            key={inv.id}
            position={[inv.lat, inv.lng]}
            icon={createInvolvementIcon(inv.level, inv.flag)}
          >
            <Popup maxWidth={280} minWidth={220}>
              <div className="text-sm space-y-2 p-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{inv.flag}</span>
                  <div>
                    <h3 className="font-bold text-gray-100">{inv.country}</h3>
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={{
                        backgroundColor: `${INVOLVEMENT_LEVELS[inv.level]?.color}20`,
                        color: INVOLVEMENT_LEVELS[inv.level]?.color,
                        border: `1px solid ${INVOLVEMENT_LEVELS[inv.level]?.color}40`,
                      }}
                    >
                      {INVOLVEMENT_LEVELS[inv.level]?.label}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-300">{inv.summary}</p>
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Recent Actions</span>
                  {inv.actions.slice(-3).map((action, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-400">
                      <span className="text-[10px] text-gray-600 shrink-0 font-mono">{action.date.slice(5)}</span>
                      <span>{action.text}</span>
                    </div>
                  ))}
                </div>
                {inv.statements.length > 0 && (
                  <div className="pt-1 border-t border-gray-700">
                    <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Latest Statement</span>
                    <div className="mt-1 text-xs text-gray-400 bg-gray-800/50 p-1.5 rounded">
                      <span className="text-blue-400 font-semibold">{inv.statements[inv.statements.length - 1].speaker}</span>
                      <span className="ml-1 italic">"{inv.statements[inv.statements.length - 1].text}"</span>
                    </div>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Strait of Hormuz Blockade Marker */}
        <Marker
          position={[26.5667, 56.2500]}
          icon={createHormuzIcon()}
        >
          <Popup maxWidth={300} minWidth={250}>
            <div className="text-sm space-y-3 p-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">&#x26D4;</span>
                <div>
                  <h3 className="font-bold text-red-400 text-base">Strait of Hormuz</h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-900/50 text-red-300 border border-red-800">
                    {hormuzData.straitStatus.replace(/_/g, ' ').toUpperCase()} — Day {hormuzData.blockadeDay}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-800/60 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-red-400">{hormuzData.statistics.vesselsAnchored}</div>
                  <div className="text-[10px] text-gray-500">Vessels Anchored</div>
                </div>
                <div className="bg-gray-800/60 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-amber-400">{hormuzData.statistics.globalOilSharePercent}%</div>
                  <div className="text-[10px] text-gray-500">Global Oil Cut</div>
                </div>
                <div className="bg-gray-800/60 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-orange-400">{(hormuzData.statistics.normalDailyBarrels / 1000000).toFixed(0)}M</div>
                  <div className="text-[10px] text-gray-500">Barrels/Day Blocked</div>
                </div>
                <div className="bg-gray-800/60 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-red-500">{hormuzData.statistics.vesselsSunk + hormuzData.statistics.vesselsDamaged}</div>
                  <div className="text-[10px] text-gray-500">Vessels Hit/Sunk</div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Recent Events</span>
                {hormuzData.timeline.slice(-3).reverse().map((entry, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-400">
                    <span className="text-[10px] text-gray-600 shrink-0 font-mono">{entry.date.slice(5)}</span>
                    <span>{entry.event}</span>
                  </div>
                ))}
              </div>

              <div className="pt-1 border-t border-gray-700 text-[10px] text-blue-400">
                See Energy tab for full blockade details
              </div>
            </div>
          </Popup>
        </Marker>
        {/* Military Assets (US & Israeli ships/carriers) */}
        {militaryAssetsData.map((asset) => {
          const countryInfo = COUNTRY_COLORS[asset.country]
          return (
            <Marker
              key={asset.id}
              position={[asset.lat, asset.lng]}
              icon={createAssetIcon(asset.country, asset.assetType)}
            >
              <Tooltip direction="top" offset={[0, -16]} opacity={0.95}>
                <span style={{ fontWeight: 700 }}>{asset.name}</span>
                <span style={{ marginLeft: 6, color: countryInfo?.color || '#3B82F6' }}>
                  {asset.status}
                </span>
              </Tooltip>
              <Popup maxWidth={300} minWidth={240}>
                <div className="text-sm space-y-2 p-1">
                  <div className="flex items-center gap-2">
                    <Anchor size={16} className="text-blue-400 shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-100">{asset.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                          style={{
                            backgroundColor: `${countryInfo?.color || '#3B82F6'}20`,
                            color: countryInfo?.color || '#3B82F6',
                            border: `1px solid ${countryInfo?.color || '#3B82F6'}40`,
                          }}
                        >
                          {countryInfo?.flag} {countryInfo?.label}
                        </span>
                        <span className="text-[10px] text-gray-500 capitalize">{asset.assetType.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">{asset.description}</p>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500">
                    <span className="font-semibold">Status:</span>
                    <span className={asset.status === 'Deployed' ? 'text-green-400' : 'text-amber-400'}>{asset.status}</span>
                  </div>
                  {asset.sourceUrl && (
                    <div className="pt-1 border-t border-gray-700">
                      <a href={asset.sourceUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300">
                        {asset.source || 'Source'} <ExternalLink size={8} />
                      </a>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      <MapLegend showBases={showBases} />
    </div>
  )
}
