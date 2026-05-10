import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core'
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

type NxCalendarEl = HTMLElement & Record<string, unknown>

const PROP_KEYS = [
  'events', 'resources', 'eventSources', 'view', 'views', 'locale', 'theme',
  'businessHours', 'minTime', 'maxTime', 'slotDuration', 'slotLabelFormat',
  'scrollToTime', 'dayMaxEvents', 'fixedWeekCount', 'weekends',
  'showNonCurrentDates', 'firstDay', 'editable', 'eventStartEditable',
  'eventDurationEditable', 'plugins', 'headerToolbar', 'height', 'aspectRatio',
] as const

const WC_EVENTS = ['dateClick', 'eventClick', 'eventDrop', 'eventResize', 'drop', 'editEvent'] as const

@Component({
  selector: 'nx-calendar-wrapper',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<nx-calendar #calEl></nx-calendar>`,
})
export class NxCalendarComponent implements OnInit, OnDestroy, OnChanges {
  @Input() events?: EventInput[]
  @Input() resources?: ResourceInput[]
  @Input() eventSources?: EventSourceRawInput[]
  @Input() view?: ViewType
  @Input() views?: ViewType[]
  @Input() locale?: string
  @Input() theme?: NxTheme
  @Input() businessHours?: BusinessHours | BusinessHours[] | boolean
  @Input() minTime?: string
  @Input() maxTime?: string
  @Input() slotDuration?: number
  @Input() slotLabelFormat?: string
  @Input() scrollToTime?: string
  @Input() dayMaxEvents?: number | boolean
  @Input() fixedWeekCount?: boolean
  @Input() weekends?: boolean
  @Input() showNonCurrentDates?: boolean
  @Input() firstDay?: number
  @Input() editable?: boolean
  @Input() eventStartEditable?: boolean
  @Input() eventDurationEditable?: boolean
  @Input() plugins?: ICalendarPlugin[]
  @Input() headerToolbar?: boolean | Record<string, string>
  @Input() height?: 'auto' | number | string
  @Input() aspectRatio?: number

  @Output() dateClick = new EventEmitter<{ date: string; allDay: boolean }>()
  @Output() eventClick = new EventEmitter<{ id: string | number; event: ICalendarEvent }>()
  @Output() eventDrop = new EventEmitter<{ event: ICalendarEvent; oldStart: string; newStart: string }>()
  @Output() eventResize = new EventEmitter<{ event: ICalendarEvent; oldEnd?: string; newEnd: string }>()
  @Output() drop = new EventEmitter<DropPayload>()
  @Output() editEvent = new EventEmitter<{ id: string | number; event: ICalendarEvent }>()

  private _listeners: Array<[string, EventListener]> = []

  constructor(private _host: ElementRef<HTMLElement>) {}

  private get _el(): NxCalendarEl | null {
    return this._host.nativeElement.querySelector('nx-calendar') as NxCalendarEl | null
  }

  async ngOnInit(): Promise<void> {
    await customElements.whenDefined('nx-calendar')
    this._applyAllProps()
    this._attachListeners()
  }

  ngOnDestroy(): void {
    this._detachListeners()
  }

  ngOnChanges(changes: SimpleChanges): void {
    const el = this._el
    if (!el) return
    for (const key of PROP_KEYS) {
      if (key in changes && changes[key].currentValue !== undefined) {
        el[key] = changes[key].currentValue
      }
    }
  }

  private _applyAllProps(): void {
    const el = this._el
    if (!el) return
    for (const key of PROP_KEYS) {
      const val = (this as Record<string, unknown>)[key]
      if (val !== undefined) el[key] = val
    }
  }

  private _attachListeners(): void {
    const el = this._el
    if (!el) return
    const emitters: Record<string, EventEmitter<unknown>> = {
      dateClick: this.dateClick as EventEmitter<unknown>,
      eventClick: this.eventClick as EventEmitter<unknown>,
      eventDrop: this.eventDrop as EventEmitter<unknown>,
      eventResize: this.eventResize as EventEmitter<unknown>,
      drop: this.drop as EventEmitter<unknown>,
      editEvent: this.editEvent as EventEmitter<unknown>,
    }
    for (const name of WC_EVENTS) {
      const handler = ((e: CustomEvent) => emitters[name].emit(e.detail)) as EventListener
      el.addEventListener(name, handler)
      this._listeners.push([name, handler])
    }
  }

  private _detachListeners(): void {
    const el = this._el
    if (!el) return
    for (const [name, handler] of this._listeners) {
      el.removeEventListener(name, handler)
    }
    this._listeners = []
  }

  /** Imperative API passthrough */
  getElement(): NxCalendarEl | null { return this._el }
}
