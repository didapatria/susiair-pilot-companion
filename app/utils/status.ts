export type Tone = 'success' | 'warning' | 'danger'

/** Card utilisation: success < 75%, warning 75–99%, danger ≥ 100% */
export function utilisationTone(ratio: number): Tone {
  if (ratio >= 1) return 'danger'
  if (ratio >= 0.75) return 'warning'
  return 'success'
}

/** Documents rule from the JSON thresholds comment: ≤ 0 expired, 1..warningDays soon, else safe. */
export function documentTone(daysRemaining: number, warningDays: number): Tone {
  if (daysRemaining <= 0) return 'danger'
  if (daysRemaining <= warningDays) return 'warning'
  return 'success'
}

export function documentStatusCopy(daysRemaining: number): string {
  if (daysRemaining < 0) return `Expired ${-daysRemaining} day${daysRemaining === -1 ? '' : 's'} ago`
  if (daysRemaining === 0) return 'Expires today'
  return `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} left`
}

/** Auto-contrast for colored calendar chips: YIQ ≥ 150 → navy text, else white. */
export function yiqTextColor(hex: string): '#0E2138' | '#FFFFFF' {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 >= 150 ? '#0E2138' : '#FFFFFF'
}
