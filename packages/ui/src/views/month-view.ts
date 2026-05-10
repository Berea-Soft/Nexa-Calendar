import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { DayCell, ICalendarEvent, Locale, BusinessHours } from '@nexa-calendar/core';
import { DateUtils, getLocale } from '@nexa-calendar/core';

@customElement('nx-month-view')
export class NxMonthView extends LitElement {
  @property({ type: Array }) cells: DayCell[] = [];
  @property({ type: Object }) locale: Locale = getLocale('en');
  @property({ type: [Number, Boolean] }) dayMaxEvents: number | boolean = false;
  @property({ type: Boolean }) showNonCurrentDates = true;
  @property({ type: Boolean }) weekends = true;
  @property({ type: Number }) firstDay = 0;
  @property({ type: Boolean }) editable = true;
  @property({ type: Boolean }) eventStartEditable = true;
  @property({ type: Object }) businessHours: BusinessHours | BusinessHours[] | boolean = false;
  eventContent?: (event: ICalendarEvent) => { template: string; className?: string };

  @state() private _popoverCell: DayCell | null = null;

  render() {
    const weekdays = this._getWeekdays();
    const weeks = this._getWeeks();
    const maxEvents =
      this.dayMaxEvents === true ? Infinity : (this.dayMaxEvents as number) || Infinity;

    return html` <div class="grid grid-cols-7" style="gap: 1px; background: var(--nx-border);">
      ${weekdays.map(
        d => html`
          <div
            style="background: var(--nx-header-bg); color: var(--nx-text-muted);"
            class="px-3 py-2 text-center text-xs font-semibold uppercase tracking-wider"
          >
            ${d}
          </div>
        `
      )}
      ${weeks.flatMap((_week, _wi) =>
        _week.map((cell, ci) => {
          if (!this.weekends && (ci === 0 || ci === 6)) return html``;
          if (!this.showNonCurrentDates && !cell.isCurrentMonth) return html``;
          const isBiz = this._isBusinessDay(cell.date);
          const visibleEvents = this._getVisibleEvents(cell.events, maxEvents);
          const hasMore = cell.events.length > visibleEvents.length;
          const showPopover = this._popoverCell?.date.toISOString() === cell.date.toISOString();
          const cellBg = cell.isToday
            ? 'var(--nx-today-bg)'
            : !cell.isCurrentMonth
              ? 'var(--nx-surface-alt)'
              : 'var(--nx-surface)';
          const todayRing = cell.isToday ? `box-shadow: inset 0 0 0 2px var(--nx-today-ring);` : '';
          return html` <div
            style="background: ${cellBg}; ${todayRing} min-height: 100px; opacity: ${isBiz
              ? 1
              : 0.6}; position: relative; padding: 6px; cursor: pointer; transition: background 0.15s;"
            @mouseenter=${(e: MouseEvent) =>
              ((e.currentTarget as HTMLElement).style.background = `var(--nx-hover)`)}
            @mouseleave=${(e: MouseEvent) =>
              ((e.currentTarget as HTMLElement).style.background = cellBg)}
            @click=${() => this._selectDate(cell)}
            @dragover=${(e: DragEvent) => e.preventDefault()}
            @drop=${(e: DragEvent) => this._onDrop(e, cell)}
          >
            <span
              style="font-size: 0.8rem; font-weight: 600; color: ${cell.isToday
                ? 'var(--nx-accent)'
                : cell.isCurrentMonth
                  ? 'var(--nx-text)'
                  : 'var(--nx-text-faint)'};"
            >
              ${cell.isToday
                ? html`<span
                    style="background: var(--nx-accent); color: var(--nx-accent-text); border-radius: 999px; width: 1.5rem; height: 1.5rem; display: inline-flex; align-items: center; justify-content: center; font-size: 0.75rem;"
                    >${cell.date.day()}</span
                  >`
                : cell.date.day()}
            </span>
            <div style="margin-top: 4px; display: flex; flex-direction: column; gap: 2px;">
              ${visibleEvents.map(
                e => html`
                  <div
                    style="${e.display === 'background'
                      ? `background: color-mix(in srgb, ${e.backgroundColor ?? 'var(--nx-accent)'} 15%, transparent); border-left: 3px solid ${e.backgroundColor ?? 'var(--nx-accent)'}; color: var(--nx-text-muted); margin: 0 -6px; padding: 2px 6px;`
                      : `background: ${e.backgroundColor ?? 'var(--nx-accent)'}; color: ${e.textColor ?? '#fff'}; border-radius: 4px; padding: 2px 6px;`}
                    font-size: 0.72rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: pointer; transition: opacity 0.1s;"
                    title="${e.title}"
                    draggable=${this.eventStartEditable && e.startEditable}
                    @mouseenter=${(ev: MouseEvent) =>
                      ((ev.currentTarget as HTMLElement).style.opacity = '0.8')}
                    @mouseleave=${(ev: MouseEvent) =>
                      ((ev.currentTarget as HTMLElement).style.opacity = '1')}
                    @click=${(ev: Event) => {
                      ev.stopPropagation();
                      this._eventClick(ev, e);
                    }}
                    @dragstart=${(ev: DragEvent) => this._onEventDragStart(ev, e)}
                  >
                    ${e.display === 'background'
                      ? e.title
                      : (() => {
                          const content = this._renderEventContent(e);
                          return html`<span class=${content.className}>${content.html}</span>`;
                        })()}
                  </div>
                `
              )}
              ${hasMore
                ? html` <div
                    style="font-size: 0.72rem; color: var(--nx-accent); font-weight: 600; padding: 0 4px; cursor: pointer;"
                    @mouseenter=${(e: MouseEvent) =>
                      ((e.currentTarget as HTMLElement).style.color = 'var(--nx-accent-hover)')}
                    @mouseleave=${(e: MouseEvent) =>
                      ((e.currentTarget as HTMLElement).style.color = 'var(--nx-accent)')}
                    @click=${(ev: Event) => {
                      ev.stopPropagation();
                      this._togglePopover(cell);
                    }}
                  >
                    ${this.locale.moreLinkText(cell.events.length - visibleEvents.length)}
                  </div>`
                : ''}
            </div>
            ${showPopover ? this._renderPopover(cell) : ''}
          </div>`;
        })
      )}
    </div>`;
  }

  private _renderPopover(cell: DayCell) {
    return html` <div
      style="position: absolute; z-index: 50; top: calc(100% + 4px); left: 0; width: 240px; background: var(--nx-surface); border: 1px solid var(--nx-border); border-radius: var(--nx-radius); box-shadow: var(--nx-shadow);"
      @click=${(ev: Event) => ev.stopPropagation()}
    >
      <div
        style="padding: 8px 12px; border-bottom: 1px solid var(--nx-border-light); font-size: 0.8rem; font-weight: 600; color: var(--nx-text);"
      >
        ${cell.date.format('dddd D')}
      </div>
      <div
        style="max-height: 180px; overflow-y: auto; padding: 6px; display: flex; flex-direction: column; gap: 3px;"
      >
        ${cell.events.map(
          e => html`
            <div
              style="${e.display === 'background'
                ? `background: color-mix(in srgb, ${e.backgroundColor ?? 'var(--nx-accent)'} 15%, transparent); border-left: 3px solid ${e.backgroundColor ?? 'var(--nx-accent)'}; color: var(--nx-text-muted);`
                : `background: ${e.backgroundColor ?? 'var(--nx-accent)'}; color: ${e.textColor ?? '#fff'}; border-radius: 4px;`}
              font-size: 0.72rem; padding: 4px 8px; cursor: pointer; transition: opacity 0.1s;"
              @mouseenter=${(ev: MouseEvent) =>
                ((ev.currentTarget as HTMLElement).style.opacity = '0.8')}
              @mouseleave=${(ev: MouseEvent) =>
                ((ev.currentTarget as HTMLElement).style.opacity = '1')}
              @click=${(ev: Event) => {
                ev.stopPropagation();
                this._eventClick(ev, e);
                this._popoverCell = null;
              }}
            >
              ${e.display === 'background'
                ? e.title
                : (() => {
                    const content = this._renderEventContent(e);
                    return html`<span class=${content.className}>${content.html}</span>`;
                  })()}
            </div>
          `
        )}
      </div>
    </div>`;
  }

  private _togglePopover(cell: DayCell) {
    if (this._popoverCell?.date.toISOString() === cell.date.toISOString()) {
      this._popoverCell = null;
    } else {
      this._popoverCell = cell;
    }
  }

  private _closePopoverOnOutsideClick = (ev: MouseEvent) => {
    const target = ev.target as HTMLElement;
    if (!target.closest('nx-month-view')) {
      this._popoverCell = null;
    }
  };

  private _getWeekdays(): string[] {
    const l = this.locale.weekdays.shorthand;
    if (this.firstDay === 0) return [...l];
    return [...l.slice(this.firstDay), ...l.slice(0, this.firstDay)];
  }

  private _getWeeks(): DayCell[][] {
    const weeks: DayCell[][] = [];
    for (let i = 0; i < this.cells.length; i += 7) weeks.push(this.cells.slice(i, i + 7));
    return weeks.filter(w => w.length === 7);
  }

  private _getVisibleEvents(events: ICalendarEvent[], max: number): ICalendarEvent[] {
    const sorted = [...events].sort((a, b) => a.start.valueOf() - b.start.valueOf());
    const bg = sorted.filter(e => e.display === 'background');
    const normal = sorted.filter(e => e.display !== 'background');
    return [...bg, ...(max === Infinity ? normal : normal.slice(0, max))];
  }

  private _isBusinessDay(date: import('@bereasoftware/time-guard').TimeGuard): boolean {
    if (!this.businessHours) return true;
    if (typeof this.businessHours === 'boolean') return this.businessHours;
    const hours = Array.isArray(this.businessHours) ? this.businessHours : [this.businessHours];
    return hours.some(h => DateUtils.isInBusinessHours(date, h));
  }

  private _formatTime(t: { hour(): number; minute(): number }): string {
    const h = t.hour();
    const m = t.minute().toString().padStart(2, '0');
    return `${h % 12 || 12}:${m}${h >= 12 ? 'PM' : 'AM'} `;
  }

  private _renderEventContent(event: ICalendarEvent): { html: string; className: string } {
    if (this.eventContent) {
      const custom = this.eventContent(event);
      return { html: custom.template, className: custom.className ?? '' };
    }
    const timeStr = event.allDay ? '' : this._formatTime(event.start);
    return { html: `${timeStr}${event.title}`, className: '' };
  }

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('click', this._closePopoverOnOutsideClick);
  }

  disconnectedCallback(): void {
    document.removeEventListener('click', this._closePopoverOnOutsideClick);
    super.disconnectedCallback();
  }

  private _selectDate(cell: DayCell) {
    this.dispatchEvent(
      new CustomEvent('dateClick', {
        detail: { date: cell.date, allDay: true },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _eventClick(ev: Event, event: ICalendarEvent) {
    ev.stopPropagation();
    this.dispatchEvent(
      new CustomEvent('eventClick', { detail: event, bubbles: true, composed: true })
    );
  }

  private _onEventDragStart(ev: DragEvent, event: ICalendarEvent) {
    if (!this.eventStartEditable || !event.startEditable) return;
    ev.dataTransfer?.setData('text/plain', JSON.stringify({ eventId: event.id }));
  }

  private _onDrop(e: DragEvent, cell: DayCell) {
    e.preventDefault();
    const data = e.dataTransfer?.getData('text/plain');
    if (!data) return;
    try {
      const { eventId } = JSON.parse(data);
      this.dispatchEvent(
        new CustomEvent('eventDrop', {
          detail: { eventId, newStart: cell.date.toISOString() },
          bubbles: true,
          composed: true,
        })
      );
    } catch {
      /* ignore */
    }
  }

  protected createRenderRoot() {
    return this;
  }
}
