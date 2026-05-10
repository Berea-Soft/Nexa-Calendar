// Shared calendar event data and resource definitions used across examples

export type ExampleKey =
  | 'full'
  | 'business'
  | 'minimal'
  | 'noweekends'
  | 'eventlimit'
  | 'timeline'
  | 'resource-timeline'
  | 'year'
  | 'drag-drop'
  | 'background-events'
  | 'selectable'
  | 'locales'
  | 'theming'
  | 'timezones'

export interface ExampleDef {
  key: ExampleKey
  title: string
  desc: string
  icon: string
}

export const EXAMPLES: ExampleDef[] = [
  { key: 'full', title: 'Full Features', desc: 'All events, business hours, DnD, i18n', icon: '🎯' },
  { key: 'business', title: 'Business Hours', desc: '9AM–6PM Mon–Fri, work week view', icon: '💼' },
  { key: 'minimal', title: 'Minimal / Read-only', desc: 'Plain calendar, no drag, no limits', icon: '📋' },
  { key: 'noweekends', title: 'No Weekends', desc: 'Mon–Fri only, non-current hidden', icon: '📅' },
  { key: 'eventlimit', title: 'Event Limit (3)', desc: 'Max 3 per day, "more" popover', icon: '📊' },
  { key: 'timeline', title: 'Timeline View', desc: 'Horizontal event bars across days', icon: '📈' },
  { key: 'resource-timeline', title: 'Resource Timeline', desc: 'Per-resource rows, frozen column', icon: '👥' },
  { key: 'year', title: 'Year View', desc: '12 mini-months, event dots', icon: '🗓️' },
  { key: 'drag-drop', title: 'Drag & Drop', desc: 'Move and resize events', icon: '✋' },
  { key: 'background-events', title: 'Background Events', desc: 'Events shown as bars behind', icon: '🎨' },
  { key: 'selectable', title: 'Selectable Dates', desc: 'Click dates to create events', icon: '🖱️' },
  { key: 'locales', title: 'Internationalization', desc: '10+ languages supported', icon: '🌍' },
  { key: 'theming', title: 'Theming', desc: '7 built-in + custom themes', icon: '🎨' },
  { key: 'timezones', title: 'Timezones', desc: 'Timezone-aware events', icon: '🌐' },
]

// Views available for each example
export const EXAMPLE_VIEWS: Record<ExampleKey, string[]> = {
  full: ['month', 'week', 'day', 'list', 'workWeek'],
  business: ['workWeek', 'week', 'day', 'month'],
  minimal: ['month', 'week', 'day', 'list'],
  noweekends: ['month', 'week', 'day', 'list', 'workWeek'],
  eventlimit: ['month'],
  timeline: ['timeline'],
  'resource-timeline': ['timelineWeek', 'timelineMonth', 'timelineDay'],
  year: ['year'],
  'drag-drop': ['week', 'day', 'workWeek', 'month'],
  'background-events': ['month', 'week', 'day'],
  selectable: ['week', 'day', 'workWeek', 'month'],
  locales: ['month', 'week', 'day', 'list', 'workWeek'],
  theming: ['month', 'week', 'day', 'list', 'workWeek'],
  timezones: ['month', 'week', 'day', 'list', 'workWeek'],
}

export type FrameworkKey = 'webcomponents' | 'react' | 'vue' | 'svelte'

export interface FrameworkDef {
  key: FrameworkKey
  label: string
}

export const FRAMEWORKS: FrameworkDef[] = [
  { key: 'webcomponents', label: 'Web Components' },
  { key: 'react', label: 'React' },
  { key: 'vue', label: 'Vue' },
  { key: 'svelte', label: 'Svelte' },
]

export type NxTheme = 'light' | 'dark' | 'ocean' | 'rose' | 'slate' | 'forest' | 'amber'

export interface ThemeDef {
  key: NxTheme
  label: string
  color: string
}

export const THEMES: ThemeDef[] = [
  { key: 'light',  label: 'Light',  color: '#ffffff' },
  { key: 'dark',   label: 'Dark',   color: '#0f172a' },
  { key: 'ocean',  label: 'Ocean',  color: '#0284c7' },
  { key: 'rose',   label: 'Rose',   color: '#e11d48' },
  { key: 'slate',  label: 'Slate',  color: '#475569' },
  { key: 'forest', label: 'Forest', color: '#16a34a' },
  { key: 'amber',  label: 'Amber',  color: '#d97706' },
]

export interface LangDef {
  code: string
  label: string
  flag: string
}

export const LANGS: LangDef[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
]

export interface SlotDurationDef {
  value: number
  label: string
}

export const SLOT_DURATIONS: SlotDurationDef[] = [
  { value: 15, label: '15 min' },
  { value: 20, label: '20 min' },
  { value: 30, label: '30 min' },
  { value: 60, label: '60 min' },
]

export interface TimeFormatDef {
  value: string
  label: string
}

export const TIME_FORMATS: TimeFormatDef[] = [
  { value: 'h:mm a', label: '12h (8:30 am)' },
  { value: 'HH:mm', label: '24h (08:30)' },
]

export interface HourHeightDef {
  value: number
  label: string
}

export const HOUR_HEIGHTS: HourHeightDef[] = [
  { value: 30, label: 'Compact (30px)' },
  { value: 48, label: 'Normal (48px)' },
  { value: 60, label: 'Tall (60px)' },
  { value: 80, label: 'Extra Tall (80px)' },
]

export interface TimezoneDef {
  code: string
  label: string
  offset: string
}

export const TIMEZONES: TimezoneDef[] = [
  { code: 'America/New_York', label: 'New York (EST/EDT)', offset: '-05:00' },
  { code: 'America/Chicago', label: 'Chicago (CST/CDT)', offset: '-06:00' },
  { code: 'America/Denver', label: 'Denver (MST/MDT)', offset: '-07:00' },
  { code: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)', offset: '-08:00' },
  { code: 'America/Mexico_City', label: 'Mexico City (CST)', offset: '-06:00' },
  { code: 'America/Sao_Paulo', label: 'São Paulo (BRT)', offset: '-03:00' },
  { code: 'Europe/London', label: 'London (GMT/BST)', offset: '+00:00' },
  { code: 'Europe/Paris', label: 'Paris (CET/CEST)', offset: '+01:00' },
  { code: 'Europe/Berlin', label: 'Berlin (CET/CEST)', offset: '+01:00' },
  { code: 'Europe/Madrid', label: 'Madrid (CET/CEST)', offset: '+01:00' },
  { code: 'Asia/Tokyo', label: 'Tokyo (JST)', offset: '+09:00' },
  { code: 'Asia/Shanghai', label: 'Shanghai (CST)', offset: '+08:00' },
  { code: 'Asia/Seoul', label: 'Seoul (KST)', offset: '+09:00' },
  { code: 'Asia/Dubai', label: 'Dubai (GST)', offset: '+04:00' },
  { code: 'Asia/Singapore', label: 'Singapore (SGT)', offset: '+08:00' },
  { code: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)', offset: '+11:00' },
  { code: 'Pacific/Honolulu', label: 'Honolulu (HST)', offset: '-10:00' },
]

export type ViewType =
  | 'month' | 'workWeek' | 'week' | 'day' | 'list'
  | 'timeline' | 'timelineDay' | 'timelineWeek' | 'timelineWorkWeek' | 'timelineMonth' | 'year'

export interface ViewDef {
  key: ViewType
  label: string
}

export const VIEWS: ViewDef[] = [
  { key: 'month',          label: 'Month' },
  { key: 'workWeek',       label: 'Work Week' },
  { key: 'week',           label: 'Week' },
  { key: 'day',            label: 'Day' },
  { key: 'list',           label: 'List' },
  { key: 'timeline',       label: 'Timeline' },
  { key: 'timelineDay',    label: 'TL Day' },
  { key: 'timelineWeek',   label: 'TL Week' },
  { key: 'timelineWorkWeek', label: 'TL Work Week' },
  { key: 'timelineMonth',  label: 'TL Month' },
  { key: 'year',           label: 'Year' },
]

// Date helpers (use native Date only for demo data generation — NOT inside calendar components)
function fmt(d: Date, h = 0, m = 0): string {
  const y = d.getFullYear()
  const mo = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${mo}-${day}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`
}

function fmtUtc(d: Date, h = 0, m = 0): string {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), h, m, 0)).toISOString()
}

const today = new Date()
const d = (offsetDays: number) =>
  new Date(today.getFullYear(), today.getMonth(), today.getDate() + offsetDays)

export const BASE_EVENTS = [
  { id: 1,  title: 'Sprint Planning',       start: fmt(today, 9),       end: fmt(today, 10),      backgroundColor: '#3b82f6' },
  { id: 2,  title: 'Code Review',           start: fmt(d(2), 14),                                 backgroundColor: '#8b5cf6' },
  { id: 3,  title: 'Architecture Workshop', start: fmt(d(-3), 10),      end: fmt(d(-3), 16),      backgroundColor: '#10b981' },
  { id: 4,  title: 'Team Lunch',            start: fmt(new Date(today.getFullYear(), today.getMonth() + 1, 5, 12)), backgroundColor: '#f59e0b' },
  { id: 5,  title: 'Client Meeting',        start: fmt(d(5), 15),       allDay: true,             backgroundColor: '#ef4444' },
  { id: 6,  title: 'Weekly Sync',           start: fmt(d(1), 9, 30),   daysOfWeek: [1,3,5],      backgroundColor: '#06b6d4' },
  { id: 7,  title: 'Recurring Standup',     start: fmt(today, 8, 30),  end: fmt(today, 8, 45),   daysOfWeek: [1,2,3,4,5], backgroundColor: '#ec4899' },
  { id: 8,  title: 'Busy (Background)',     start: fmt(today, 13),     end: fmt(today, 15),      display: 'background', backgroundColor: '#f97316' },
]

// Drag & Drop example events
export const DRAG_DROP_EVENTS = [
  { id: 1, title: 'Draggable Event 1', start: fmt(today, 10), end: fmt(today, 11), backgroundColor: '#3b82f6', startEditable: true },
  { id: 2, title: 'Draggable Event 2', start: fmt(today, 14), end: fmt(today, 15), backgroundColor: '#10b981', startEditable: true, durationEditable: true },
  { id: 3, title: 'Fixed Event', start: fmt(d(1), 9), end: fmt(d(1), 10), backgroundColor: '#ef4444', startEditable: false },
  { id: 4, title: 'Resizable Event', start: fmt(d(2), 13), end: fmt(d(2), 14, 30), backgroundColor: '#8b5cf6', durationEditable: true },
  { id: 5, title: 'Move Me!', start: fmt(d(1), 15), end: fmt(d(1), 16), backgroundColor: '#f59e0b', startEditable: true, durationEditable: true },
]

// Background events example
export const BACKGROUND_EVENTS = [
  { id: 1, title: 'Background 1', start: fmt(today, 8), end: fmt(today, 18), display: 'background', backgroundColor: '#f97316' },
  { id: 2, title: 'Background 2', start: fmt(d(1), 9), end: fmt(d(1), 17), display: 'background', backgroundColor: '#3b82f6' },
  { id: 3, title: 'Regular Event 1', start: fmt(today, 10), end: fmt(today, 11), backgroundColor: '#10b981' },
  { id: 4, title: 'Regular Event 2', start: fmt(d(1), 14), end: fmt(d(1), 15), backgroundColor: '#ec4899' },
  { id: 5, title: 'Background 3', start: fmt(d(2), 10), end: fmt(d(2), 16), display: 'background', backgroundColor: '#8b5cf6' },
  { id: 6, title: 'Regular Event 3', start: fmt(d(2), 11), end: fmt(d(2), 12), backgroundColor: '#ef4444' },
]

// Selectable dates example
export const SELECTABLE_EVENTS = [
  { id: 1, title: 'Meeting', start: fmt(today, 9), end: fmt(today, 10), backgroundColor: '#3b82f6' },
  { id: 2, title: 'Lunch', start: fmt(d(2), 12), end: fmt(d(2), 13), backgroundColor: '#f59e0b' },
]

// Timeline events
export const TIMELINE_EVENTS = [
  { id: 1, title: 'Project Kickoff', start: fmt(today, 9), end: fmt(today, 11), backgroundColor: '#3b82f6' },
  { id: 2, title: 'Design Review', start: fmt(d(1), 10), end: fmt(d(1), 12), backgroundColor: '#8b5cf6' },
  { id: 3, title: 'Development', start: fmt(d(2), 9), end: fmt(d(4), 17), backgroundColor: '#10b981' },
  { id: 4, title: 'Testing', start: fmt(d(3), 13), end: fmt(d(3), 17), backgroundColor: '#f59e0b' },
  { id: 5, title: 'Deployment', start: fmt(d(5), 10), end: fmt(d(5), 14), backgroundColor: '#ef4444' },
]

// Resource timeline events
export const RESOURCES = [
  { id: 'r1', title: 'Room A' },
  { id: 'r2', title: 'Room B', children: [
    { id: 'r2a', title: 'Room B1' },
    { id: 'r2b', title: 'Room B2' },
  ]},
  { id: 'r3', title: 'Room C' },
]

export const RESOURCE_EVENTS = [
  { id: 101, title: 'Room A: Setup',     start: fmt(today, 8),    end: fmt(today, 10),    backgroundColor: '#0ea5e9', resourceId: 'r1' },
  { id: 102, title: 'Room B: All day',   start: fmt(today),       allDay: true,           backgroundColor: '#8b5cf6', resourceId: 'r2' },
  { id: 103, title: 'Room B1: Meeting',  start: fmt(today, 11),   end: fmt(today, 13),    backgroundColor: '#f59e0b', resourceId: 'r2a' },
  { id: 104, title: 'Room C: Workshop',  start: fmt(d(1), 9),     end: fmt(d(1), 17),     backgroundColor: '#10b981', resourceId: 'r3' },
  { id: 105, title: 'Room A: Standup',  start: fmt(d(1), 9),     end: fmt(d(1), 9, 30), backgroundColor: '#ec4899', resourceId: 'r1' },
  { id: 106, title: 'Room B2: Interview',start: fmt(d(2), 14),    end: fmt(d(2), 16),    backgroundColor: '#06b6d4', resourceId: 'r2b' },
]

export const BIZ_HOURS = { daysOfWeek: [1,2,3,4,5], startTime: '09:00', endTime: '18:00' }

export const BIZ_HOURS_CONFIG = {
  default: { daysOfWeek: [1,2,3,4,5], startTime: '09:00', endTime: '18:00' },
  extended: { daysOfWeek: [1,2,3,4,5,6], startTime: '07:00', endTime: '21:00' },
  morning: { daysOfWeek: [1,2,3,4,5], startTime: '06:00', endTime: '14:00' },
  afternoon: { daysOfWeek: [1,2,3,4,5], startTime: '12:00', endTime: '20:00' },
  nightShift: { daysOfWeek: [1,2,3,4,5], startTime: '22:00', endTime: '06:00' },
  split: [
    { daysOfWeek: [1,2,3,4,5], startTime: '09:00', endTime: '12:00' },
    { daysOfWeek: [1,2,3,4,5], startTime: '14:00', endTime: '18:00' },
  ],
  weekend: { daysOfWeek: [0,6], startTime: '10:00', endTime: '16:00' },
  custom: { daysOfWeek: [1,2,3,4,5], startTime: '09:00', endTime: '18:00' },
}

export const DAYS_OF_WEEK = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
]

export const TIMEZONE_EVENTS_UTC = [
  { id: 'tz-1', title: 'Global Standup', start: fmtUtc(today, 14), end: fmtUtc(today, 14, 30), backgroundColor: '#3b82f6' },
  { id: 'tz-2', title: 'Client Review', start: fmtUtc(d(1), 17), end: fmtUtc(d(1), 18), backgroundColor: '#10b981' },
  { id: 'tz-3', title: 'Ops Handoff', start: fmtUtc(d(2), 22), end: fmtUtc(d(2), 23), backgroundColor: '#f59e0b' },
]
