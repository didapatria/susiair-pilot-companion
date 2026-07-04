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

function relativeLuminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!
}

const NAVY_LUMINANCE = relativeLuminance('#0E2138')

/**
 * Auto-contrast ink for colored calendar chips: picks navy or white by true
 * WCAG contrast ratio, whichever reads better on the given fill.
 */
export function contrastInk(bgHex: string): '#0E2138' | '#FFFFFF' {
  const bg = relativeLuminance(bgHex)
  const navyRatio = (Math.max(bg, NAVY_LUMINANCE) + 0.05) / (Math.min(bg, NAVY_LUMINANCE) + 0.05)
  const whiteRatio = 1.05 / (bg + 0.05)
  return navyRatio >= whiteRatio ? '#0E2138' : '#FFFFFF'
}
