import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { DayColumn, ICalendarEvent, Locale, BusinessHours } from '@nexa-calendar/core';
import { DateUtils, getLocale } from '@nexa-calendar/core';
import {
  buildVisualTimeSlots,
  getBackgroundEventsForSlot,
  getColumnTimedEvents,
  getSlotDateTime,
  getSlotHeight,
  getTimedEventsForSlot,
  isBusinessTimeSlot,
} from '../utils/time-grid';

@customElement('nx-day-view')
export class NxDayView extends LitElement {
  @property({ type: Array }) columns: DayColumn[] = [];
  @property({ type: Object }) locale: Locale = getLocale('en');
  @property({ type: String }) minTime = '00:00';
  @property({ type: String }) maxTime = '24:00';
  @property({ type: Number }) slotDuration = 60;
  @property({ type: Number }) hourHeight = 48;
  @property({ type: String }) slotLabelFormat = 'h:mm a';
  @property({ type: String }) scrollToTime = '06:00';
  @property({ type: Boolean }) editable = true;
  @property({ type: Boolean }) eventStartEditable = true;
  @property({ type: Boolean }) eventDurationEditable = true;
  @property() businessHours: BusinessHours | BusinessHours[] | boolean = false;
  eventContent?: (event: ICalendarEvent) => { template: string; className?: string };

  render() {
    const col = this.columns[0];
    if (!col)
      return html`<div style="padding: 16px; color: var(--nx-text-muted); font-size: 0.875rem;">
        No data
      </div>`;
    const timeSlots = buildVisualTimeSlots(
      this.minTime,
      this.maxTime,
      this.slotDuration,
      this.slotLabelFormat
    );
    const slotHeight = getSlotHeight(this.hourHeight, this.slotDuration);
    const timedEvents = getColumnTimedEvents(col);
    const l = this.locale;

    return html` <div
      style="border: 1px solid var(--nx-border); border-radius: var(--nx-radius); overflow: hidden;"
    >
      <div
        style="background: var(--nx-header-bg); padding: 10px 16px; border-bottom: 1px solid var(--nx-border);"
      >
        <span style="font-size: 0.875rem; font-weight: 600; color: var(--nx-header-text);"
          >${l.weekdays.long[col.date.dayOfWeek() % 7]}, ${l.months.long[col.date.month() - 1]}
          ${col.date.day()}, ${col.date.year()}</span
        >
      </div>
      <div
        class="grid"
        style="grid-template-columns: 80px 1fr; gap: 1px; background: var(--nx-border);"
      >
        <div style="background: var(--nx-surface);">
          ${timeSlots.map(
            slot => html`
              <div
                style="height: ${slotHeight}px; border-bottom: 1px solid var(--nx-border-light); font-size: ${slot.isHourBoundary
                  ? '0.7rem'
                  : '0.63rem'}; color: ${slot.isHourBoundary
                  ? 'var(--nx-text-muted)'
                  : 'var(--nx-text-faint)'}; text-align: right; padding: 2px 8px 0 0; line-height: 1.1; ${slot.isHourBoundary
                  ? 'font-weight: 500;'
                  : ''}"
              >
                ${slot.label}
              </div>
            `
          )}
        </div>
        <div style="background: var(--nx-surface); position: relative;">
          ${timeSlots.map(slot => {
            const isBiz = isBusinessTimeSlot(col.date, slot.totalMinutes, this.businessHours);
            const slotBg = isBiz ? 'transparent' : '#334155';
            const events = isBiz
              ? getTimedEventsForSlot(timedEvents, slot.totalMinutes, this.slotDuration)
              : [];
            const backgroundEvents = isBiz
              ? getBackgroundEventsForSlot(timedEvents, slot.totalMinutes, this.slotDuration)
              : [];
            return html` <div
              style=${'height:' +
              slotHeight +
              'px;border-bottom:1px solid var(--nx-border-light);position:relative;background:' +
              slotBg +
              ';cursor:' +
              (isBiz ? 'pointer' : 'not-allowed') +
              ';transition:background 0.1s;opacity:' +
              (isBiz ? '1' : '0.9') +
              ';'}
              @mouseenter=${(e: MouseEvent) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = isBiz ? 'var(--nx-hover)' : '#1e293b';
              }}
              @mouseleave=${(e: MouseEvent) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = slotBg;
              }}
              @click=${() => this._dateClick(col.date, slot.totalMinutes)}
              @dragover=${(e: DragEvent) => {
                if (isBiz) e.preventDefault();
              }}
              @drop=${(e: DragEvent) => this._onSlotDrop(e, col.date, slot.totalMinutes)}
            >
              ${events.map(ev => {
                const content = this._renderEventContent(ev);
                return html` <div
                  class=${content.className}
                  style=${'position:absolute;inset:2px 2px auto 2px;font-size:0.72rem;padding:2px 8px;border-radius:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer;z-index:10;background:' +
                  (ev.backgroundColor ?? 'var(--nx-accent)') +
                  ';color:' +
                  (ev.textColor ?? '#fff') +
                  ';'}
                  title="${ev.title}"
                  draggable=${this.eventStartEditable && ev.startEditable}
                  @click=${(e2: Event) => {
                    e2.stopPropagation();
                    this._eventClick(e2, ev);
                  }}
                  @dragstart=${(e2: DragEvent) => this._onEventDragStart(e2, ev)}
                >
                  ${content.html}
                </div>`;
              })}
              ${backgroundEvents.map(ev => {
                const bgMix =
                  'color-mix(in srgb, ' +
                  (ev.backgroundColor ?? 'var(--nx-accent)') +
                  ' 15%, transparent)';
                const borderColor = ev.backgroundColor ?? 'var(--nx-accent)';
                return html`<div
                  style=${'position:absolute;inset:0;background:' +
                  bgMix +
                  ';border-left:3px solid ' +
                  borderColor +
                  ';pointer-events:none;'}
                ></div>`;
              })}
            </div>`;
          })}
        </div>
      </div>
    </div>`;
  }

  private _formatTime(t: { hour(): number; minute(): number }): string {
    return DateUtils.formatTime(
      t as import('@bereasoftware/time-guard').TimeGuard,
      this.slotLabelFormat
    );
  }

  private _renderEventContent(event: ICalendarEvent): { html: string; className: string } {
    if (this.eventContent) {
      const custom = this.eventContent(event);
      return { html: custom.template, className: custom.className ?? '' };
    }
    return {
      html: `${event.title}${event.end ? html` <span style="opacity:0.8;margin-left:4px">${this._formatTime(event.start)} – ${this._formatTime(event.end)}</span>` : ''}`,
      className: '',
    };
  }

  private _dateClick(date: import('@bereasoftware/time-guard').TimeGuard, totalMinutes: number) {
    if (!isBusinessTimeSlot(date, totalMinutes, this.businessHours)) return;
    this.dispatchEvent(
      new CustomEvent('dateClick', {
        detail: { date: getSlotDateTime(date, totalMinutes), allDay: false },
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

  private _onSlotDrop(
    e: DragEvent,
    date: import('@bereasoftware/time-guard').TimeGuard,
    totalMinutes: number
  ) {
    e.preventDefault();
    if (!isBusinessTimeSlot(date, totalMinutes, this.businessHours)) return;
    const data = e.dataTransfer?.getData('text/plain');
    if (!data) return;
    try {
      const { eventId } = JSON.parse(data);
      this.dispatchEvent(
        new CustomEvent('eventDrop', {
          detail: { eventId, newStart: getSlotDateTime(date, totalMinutes).toISOString() },
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
