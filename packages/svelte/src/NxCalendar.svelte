<script lang="ts">
  /**
   * NxCalendar Svelte component wrapper.
   * Imperatively sets props on the `nx-calendar` web component.
   */
  import { onMount, onDestroy, createEventDispatcher } from 'svelte'
  import '@nexa-calendar/ui'
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

  // Props
  export let events: EventInput[] | undefined = undefined
  export let resources: ResourceInput[] | undefined = undefined
  export let view: ViewType | undefined = undefined
  export let views: ViewType[] | undefined = undefined
  export let locale: string | undefined = undefined
  export let theme: NxTheme | undefined = undefined
  export let businessHours: BusinessHours | BusinessHours[] | boolean | undefined = undefined
  export let minTime: string | undefined = undefined
  export let maxTime: string | undefined = undefined
  export let slotDuration: number | undefined = undefined
  export let slotLabelFormat: string | undefined = undefined
  export let scrollToTime: string | undefined = undefined
  export let dayMaxEvents: number | boolean | undefined = undefined
  export let fixedWeekCount: boolean | undefined = undefined
  export let weekends: boolean | undefined = undefined
  export let showNonCurrentDates: boolean | undefined = undefined
  export let firstDay: number | undefined = undefined
  export let editable: boolean | undefined = undefined
  export let eventStartEditable: boolean | undefined = undefined
  export let eventDurationEditable: boolean | undefined = undefined
  export let headerToolbar: boolean | Record<string, string> | undefined = undefined

  const dispatch = createEventDispatcher<{
    dateClick: { date: string; allDay: boolean }
    eventClick: { id: string | number; event: ICalendarEvent }
    eventDrop: { event: ICalendarEvent; oldStart: string; newStart: string }
    eventResize: { event: ICalendarEvent; oldEnd?: string; newEnd: string }
    drop: DropPayload
    editEvent: { id: string | number; event: ICalendarEvent }
  }>()

  let el: HTMLElement & Record<string, unknown>

  const EVENT_NAMES = ['dateClick', 'eventClick', 'eventDrop', 'eventResize', 'drop', 'editEvent'] as const
  const listeners: Array<[string, EventListener]> = []

  const PROPS: Array<[string, unknown]> = []

  function applyProps(): void {
    if (!el) return
    const propMap: Record<string, unknown> = {
      events, resources, view, views, locale, theme, businessHours,
      minTime, maxTime, slotDuration, slotLabelFormat, scrollToTime,
      dayMaxEvents, fixedWeekCount, weekends, showNonCurrentDates,
      firstDay, editable, eventStartEditable, eventDurationEditable, headerToolbar,
    }
    for (const [key, val] of Object.entries(propMap)) {
      if (val !== undefined) el[key] = val
    }
  }

  onMount(async () => {
    await customElements.whenDefined('nx-calendar')
    applyProps()
    for (const name of EVENT_NAMES) {
      const handler = ((e: CustomEvent) => dispatch(name, e.detail)) as EventListener
      el.addEventListener(name, handler)
      listeners.push([name, handler])
    }
  })

  onDestroy(() => {
    for (const [name, handler] of listeners) {
      el?.removeEventListener(name, handler)
    }
  })

  // Reactive: re-apply when any prop changes
  $: if (el) applyProps()

  /** Expose the underlying WC element */
  export function getElement(): HTMLElement { return el }
</script>

<nx-calendar bind:this={el}></nx-calendar>
