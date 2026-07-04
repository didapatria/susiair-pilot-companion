export type ISODate = string

export interface Pilot {
  name: string
  totalFlightHours: number
}

export interface Limits {
  daily: number
  weekly: number
  monthly: number
  annual: number
}

export interface ChartBound {
  limit: number
  max: number
  windowDays: number
  displayRangeDays: number
}

export interface ChartBounds {
  '1w': ChartBound
  '1m': ChartBound
  '3m': ChartBound
  '6m': ChartBound
  '1y': ChartBound
}

export type BoundsKey = keyof ChartBounds

export interface FlightHourEntry {
  date: ISODate
  hours: number
}

export interface FlightHoursFile {
  pilot: Pilot
  limits: Limits
  chartBounds: ChartBounds
  flightHours: FlightHourEntry[]
}

export interface DocumentsFile {
  today: ISODate
  thresholds: {
    warningDays: number
    comment: string
  }
  documents: PilotDocument[]
}

export interface PilotDocument {
  id: string
  label: string
  expiryDate: ISODate
}

export interface SchedulesFile {
  today: ISODate
  fieldGuide: Record<string, string>
  legend: LegendItem[]
  schedules: ScheduleRecord[]
}

export interface LegendItem {
  code: string
  label: string
  color: string
}

export interface ScheduleRecord {
  id: string
  duty_date: ISODate
  status: 1 | 2
  base_name: string
  base_color: string
  duty_type: string
  count_schedules: number
  count_logbooks: number
}
