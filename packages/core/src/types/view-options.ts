import { BusinessHours } from './constraint'
import { Locale } from './locale'

export interface ViewOptions {
  businessHours: BusinessHours | BusinessHours[] | boolean
  minTime: string
  maxTime: string
  slotDuration: number
  slotLabelFormat: string
  scrollToTime: string
  fixedWeekCount: boolean
  weekNumbers: boolean
  showNonCurrentDates: boolean
  weekends: boolean
  dayMaxEvents: number | boolean
  height: 'auto' | number | string
  aspectRatio: number
  handleWindowResize: boolean
  locale: Locale
  firstDay: number
}

export const DefaultViewOptions: ViewOptions = {
  businessHours: false,
  minTime: '00:00',
  maxTime: '24:00',
  slotDuration: 60,
  slotLabelFormat: 'h:mm a',
  scrollToTime: '06:00',
  fixedWeekCount: true,
  weekNumbers: false,
  showNonCurrentDates: true,
  weekends: true,
  dayMaxEvents: false,
  height: 'auto',
  aspectRatio: 1.35,
  handleWindowResize: true,
  locale: null as unknown as Locale,
  firstDay: 0,
}
