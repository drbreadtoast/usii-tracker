import L from 'leaflet'
import { EVENT_COLORS, COUNTRY_COLORS, INVOLVEMENT_LEVELS } from './colors'

// Create a custom div icon for map markers
export function createEventIcon(type, verificationStatus, isMajor = false, isRecent = false) {
  const typeInfo = EVENT_COLORS[type] || EVENT_COLORS.strike
  const color = typeInfo.color
  const size = isMajor ? 16 : 12
  const outerSize = size + 8

  // Verification affects border style and opacity
  let borderStyle = 'solid'
  let opacity = 1
  let extraClass = ''

  if (verificationStatus === 'rumored') {
    borderStyle = 'dashed'
    opacity = 0.7
    extraClass = 'rumored'
  } else if (verificationStatus === 'likely') {
    opacity = 0.85
    extraClass = 'likely'
  }

  // Only animate recent events (past 24h)
  let animation = ''
  if (isRecent && isMajor) {
    animation = 'animation: pulse-ring 2s ease-out infinite;'
  } else if (isRecent) {
    animation = 'animation: pulse-ring 3s ease-out infinite;'
  }

  const html = `
    <div class="custom-marker ${extraClass}" style="
      width: ${outerSize}px;
      height: ${outerSize}px;
      background: ${color};
      border: 2px ${borderStyle} rgba(255,255,255,0.9);
      border-radius: 50%;
      opacity: ${opacity};
      box-shadow: 0 0 ${isMajor ? 12 : (type === 'strike' ? 10 : 6)}px ${color}80;
      ${animation}
    ">
      <div style="
        width: ${size * 0.4}px;
        height: ${size * 0.4}px;
        ${type === 'strike' ? `
          background: transparent;
          color: white;
          font-size: ${size * 0.35}px;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        ` : `
          background: white;
          border-radius: 50%;
          opacity: 0.8;
        `}
      ">${type === 'strike' ? '✦' : ''}</div>
    </div>
  `

  return L.divIcon({
    html,
    className: '',
    iconSize: [outerSize, outerSize],
    iconAnchor: [outerSize / 2, outerSize / 2],
    popupAnchor: [0, -(outerSize / 2 + 4)],
  })
}

// Create a recognizable US military base marker
export function createBaseIcon(wasStruck) {
  const color = wasStruck ? '#EF4444' : '#3B82F6'
  const badgeColor = wasStruck ? '#991B1B' : '#1E40AF'
  const badgeBorder = wasStruck ? '#FCA5A5' : '#93C5FD'
  const badgeIcon = wasStruck ? '⚠' : '✓'
  const size = 28

  const html = `
    <div style="
      width: ${size}px;
      height: ${size}px;
      position: relative;
      filter: drop-shadow(0 0 ${wasStruck ? '10px' : '6px'} ${color}90);
    ">
      <div style="
        width: 100%;
        height: 100%;
        background: ${color};
        clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
        opacity: 0.95;
      "></div>
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 9px;
        font-weight: 900;
        color: white;
        text-shadow: 0 1px 3px rgba(0,0,0,0.9);
        line-height: 1;
        letter-spacing: 0.5px;
      ">US</div>
      <div style="
        position: absolute;
        top: -6px;
        right: -6px;
        width: 13px;
        height: 13px;
        background: ${badgeColor};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 7px;
        border: 1.5px solid ${badgeBorder};
        color: white;
        line-height: 1;
      ">${badgeIcon}</div>
    </div>
  `
  return L.divIcon({
    html,
    className: '',
    iconSize: [size + 12, size + 12],
    iconAnchor: [(size + 12) / 2, (size + 12) / 2],
    popupAnchor: [0, -(size / 2 + 8)],
  })
}

// Create missile strike icon for confirmed/reported strikes, color-coded by attacker
export function createStrikeIcon(strikeType, attributedTo) {
  const countryColor = COUNTRY_COLORS[attributedTo]?.color || '#EF4444'
  const isConfirmed = strikeType === 'confirmed'
  const size = isConfirmed ? 14 : 10
  const outerSize = size + 6
  const opacity = isConfirmed ? 0.95 : 0.55
  const borderStyle = isConfirmed ? 'solid' : 'dashed'
  const glowSize = isConfirmed ? 10 : 4

  const html = `
    <div style="
      width: ${outerSize}px;
      height: ${outerSize}px;
      background: ${countryColor};
      border: 2px ${borderStyle} rgba(255,255,255,${isConfirmed ? 0.9 : 0.5});
      border-radius: 50%;
      opacity: ${opacity};
      box-shadow: 0 0 ${glowSize}px ${countryColor}60;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <span style="color: white; font-size: ${size * 0.5}px; line-height: 1;">&#x2726;</span>
    </div>
  `
  return L.divIcon({
    html,
    className: '',
    iconSize: [outerSize, outerSize],
    iconAnchor: [outerSize / 2, outerSize / 2],
    popupAnchor: [0, -(outerSize / 2 + 4)],
  })
}

// Create Hormuz Strait blockade icon
export function createHormuzIcon() {
  const html = `
    <div style="
      background: linear-gradient(135deg, #991B1B, #DC2626);
      border: 2px solid #FCA5A5;
      border-radius: 8px;
      padding: 4px 10px;
      display: flex;
      align-items: center;
      gap: 5px;
      white-space: nowrap;
      box-shadow: 0 0 16px rgba(239,68,68,0.6), 0 2px 8px rgba(0,0,0,0.5);
      cursor: pointer;
    ">
      <span style="font-size: 13px; line-height: 1;">&#x26D4;</span>
      <span style="
        color: white;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 0.8px;
        text-shadow: 0 1px 3px rgba(0,0,0,0.7);
      ">HORMUZ BLOCKED</span>
    </div>
  `
  return L.divIcon({
    html,
    className: '',
    iconSize: [150, 30],
    iconAnchor: [75, 15],
    popupAnchor: [0, -20],
  })
}

// Create diamond-shaped involvement icon for global powers
export function createInvolvementIcon(level, flag) {
  const levelInfo = INVOLVEMENT_LEVELS[level]
  const color = levelInfo?.color || '#6B7280'
  const size = 22

  const html = `
    <div style="
      width: ${size}px;
      height: ${size}px;
      position: relative;
      filter: drop-shadow(0 0 4px ${color}60);
    ">
      <div style="
        width: ${size * 0.7}px;
        height: ${size * 0.7}px;
        background: ${color};
        border: 1.5px solid rgba(255,255,255,0.7);
        transform: rotate(45deg);
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -${size * 0.35}px;
        margin-left: -${size * 0.35}px;
        opacity: 0.85;
      "></div>
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 10px;
        line-height: 1;
        z-index: 1;
      ">${flag}</div>
    </div>
  `
  return L.divIcon({
    html,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  })
}

// Create military asset icon (ships, carriers)
export function createAssetIcon(country, assetType) {
  const countryColor = COUNTRY_COLORS[country]?.color || '#3B82F6'
  const flag = COUNTRY_COLORS[country]?.flag || '🚢'
  const size = 26

  const typeIcons = {
    carrier: '⛴',
    destroyer: '🚢',
    submarine: '🔱',
    missile_boat: '⚓',
    support: '🚢',
  }
  const icon = typeIcons[assetType] || '⚓'

  const html = `
    <div style="
      width: ${size}px;
      height: ${size}px;
      position: relative;
      filter: drop-shadow(0 0 6px ${countryColor}80);
    ">
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${countryColor};
        border: 2px solid rgba(255,255,255,0.8);
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.9;
      ">
        <span style="font-size: 13px; line-height: 1;">${icon}</span>
      </div>
      <div style="
        position: absolute;
        top: -5px;
        right: -5px;
        font-size: 9px;
        line-height: 1;
      ">${flag}</div>
    </div>
  `
  return L.divIcon({
    html,
    className: '',
    iconSize: [size + 10, size + 10],
    iconAnchor: [(size + 10) / 2, (size + 10) / 2],
    popupAnchor: [0, -(size / 2 + 6)],
  })
}

// Create cluster icon
export function createClusterIcon(cluster) {
  const count = cluster.getChildCount()
  let size = 36
  let bgClass = 'bg-red-600'

  if (count < 5) {
    size = 32
    bgClass = 'bg-orange-600'
  } else if (count < 15) {
    size = 40
    bgClass = 'bg-red-600'
  } else {
    size = 48
    bgClass = 'bg-red-700'
  }

  return L.divIcon({
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: rgba(239, 68, 68, 0.8);
      border: 2px solid rgba(255,255,255,0.6);
      color: white;
      font-weight: bold;
      font-size: ${size > 40 ? 14 : 12}px;
      box-shadow: 0 0 15px rgba(239, 68, 68, 0.5);
    ">${count}</div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}
