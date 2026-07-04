import { describe, expect, it } from 'vitest'
import { documentStatusCopy, documentTone, yiqTextColor } from '~/utils/status'

describe('documentTone (warningDays = 30 from the JSON)', () => {
  it.each([
    [-30, 'danger'],
    [0, 'danger'],
    [1, 'warning'],
    [11, 'warning'],
    [30, 'warning'],
    [31, 'success'],
    [136, 'success'],
  ] as const)('%d days remaining → %s', (days, tone) => {
    expect(documentTone(days, 30)).toBe(tone)
  })
})

describe('documentStatusCopy', () => {
  it.each([
    [-30, 'Expired 30 days ago'],
    [-2, 'Expired 2 days ago'],
    [-1, 'Expired 1 day ago'],
    [0, 'Expires today'],
    [1, '1 day left'],
    [11, '11 days left'],
    [208, '208 days left'],
  ] as const)('%d → "%s"', (days, copy) => {
    expect(documentStatusCopy(days)).toBe(copy)
  })
})

describe('yiqTextColor over the 10 legend colors', () => {
  it.each(['#FBA577', '#F59E0B', '#9CA3AF'])('%s → navy text', (hex) => {
    expect(yiqTextColor(hex)).toBe('#0E2138')
  })

  it.each(['#10B981', '#0EA5E9', '#EF4444', '#7C3AED', '#475569', '#7C2D12', '#111827'])(
    '%s → white text',
    (hex) => {
      expect(yiqTextColor(hex)).toBe('#FFFFFF')
    },
  )
})
