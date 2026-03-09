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

export function formatTimestamp(timestamp) {
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

export function formatFullTimestamp(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })
}
