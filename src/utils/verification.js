import { VERIFICATION_COLORS } from './colors'

export function getVerificationLabel(status) {
  return VERIFICATION_COLORS[status]?.label || 'Unknown'
}

export function getVerificationIcon(status) {
  return VERIFICATION_COLORS[status]?.icon || '?'
}

export function getVerificationDescription(status) {
  switch (status) {
    case 'confirmed':
      return 'Verified with multiple independent sources'
    case 'likely':
      return 'Credible reports but not fully independently confirmed'
    case 'rumored':
      return 'Unverified - attempted verification could not confirm at this time'
    default:
      return 'Verification status unknown'
  }
}

// Check if a timestamp is date-only (no specific time known)
function isDateOnly(timestamp) {
  return timestamp && timestamp.endsWith('T00:00:00Z')
}

// Parse a date-only timestamp without timezone conversion
function parseDateOnly(timestamp) {
  const [datePart] = timestamp.split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function formatTimestamp(timestamp) {
  // Date-only entries: show just the date, no relative time
  if (isDateOnly(timestamp)) {
    const date = parseDateOnly(timestamp)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

export function formatDateOnly(timestamp) {
  if (!timestamp) return ''
  const [datePart] = timestamp.split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatFullTimestamp(timestamp) {
  // Date-only entries: show just the date, no time
  if (isDateOnly(timestamp)) {
    const date = parseDateOnly(timestamp)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const date = new Date(timestamp)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Los_Angeles',
    hour12: true,
  }) + ' PT'
}
