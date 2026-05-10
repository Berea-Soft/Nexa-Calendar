/**
 * @nexa-calendar/vue
 *
 * Vue 3 wrapper for NxCalendar web component.
 *
 * Usage:
 *   import { NxCalendar } from '@nexa-calendar/vue'
 *   // In your Vue component:
 *   <NxCalendar :events="events" view="month" theme="light" @eventClick="onEventClick" />
 *
 * The wrapper uses defineComponent + a render function that creates the
 * `nx-calendar` custom element imperatively, forwarding all props and events.
 * No shadow DOM — all styling via CSS custom properties.
 */

import '@nexa-calendar/ui'
import {
  defineComponent,
  h,
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  type PropType,
} from 'vue'
import type {
  EventInput,
  ViewType,
  ICalendarEvent,
  EventSourceRawInput,
  ICalendarPlugin,
  BusinessHours,
  DropPayload,
  ResourceInput,
} from '@nexa-calendar/core'
import type { NxTheme } from '@nexa-calendar/ui'

export interface NxCalendarProps {
  events?: EventInput[]
  resources?: ResourceInput[]
  eventSources?: EventSourceRawInput[]
  view?: ViewType
  views?: ViewType[]
  locale?: string
  theme?: NxTheme
  businessHours?: BusinessHours | BusinessHours[] | boolean
  minTime?: string
  maxTime?: string
  slotDuration?: number
  slotLabelFormat?: string
  scrollToTime?: string
  dayMaxEvents?: number | boolean
  fixedWeekCount?: boolean
  weekends?: boolean
  showNonCurrentDates?: boolean
  firstDay?: number
  editable?: boolean
  eventStartEditable?: boolean
  eventDurationEditable?: boolean
  plugins?: ICalendarPlugin[]
  headerToolbar?: boolean | Record<string, string>
  height?: 'auto' | number | string
  aspectRatio?: number
}

/** Thin type that extends the bare HTMLElement with NxCalendar's imperative API */
export interface NxCalendarElement extends HTMLElement, NxCalendarProps {
  addEvent(input: EventInput): ICalendarEvent | null
  updateEvent(id: string | number, props: Partial<EventInput>): ICalendarEvent | undefined
  removeEvent(id: string | number): boolean
  getEvents(): ICalendarEvent[]
  getView(): ViewType
  changeView(view: ViewType): void
  prev(): void
  next(): void
  today(): void
  goToDate(date: string): void
  requestUpdate(): void
}

const PROP_KEYS: Array<keyof NxCalendarProps> = [
  'events', 'resources', 'eventSources', 'view', 'views', 'locale', 'theme',
  'businessHours', 'minTime', 'maxTime', 'slotDuration', 'slotLabelFormat',
  'scrollToTime', 'dayMaxEvents', 'fixedWeekCount', 'weekends',
  'showNonCurrentDates', 'firstDay', 'editable', 'eventStartEditable',
  'eventDurationEditable', 'plugins', 'headerToolbar', 'height', 'aspectRatio',
]

const EVENT_MAP: Record<string, string> = {
  onDateClick: 'dateClick',
  onEventClick: 'eventClick',
  onEventDrop: 'eventDrop',
  onEventResize: 'eventResize',
  onDrop: 'drop',
  onEditEvent: 'editEvent',
}

export const NxCalendar = defineComponent({
  name: 'NxCalendar',
  props: {
    events: Array as PropType<EventInput[]>,
    resources: Array as PropType<ResourceInput[]>,
    eventSources: Array as PropType<EventSourceRawInput[]>,
    view: String as PropType<ViewType>,
    views: Array as PropType<ViewType[]>,
    locale: String,
    theme: String as PropType<NxTheme>,
    businessHours: [Object, Boolean] as PropType<BusinessHours | BusinessHours[] | boolean>,
    minTime: String,
    maxTime: String,
    slotDuration: Number,
    slotLabelFormat: String,
    scrollToTime: String,
    dayMaxEvents: [Number, Boolean] as PropType<number | boolean>,
    fixedWeekCount: Boolean,
    weekends: Boolean,
    showNonCurrentDates: Boolean,
    firstDay: Number,
    editable: Boolean,
    eventStartEditable: Boolean,
    eventDurationEditable: Boolean,
    plugins: Array as PropType<ICalendarPlugin[]>,
    headerToolbar: [Boolean, Object] as PropType<boolean | Record<string, string>>,
    height: [String, Number] as PropType<'auto' | number | string>,
    aspectRatio: Number,
  },
  emits: [
    'dateClick', 'eventClick', 'eventDrop', 'eventResize', 'drop', 'editEvent',
  ],
  setup(props, { emit, expose }) {
    const elRef = ref<NxCalendarElement | null>(null)
    const listeners: Array<[string, EventListener]> = []

    /** Push a prop value onto the WC element imperatively */
    function applyProp(key: keyof NxCalendarProps, value: unknown): void {
      const el = elRef.value
      if (!el) return
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(el as any)[key] = value
    }

    function applyAllProps(): void {
      for (const key of PROP_KEYS) {
        const value = props[key as keyof typeof props]
        if (value !== undefined) applyProp(key, value)
      }
    }

    function attachListeners(): void {
      const el = elRef.value
      if (!el) return
      for (const [emitName, domEvent] of Object.entries(EVENT_MAP)) {
        const handler = ((e: CustomEvent) => {
          // strip the 'on' prefix to get the Vue emit name
          const name = emitName.replace(/^on([A-Z])/, (_, c: string) => c.toLowerCase())
          emit(name as Parameters<typeof emit>[0], e.detail)
        }) as EventListener
        el.addEventListener(domEvent, handler)
        listeners.push([domEvent, handler])
      }
    }

    function detachListeners(): void {
      const el = elRef.value
      if (!el) return
      for (const [domEvent, handler] of listeners) {
        el.removeEventListener(domEvent, handler)
      }
      listeners.length = 0
    }

    onMounted(async () => {
      await customElements.whenDefined('nx-calendar')
      applyAllProps()
      attachListeners()
    })

    onBeforeUnmount(() => {
      detachListeners()
    })

    // Watch every prop and push changes to the WC
    for (const key of PROP_KEYS) {
      watch(
        () => props[key as keyof typeof props],
        (val) => {
          if (val !== undefined) applyProp(key, val)
        },
        { deep: true },
      )
    }

    // Expose the underlying WC element for imperative API access
    expose({ el: elRef })

    return () => h('nx-calendar', { ref: elRef })
  },
})

export type { NxTheme, EventInput, ViewType, ICalendarEvent, DropPayload, ResourceInput }
