import { describe, expect, it } from 'vitest'
import raw from '../../app/assets/data/mock-flight-hours.json'
import type { FlightHoursFile } from '../../app/types/data'
import { createRollingEngine } from '../../app/utils/rollingHours'
import { diffDays } from '../../app/utils/date'
import { utilisationTone } from '../../app/utils/status'

const file = raw as FlightHoursFile
const engine = createRollingEngine(file)

describe('dataset integrity', () => {
  it('sums exactly to pilot.totalFlightHours (1444.5)', () => {
    const sum = file.flightHours.reduce((acc, e) => acc + e.hours, 0)
    expect(sum).toBeCloseTo(1444.5, 1)
    expect(file.pilot.totalFlightHours).toBe(1444.5)
  })

  it('is 521 contiguous daily entries from 2024-12-27 to 2026-05-31', () => {
    expect(file.flightHours).toHaveLength(521)
    expect(file.flightHours[0]!.date).toBe('2024-12-27')
    expect(file.flightHours.at(-1)!.date).toBe('2026-05-31')
    for (let i = 1; i < file.flightHours.length; i++)
      expect(diffDays(file.flightHours[i]!.date, file.flightHours[i - 1]!.date)).toBe(1)
  })
})

describe('limit summary cards @ 2026-05-31', () => {
  const expected = [
    { key: 'daily', hours: 4.3, limit: 8, tone: 'success' },
    { key: 'weekly', hours: 15.4, limit: 40, tone: 'success' },
    { key: 'monthly', hours: 99.3, limit: 100, tone: 'warning' },
    { key: 'annual', hours: 1025.3, limit: 1050, tone: 'warning' },
  ] as const

  it.each(expected)('$key = $hours / $limit → $tone', ({ key, hours, limit, tone }) => {
    const card = engine.cards().find(c => c.key === key)!
    expect(card.hours).toBeCloseTo(hours, 1)
    expect(card.limit).toBe(limit)
    expect(utilisationTone(card.utilisation)).toBe(tone)
  })

  it('rounds display percentages to 99% (monthly) and 98% (annual)', () => {
    const [, , monthly, annual] = engine.cards()
    expect(Math.round(monthly!.utilisation * 100)).toBe(99)
    expect(Math.round(annual!.utilisation * 100)).toBe(98)
  })
})

describe('15-point display series (2026-05-24 … 2026-06-07)', () => {
  const W1 = [30.9, 27.8, 22.0, 17.5, 14.1, 18.5, 15.2, 15.4, 12.1, 12.1, 10.0, 8.7, 4.3, 4.3, 0.0]
  const M1 = [97.5, 100.8, 100.8, 100.5, 101.8, 104.4, 98.8, 99.3, 99.3, 99.3, 95.3, 94.4, 94.4, 89.5, 84.3]

  it('1w matches the fixture array point-for-point', () => {
    const s = engine.series('1w')
    expect(s.points).toHaveLength(15)
    expect(s.points[0]!.date).toBe('2026-05-24')
    expect(s.points[7]!.date).toBe('2026-05-31')
    expect(s.points.at(-1)!.date).toBe('2026-06-07')
    s.points.forEach((p, i) => expect(p.value).toBeCloseTo(W1[i]!, 1))
  })

  it('1w never crosses its 40 h limit in-window, and the last point is exactly 0', () => {
    const s = engine.series('1w')
    expect(s.points.every(p => p.value <= s.bounds.limit)).toBe(true)
    expect(s.points.at(-1)!.value).toBe(0)
  })

  it('1m matches the fixture array point-for-point', () => {
    const s = engine.series('1m')
    s.points.forEach((p, i) => expect(p.value).toBeCloseTo(M1[i]!, 1))
  })

  it('1m exceeds the 100 h limit exactly on 05-25..05-29', () => {
    const s = engine.series('1m')
    const over = s.points.filter(p => p.value > s.bounds.limit).map(p => p.date)
    expect(over).toEqual(['2026-05-25', '2026-05-26', '2026-05-27', '2026-05-28', '2026-05-29'])
  })

  it.each([
    ['3m', 258.2, 261.0, 247.5],
    ['6m', 507.2, 491.9, 464.4],
    ['1y', 1033.9, 1025.3, 1007.3],
  ] as const)('%s spot values: first / today / last', (toggle, first, today, last) => {
    const s = engine.series(toggle)
    expect(s.points[0]!.value).toBeCloseTo(first, 1)
    expect(s.points[7]!.value).toBeCloseTo(today, 1)
    expect(s.points.at(-1)!.value).toBeCloseTo(last, 1)
  })

  it('bounds come from JSON chartBounds (1y.max = 1200, not the PDF 1250)', () => {
    expect(engine.series('1y').bounds.max).toBe(1200)
    expect(engine.series('1w').bounds).toEqual(file.chartBounds['1w'])
  })
})

describe('sumWindow edges', () => {
  it('window entirely before the dataset → 0', () => {
    expect(engine.sumWindow('2024-12-26', 7)).toBe(0)
  })
  it('first dataset day, window 1 → 5.7', () => {
    expect(engine.sumWindow('2024-12-27', 1)).toBeCloseTo(5.7, 1)
  })
  it('window entirely in the future → 0', () => {
    expect(engine.sumWindow('2026-06-14', 7)).toBe(0)
  })
  it('window straddling the start clamps to available data', () => {
    // 7-day window ending 2024-12-29 covers only 12-27..12-29 = 5.7 + 0 + 3.4
    expect(engine.sumWindow('2024-12-29', 7)).toBeCloseTo(9.1, 1)
  })
})

describe('utilisationTone boundaries', () => {
  it.each([
    [0, 'success'],
    [0.749, 'success'],
    [0.75, 'warning'],
    [0.99, 'warning'],
    [1.0, 'danger'],
    [1.3, 'danger'],
  ] as const)('%f → %s', (ratio, tone) => {
    expect(utilisationTone(ratio)).toBe(tone)
  })
})
