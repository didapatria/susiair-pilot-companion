/** 1 decimal + thousands separator: 1444.5 → "1,444.5" */
export function formatHours(n: number): string {
  const [int, dec] = n.toFixed(1).split('.')
  return `${int!.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${dec}`
}

export const formatHoursLabel = (n: number): string => `${formatHours(n)} h`
