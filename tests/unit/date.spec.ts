import { describe, expect, it } from 'vitest'
import {
  addDays,
  diffDays,
  epochDay,
  formatDayMonth,
  formatFullDate,
  formatMediumDate,
  formatMonthYear,
  formatShortDate,
  isoFromEpochDay,
  mondayIndex,
  monthGrid,
} from '~/utils/date'

describe('epoch-day math', () => {
  it('round-trips ISO dates', () => {
    expect(isoFromEpochDay(epochDay('2026-05-31'))).toBe('2026-05-31')
    expect(isoFromEpochDay(epochDay('2024-12-27'))).toBe('2024-12-27')
  })

  it('addDays crosses month and year boundaries', () => {
    expect(addDays('2026-05-31', 1)).toBe('2026-06-01')
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31')
    expect(addDays('2026-05-31', -7)).toBe('2026-05-24')
    expect(addDays('2026-05-31', 7)).toBe('2026-06-07')
  })

  it('diffDays is signed (a − b)', () => {
    expect(diffDays('2026-06-11', '2026-05-31')).toBe(11)
    expect(diffDays('2026-05-01', '2026-05-31')).toBe(-30)
  })

  it('mondayIndex: 31 May 2026 is a Sunday, 1 May 2026 a Friday', () => {
    expect(mondayIndex('2026-05-31')).toBe(6)
    expect(mondayIndex('2026-05-01')).toBe(4)
  })
})

describe('monthGrid', () => {
  const grid = monthGrid(2026, 5)

  it('is 42 cells, Monday-start (May 2026: Mon 27 Apr → Sun 7 Jun)', () => {
    expect(grid).toHaveLength(42)
    expect(grid[0]!.iso).toBe('2026-04-27')
    expect(grid[41]!.iso).toBe('2026-06-07')
  })

  it('flags in-month cells', () => {
    expect(grid.filter(c => c.inMonth)).toHaveLength(31)
    expect(grid[0]!.inMonth).toBe(false)
    expect(grid.find(c => c.iso === '2026-05-31')!.inMonth).toBe(true)
  })

  it('handles year-boundary grids', () => {
    const jan = monthGrid(2026, 1)
    expect(jan[0]!.iso).toBe('2025-12-29')
    expect(jan.filter(c => c.inMonth)).toHaveLength(31)
    expect(jan[0]!.inMonth).toBe(false)
  })
})

describe('formatters', () => {
  it('renders English date labels without Intl', () => {
    expect(formatDayMonth('2026-05-31')).toBe('31 May')
    expect(formatMediumDate('2026-06-11')).toBe('11 Jun 2026')
    expect(formatFullDate('2026-05-31')).toBe('Sunday, 31 May')
    expect(formatShortDate('2026-05-27')).toBe('Wed 27 May')
    expect(formatMonthYear(2026, 5)).toBe('May 2026')
  })
})
