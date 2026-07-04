import type { ISODate } from '~/types/data'

const DAY_MS = 86_400_000

export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'] as const
export const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const
export const WEEKDAYS_MON_FIRST = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
const WEEKDAYS_FULL_MON_FIRST = ['Monday', 'Tuesday', 'Wednesday', 'Thursday',
  'Friday', 'Saturday', 'Sunday'] as const

export function epochDay(iso: ISODate): number {
  const [y, m, d] = iso.split('-').map(Number)
  return Date.UTC(y!, m! - 1, d!) / DAY_MS
}

export function isoFromEpochDay(day: number): ISODate {
  const dt = new Date(day * DAY_MS)
  const m = String(dt.getUTCMonth() + 1).padStart(2, '0')
  const d = String(dt.getUTCDate()).padStart(2, '0')
  return `${dt.getUTCFullYear()}-${m}-${d}`
}

export const addDays = (iso: ISODate, n: number): ISODate => isoFromEpochDay(epochDay(iso) + n)

/** a − b in whole days */
export const diffDays = (a: ISODate, b: ISODate): number => epochDay(a) - epochDay(b)

/** 0 = Monday … 6 = Sunday. 1970-01-01 was a Thursday. */
export const mondayIndex = (iso: ISODate): number => ((epochDay(iso) % 7) + 10) % 7

export interface MonthCell {
  iso: ISODate
  day: number
  inMonth: boolean
}

/** Always 42 cells (6 rows × 7), Monday-start. month is 1–12. */
export function monthGrid(year: number, month: number): MonthCell[] {
  const firstIso: ISODate = `${year}-${String(month).padStart(2, '0')}-01`
  const start = epochDay(firstIso) - mondayIndex(firstIso)
  return Array.from({ length: 42 }, (_, i) => {
    const iso = isoFromEpochDay(start + i)
    const [y, m, d] = iso.split('-').map(Number)
    return { iso, day: d!, inMonth: m === month && y === year }
  })
}

// Hand-rolled English labels (no Intl): identical output on server and client.

export function formatDayMonth(iso: ISODate): string {
  const [, m, d] = iso.split('-').map(Number)
  return `${d} ${MONTH_SHORT[m! - 1]}`
}

export function formatMediumDate(iso: ISODate): string {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} ${MONTH_SHORT[m! - 1]} ${y}`
}

export function formatFullDate(iso: ISODate): string {
  const [, m, d] = iso.split('-').map(Number)
  return `${WEEKDAYS_FULL_MON_FIRST[mondayIndex(iso)]}, ${d} ${MONTH_SHORT[m! - 1]}`
}

export function formatShortDate(iso: ISODate): string {
  const [, m, d] = iso.split('-').map(Number)
  return `${WEEKDAYS_MON_FIRST[mondayIndex(iso)]} ${d} ${MONTH_SHORT[m! - 1]}`
}

export const formatMonthYear = (year: number, month: number): string =>
  `${MONTH_NAMES[month - 1]} ${year}`
