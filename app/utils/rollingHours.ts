import type { BoundsKey, ChartBound, FlightHoursFile, ISODate } from '~/types/data'
import { addDays, epochDay } from './date'
import { APP_TODAY } from './constants'

export interface LimitCardData {
  key: 'daily' | 'weekly' | 'monthly' | 'annual'
  hours: number
  limit: number
  /** Raw ratio (0.993 …); display % = Math.round(utilisation * 100) */
  utilisation: number
}

export interface SeriesPoint {
  date: ISODate
  value: number
}

export interface ChartSeries {
  toggle: BoundsKey
  /** Always 2 × displayRangeDays + 1 points, today centered */
  points: SeriesPoint[]
  /** Straight from JSON chartBounds — the runtime source of truth */
  bounds: ChartBound
}

const CARD_WINDOWS = [
  { key: 'daily', windowDays: 1 },
  { key: 'weekly', windowDays: 7 },
  { key: 'monthly', windowDays: 30 },
  { key: 'annual', windowDays: 365 },
] as const

export function createRollingEngine(file: FlightHoursFile) {
  const first = epochDay(file.flightHours[0]!.date)
  const n = file.flightHours.length
  // Prefix sums in integer tenths: the dataset is 1-decimal throughout, so this
  // is lossless and long-window sums accumulate zero floating-point drift.
  const prefix = new Array<number>(n + 1).fill(0)
  for (let i = 0; i < n; i++)
    prefix[i + 1] = prefix[i]! + Math.round(file.flightHours[i]!.hours * 10)

  /** Rolling sum inclusive of endDate; dates outside the dataset contribute 0. */
  function sumWindow(endDate: ISODate, windowDays: number): number {
    const iEnd = epochDay(endDate) - first
    const hi = Math.min(iEnd + 1, n)
    const lo = Math.max(iEnd - windowDays + 1, 0)
    return hi > lo ? (prefix[hi]! - prefix[lo]!) / 10 : 0
  }

  function cards(today: ISODate = APP_TODAY): LimitCardData[] {
    return CARD_WINDOWS.map(({ key, windowDays }) => {
      const hours = sumWindow(today, windowDays)
      const limit = file.limits[key]
      return { key, hours, limit, utilisation: hours / limit }
    })
  }

  function series(toggle: BoundsKey, today: ISODate = APP_TODAY): ChartSeries {
    const bounds = file.chartBounds[toggle]
    const points: SeriesPoint[] = []
    for (let o = -bounds.displayRangeDays; o <= bounds.displayRangeDays; o++) {
      const date = addDays(today, o)
      points.push({ date, value: sumWindow(date, bounds.windowDays) })
    }
    return { toggle, points, bounds }
  }

  return { sumWindow, cards, series }
}

export type RollingEngine = ReturnType<typeof createRollingEngine>
