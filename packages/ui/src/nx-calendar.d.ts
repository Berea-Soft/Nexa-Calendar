import { LitElement } from 'lit';
import type {
  ViewType,
  EventInput,
  ICalendarEvent,
  EventSourceRawInput,
  ICalendarPlugin,
  BusinessHours,
  ResourceInput,
} from '@nexa-calendar/core';
import { type NxTheme, type CustomThemeInput } from './themes';
import './components/toolbar';
import './components/event-chip';
import './views/month-view';
import './views/week-view';
import './views/work-week-view';
import './views/day-view';
import './views/list-view';
import './views/timeline-view';
import './views/year-view';
import './views/resource-timeline-view';
export type NxCalendarOptions = {
  events?: EventInput[];
  resources?: ResourceInput[];
  eventSources?: EventSourceRawInput[];
  view?: ViewType;
  locale?: string;
  businessHours?: BusinessHours | BusinessHours[] | boolean;
  minTime?: string;
  maxTime?: string;
  slotDuration?: number;
  slotLabelFormat?: string;
  scrollToTime?: string;
  dayMaxEvents?: number | boolean;
  fixedWeekCount?: boolean;
  weekends?: boolean;
  showNonCurrentDates?: boolean;
  firstDay?: number;
  editable?: boolean;
  eventStartEditable?: boolean;
  eventDurationEditable?: boolean;
  plugins?: ICalendarPlugin[];
  headerToolbar?:
    | boolean
    | {
        start?: string;
        center?: string;
        end?: string;
      };
  height?: 'auto' | number | string;
  aspectRatio?: number;
};
export declare class NxCalendar extends LitElement {
  private _store;
  private _unsubscribe?;
  private _state;
  private _grid;
  private _resources;
  private _selectionRange;
  set events(value: EventInput[]);
  set resources(value: ResourceInput[]);
  set view(value: ViewType);
  locale: string;
  weekends: boolean;
  showNonCurrentDates: boolean;
  fixedWeekCount: boolean;
  dayMaxEvents: number | boolean;
  firstDay: number;
  editable: boolean;
  eventStartEditable: boolean;
  eventDurationEditable: boolean;
  minTime: string;
  maxTime: string;
  slotDuration: number;
  hourHeight: number;
  slotLabelFormat: string;
  scrollToTime: string;
  businessHours: BusinessHours | BusinessHours[] | boolean;
  headerToolbar: boolean | Record<string, string>;
  theme: NxTheme | CustomThemeInput;
  views: ViewType[];
  private _modalEvent;
  connectedCallback(): void;
  disconnectedCallback(): void;
  private _handleWindowResize;
  updated(changed: Map<string, unknown>): void;
  private _generateGrid;
  private _getRange;
  private _getTitle;
  private _handleViewChange;
  private _handlePrev;
  private _handleNext;
  private _handleToday;
  private _reFetchSources;
  private _handleDateClick;
  private _handleEventClick;
  private _handleEventDrop;
  private _handleEventResize;
  private _handleDrop;
  addSource(input: EventSourceRawInput): string;
  removeSource(id: string): boolean;
  addEvent(input: EventInput): ICalendarEvent | null;
  updateEvent(id: string | number, props: Partial<EventInput>): ICalendarEvent | undefined;
  removeEvent(id: string | number): boolean;
  getEvents(): ICalendarEvent[];
  getView(): ViewType;
  changeView(view: ViewType): void;
  prev(): void;
  next(): void;
  today(): void;
  goToDate(date: string | import('@bereasoftware/time-guard').TimeGuard): void;
  installPlugin(plugin: ICalendarPlugin): void;
  private _getLocale;
  render(): import('lit').TemplateResult<1>;
  private _renderEventModal;
  protected createRenderRoot(): this;
}
