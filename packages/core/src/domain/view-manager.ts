import { TimeGuard } from '@bereasoftware/time-guard';
import type {
  ViewType,
  DayCell,
  DayColumn,
  ListEvent,
  IView,
  TimelineGrid,
  TimelineColumn,
  TimelinePositionedEvent,
  TimelineEventRow,
  ResourceTimelineGrid,
  ResourceTimelineRow,
  YearGrid,
  YearMonth,
  YearMonthCell,
} from '../types/view';
import type { ICalendarEvent } from '../types/event';
import type { IResource } from '../types/resource';
import { DateUtils } from './date-utils';

class MonthView implements IView {
  readonly type: ViewType = 'month';

  getTitle(range: { start: TimeGuard; end: TimeGuard }, locale?: string): string {
    const d = range.start;
    if (locale) return `${d.locale(locale).format('MMMM')} ${d.year()}`;
    return `${this._monthName(d.month())} ${d.year()}`;
  }

  generateGrid(range: { start: TimeGuard; end: TimeGuard }, events: ICalendarEvent[]): DayCell[] {
    const currentMonth = range.start;
    const days = DateUtils.generateMonthGrid(currentMonth);
    const today = DateUtils.today();
    return days.map(date => ({
      date,
      isCurrentMonth: date.month() === currentMonth.month(),
      isToday: date.isSame(today, 'day'),
      events: events.filter(e => DateUtils.isSameDay(e.start, date)),
    }));
  }

  private _monthName(m: number): string {
    return [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ][m - 1];
  }
}

class WorkWeekView implements IView {
  readonly type: ViewType = 'workWeek';

  getTitle(range: { start: TimeGuard; end: TimeGuard }, locale?: string): string {
    const s = range.start;
    const e = range.end;
    if (locale) {
      return `${s.locale(locale).format('MMM D')} – ${e.locale(locale).format('MMM D, YYYY')}`;
    }
    return `Work Week: ${this._monthName(s.month())} ${s.day()} – ${this._monthName(e.month())} ${e.day()}, ${e.year()}`;
  }

  generateGrid(range: { start: TimeGuard; end: TimeGuard }, events: ICalendarEvent[]): DayColumn[] {
    const days = DateUtils.generateWeekDays(range.start).filter(d => {
      const dow = d.dayOfWeek();
      return dow >= 1 && dow <= 5;
    });
    const slots = DateUtils.generateTimeSlots();
    return days.map(date => ({
      date,
      slots: slots.map(hour => ({
        hour,
        date,
        events: events.filter(e => DateUtils.isSameDay(e.start, date) && e.start.hour() === hour),
      })),
      allDayEvents: events.filter(e => DateUtils.isSameDay(e.start, date) && e.allDay),
    }));
  }

  private _monthName(m: number): string {
    return [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ][m - 1];
  }
}

class WeekView implements IView {
  readonly type: ViewType = 'week';

  getTitle(range: { start: TimeGuard; end: TimeGuard }, locale?: string): string {
    const s = range.start;
    const e = range.end;
    if (locale) {
      return `Week of ${s.locale(locale).format('MMM D, YYYY')} – ${e.locale(locale).format('MMM D, YYYY')}`;
    }
    return `Week of ${this._monthName(s.month())} ${s.day()}, ${s.year()} – ${this._monthName(e.month())} ${e.day()}, ${e.year()}`;
  }

  generateGrid(range: { start: TimeGuard; end: TimeGuard }, events: ICalendarEvent[]): DayColumn[] {
    const days = DateUtils.generateWeekDays(range.start);
    const slots = DateUtils.generateTimeSlots();
    return days.map(date => ({
      date,
      slots: slots.map(hour => ({
        hour,
        date,
        events: events.filter(e => DateUtils.isSameDay(e.start, date) && e.start.hour() === hour),
      })),
      allDayEvents: events.filter(e => DateUtils.isSameDay(e.start, date) && e.allDay),
    }));
  }

  private _monthName(m: number): string {
    return [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ][m - 1];
  }
}

class DayView implements IView {
  readonly type: ViewType = 'day';

  getTitle(range: { start: TimeGuard; end: TimeGuard }, locale?: string): string {
    const d = range.start;
    if (locale) return d.locale(locale).format('dddd, MMMM D, YYYY');
    return `${this._weekdayName(d.dayOfWeek())}, ${this._monthName(d.month())} ${d.day()}, ${d.year()}`;
  }

  generateGrid(range: { start: TimeGuard; end: TimeGuard }, events: ICalendarEvent[]): DayColumn[] {
    const date = range.start;
    const slots = DateUtils.generateTimeSlots();
    return [
      {
        date,
        slots: slots.map(hour => ({
          hour,
          date,
          events: events.filter(e => DateUtils.isSameDay(e.start, date) && e.start.hour() === hour),
        })),
        allDayEvents: events.filter(e => DateUtils.isSameDay(e.start, date) && e.allDay),
      },
    ];
  }

  private _monthName(m: number): string {
    return [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ][m - 1];
  }
  private _weekdayName(d: number): string {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d % 7];
  }
}

class ListView implements IView {
  readonly type: ViewType = 'list';

  getTitle(range: { start: TimeGuard; end: TimeGuard }, locale?: string): string {
    if (locale) {
      return `Events: ${range.start.locale(locale).format('MMM D, YYYY')} – ${range.end.locale(locale).format('MMM D, YYYY')}`;
    }
    return `Events: ${range.start.format('date')} – ${range.end.format('date')}`;
  }

  generateGrid(range: { start: TimeGuard; end: TimeGuard }, events: ICalendarEvent[]): ListEvent[] {
    return events
      .filter(e => e.start.isBetween(range.start, range.end, 'day', '[)'))
      .sort((a, b) => a.start.valueOf() - b.start.valueOf())
      .map(event => ({ event, date: event.start }));
  }
}

class TimelineView implements IView {
  readonly type: ViewType = 'timeline';

  getTitle(range: { start: TimeGuard; end: TimeGuard }, locale?: string): string {
    const s = range.start;
    const e = range.end;
    const days = e.diff(s, 'day');
    if (locale) {
      if (days <= 1) return s.locale(locale).format('dddd, MMMM D, YYYY');
      if (days <= 7)
        return `${s.locale(locale).format('MMM D')} – ${e.locale(locale).format('MMM D, YYYY')}`;
      return `${s.locale(locale).format('MMMM YYYY')}`;
    }
    return `Timeline: ${s.format('date')} – ${e.format('date')}`;
  }

  generateGrid(
    range: { start: TimeGuard; end: TimeGuard },
    events: ICalendarEvent[],
    _resources?: IResource[]
  ): TimelineGrid | ResourceTimelineGrid {
    const durationDays = range.end.diff(range.start, 'day');
    const columns = this._generateColumns(range, durationDays);
    const eventRows = this._layoutEvents(events, range, columns);
    return { columns, eventRows };
  }

  protected _generateColumns(
    range: { start: TimeGuard; end: TimeGuard },
    durationDays: number
  ): TimelineColumn[] {
    const cols: TimelineColumn[] = [];
    const today = DateUtils.today();
    let cursor = range.start.startOf('day');

    if (durationDays <= 1) {
      while (cursor.isBefore(range.end)) {
        cols.push({
          date: cursor,
          label: cursor.format('h:mm a'),
          isToday: cursor.isSame(today, 'day'),
          isWeekend: false,
        });
        cursor = cursor.add({ hour: 1 });
      }
    } else {
      while (cursor.isBefore(range.end) || cursor.isSame(range.end, 'day')) {
        const dow = cursor.dayOfWeek();
        cols.push({
          date: cursor,
          label: cursor.format('ddd D'),
          isToday: cursor.isSame(today, 'day'),
          isWeekend: dow === 0 || dow === 6,
        });
        cursor = cursor.add({ day: 1 });
      }
    }
    return cols;
  }

  protected _positionEvents(
    events: ICalendarEvent[],
    range: { start: TimeGuard; end: TimeGuard }
  ): TimelinePositionedEvent[] {
    const totalMs = range.end.valueOf() - range.start.valueOf();
    if (totalMs <= 0) return [];
    return events
      .filter(e => e.start.isBefore(range.end) && (!e.end || e.end.isAfter(range.start)))
      .map(e => {
        const eventStart = e.start.isBefore(range.start) ? range.start : e.start;
        const eventEnd = e.end && e.end.isAfter(eventStart) ? e.end : eventStart.add({ day: 1 });
        const leftMs = eventStart.valueOf() - range.start.valueOf();
        const widthMs = eventEnd.valueOf() - eventStart.valueOf();
        return {
          event: e,
          leftPct: Math.max(0, (leftMs / totalMs) * 100),
          widthPct: Math.max(0.5, (widthMs / totalMs) * 100),
        };
      })
      .sort((a, b) => a.leftPct - b.leftPct || b.widthPct - a.widthPct);
  }

  protected _layoutEvents(
    events: ICalendarEvent[],
    range: { start: TimeGuard; end: TimeGuard },
    _cols: TimelineColumn[]
  ): TimelineEventRow[] {
    const positioned = this._positionEvents(events, range);
    const rows: TimelineEventRow[] = [];
    for (const p of positioned) {
      let placed = false;
      for (const row of rows) {
        const overlaps = row.events.some(
          r => p.leftPct < r.leftPct + r.widthPct && p.leftPct + p.widthPct > r.leftPct
        );
        if (!overlaps) {
          row.events.push(p);
          placed = true;
          break;
        }
      }
      if (!placed) rows.push({ events: [p] });
    }
    return rows;
  }
}

class ResourceTimelineDayView extends TimelineView {
  override readonly type: ViewType = 'timelineDay';

  override getTitle(range: { start: TimeGuard; end: TimeGuard }, locale?: string): string {
    const d = range.start;
    return locale ? d.locale(locale).format('dddd, MMMM D, YYYY') : `${d.format('date')}`;
  }

  override generateGrid(
    range: { start: TimeGuard; end: TimeGuard },
    events: ICalendarEvent[],
    resources: IResource[] = []
  ): TimelineGrid | ResourceTimelineGrid {
    return this._buildResourceGrid(range, events, resources, 1);
  }

  protected _buildResourceGrid(
    range: { start: TimeGuard; end: TimeGuard },
    events: ICalendarEvent[],
    resources: IResource[],
    durationDays: number
  ): ResourceTimelineGrid {
    const columns = this._generateColumns(range, durationDays);
    const rows = this._buildRows(resources, events, range, 0);
    return { columns, rows };
  }

  protected _buildRows(
    resources: IResource[],
    events: ICalendarEvent[],
    range: { start: TimeGuard; end: TimeGuard },
    depth: number
  ): ResourceTimelineRow[] {
    const rows: ResourceTimelineRow[] = [];
    for (const res of resources) {
      const resEvents = events.filter(e => {
        const rid = e.resourceId;
        return rid === res.id || (Array.isArray(rid) && rid.includes(res.id));
      });
      rows.push({
        resource: res,
        depth,
        collapsed: false,
        events: this._positionEvents(resEvents, range),
      });
      if (res.children?.length) {
        rows.push(...this._buildRows(res.children as IResource[], events, range, depth + 1));
      }
    }
    return rows;
  }
}

class ResourceTimelineWeekView extends ResourceTimelineDayView {
  override readonly type: ViewType = 'timelineWeek';

  override getTitle(range: { start: TimeGuard; end: TimeGuard }, locale?: string): string {
    const s = range.start;
    const e = range.end;
    return locale
      ? `${s.locale(locale).format('MMM D')} – ${e.locale(locale).format('MMM D, YYYY')}`
      : `${s.format('date')} – ${e.format('date')}`;
  }

  override generateGrid(
    range: { start: TimeGuard; end: TimeGuard },
    events: ICalendarEvent[],
    resources: IResource[] = []
  ): TimelineGrid | ResourceTimelineGrid {
    return this._buildResourceGrid(range, events, resources, 7);
  }
}

class TimelineWorkWeekView extends TimelineView {
  override readonly type: ViewType = 'timelineWorkWeek';

  override getTitle(range: { start: TimeGuard; end: TimeGuard }, locale?: string): string {
    const s = range.start;
    const e = range.end;
    return locale
      ? `${s.locale(locale).format('MMM D')} – ${e.locale(locale).format('MMM D, YYYY')}`
      : `${s.format('date')} – ${e.format('date')}`;
  }

  override generateGrid(
    range: { start: TimeGuard; end: TimeGuard },
    events: ICalendarEvent[]
  ): TimelineGrid {
    return this._buildTimelineGrid(range, events, 5);
  }
}

class ResourceTimelineWorkWeekView extends ResourceTimelineDayView {
  override readonly type: ViewType = 'timelineWorkWeek';

  override getTitle(range: { start: TimeGuard; end: TimeGuard }, locale?: string): string {
    const s = range.start;
    const e = range.end;
    return locale
      ? `${s.locale(locale).format('MMM D')} – ${e.locale(locale).format('MMM D, YYYY')}`
      : `${s.format('date')} – ${e.format('date')}`;
  }

  override generateGrid(
    range: { start: TimeGuard; end: TimeGuard },
    events: ICalendarEvent[],
    resources: IResource[] = []
  ): TimelineGrid | ResourceTimelineGrid {
    return this._buildResourceGrid(range, events, resources, 5);
  }
}

class ResourceTimelineMonthView extends ResourceTimelineDayView {
  override readonly type: ViewType = 'timelineMonth';

  override getTitle(range: { start: TimeGuard; end: TimeGuard }, locale?: string): string {
    const d = range.start;
    return locale ? d.locale(locale).format('MMMM YYYY') : `${d.format('date')}`;
  }

  override generateGrid(
    range: { start: TimeGuard; end: TimeGuard },
    events: ICalendarEvent[],
    resources: IResource[] = []
  ): TimelineGrid | ResourceTimelineGrid {
    const days = range.end.diff(range.start, 'day');
    return this._buildResourceGrid(range, events, resources, days);
  }
}

class YearView implements IView {
  readonly type: ViewType = 'year';

  getTitle(range: { start: TimeGuard; end: TimeGuard }, locale?: string): string {
    const year = range.start.year();
    return `${year}`;
  }

  generateGrid(range: { start: TimeGuard; end: TimeGuard }, events: ICalendarEvent[]): YearGrid {
    const year = range.start.year();
    const today = DateUtils.today();
    const months: YearMonth[] = [];

    for (let m = 1; m <= 12; m++) {
      const monthDate = DateUtils.from(`${year}-${String(m).padStart(2, '0')}-01`);
      const monthDays = DateUtils.generateMonthGrid(monthDate);
      const cells: YearMonthCell[] = monthDays.map(date => {
        const dayEvents = events.filter(e => DateUtils.isSameDay(e.start, date));
        return {
          date,
          isCurrentMonth: date.month() === m,
          isToday: date.isSame(today, 'day'),
          hasEvents: dayEvents.length > 0,
          eventCount: dayEvents.length,
        };
      });
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      months.push({ monthDate, label: monthNames[m - 1], cells });
    }

    return { year, months };
  }
}

type ViewFactory = () => IView;

export class ViewManager {
  private _currentType: ViewType = 'month';
  private _factories: Map<ViewType, ViewFactory> = new Map();
  private _instances: Map<ViewType, IView> = new Map();

  constructor() {
    this.register('month', () => new MonthView());
    this.register('workWeek', () => new WorkWeekView());
    this.register('week', () => new WeekView());
    this.register('day', () => new DayView());
    this.register('list', () => new ListView());
    this.register('timeline', () => new TimelineView());
    this.register('timelineDay', () => new ResourceTimelineDayView());
    this.register('timelineWeek', () => new ResourceTimelineWeekView());
    this.register('timelineMonth', () => new ResourceTimelineMonthView());
    this.register('year', () => new YearView());
  }

  get currentType(): ViewType {
    return this._currentType;
  }

  register(type: ViewType, factory: ViewFactory): void {
    this._factories.set(type, factory);
  }

  setView(type: ViewType): void {
    this._currentType = type;
  }

  getView(type?: ViewType): IView {
    const t = type ?? this._currentType;
    if (!this._instances.has(t)) {
      const factory = this._factories.get(t);
      if (!factory) throw new Error(`View "${t}" not registered`);
      this._instances.set(t, factory());
    }
    return this._instances.get(t)!;
  }
}
