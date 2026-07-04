import { describe, expect, it } from 'vitest'
import { formatHours, formatHoursLabel } from '~/utils/format'

describe('formatHours', () => {
  it.each([
    [1444.5, '1,444.5'],
    [1025.3, '1,025.3'],
    [4.3, '4.3'],
    [0, '0.0'],
    [99.3, '99.3'],
  ] as const)('%f → "%s"', (input, output) => {
    expect(formatHours(input)).toBe(output)
  })

  it('labels with the hour unit', () => {
    expect(formatHoursLabel(40)).toBe('40.0 h')
    expect(formatHoursLabel(1444.5)).toBe('1,444.5 h')
  })
})
