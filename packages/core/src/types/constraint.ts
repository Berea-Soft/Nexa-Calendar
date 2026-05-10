import { TimeGuard } from '@bereasoftware/time-guard'

export interface BusinessHours {
  daysOfWeek: number[]
  startTime: string
  endTime: string
}

export interface EventConstraint {
  start?: TimeGuard
  end?: TimeGuard
  daysOfWeek?: number[]
  businessHours?: boolean
}
