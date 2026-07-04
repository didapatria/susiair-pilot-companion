import { describe, expect, it } from 'vitest'
import raw from '../../app/assets/data/mock-schedules.json'
import type { SchedulesFile } from '../../app/types/data'

const file = raw as SchedulesFile

describe('schedules dataset assumptions', () => {
  it('has 54 records with a unique duty_date each', () => {
    expect(file.schedules).toHaveLength(54)
    expect(new Set(file.schedules.map(s => s.duty_date)).size).toBe(54)
  })

  it('May 2026 carries 21 duties (calendar default month)', () => {
    expect(file.schedules.filter(s => s.duty_date.startsWith('2026-05'))).toHaveLength(21)
  })

  it('legend has all 10 entries and covers every duty_type in the data', () => {
    expect(file.legend).toHaveLength(10)
    const codes = new Set(file.legend.map(l => l.code))
    for (const s of file.schedules) expect(codes.has(s.duty_type)).toBe(true)
  })

  it('today ring target: 31 May has duty 97037 with 2 scheduled / 0 logged', () => {
    const today = file.schedules.find(s => s.duty_date === '2026-05-31')!
    expect(today.id).toBe('97037')
    expect(today.count_schedules).toBe(2)
    expect(today.count_logbooks).toBe(0)
  })
})
