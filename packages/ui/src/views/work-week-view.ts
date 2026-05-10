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

@customElement('nx-work-week-view')
export class NxWorkWeekView extends LitElement {
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
  @property({ type: Object }) businessHours: BusinessHours | BusinessHours[] | boolean = false;
  eventContent?: (event: ICalendarEvent) => { template: string; className?: string };

  render() {
    const weekCols = this.columns.filter(c => {
      const dow = c.date.dayOfWeek();
      return dow >= 1 && dow <= 5;
    });
    const col0 = weekCols[0];
    if (!col0)
      return html`<div style="padding: 16px; color: var(--nx-text-muted); font-size: 0.875rem;">
        No weekdays in range
      </div>`;

    const timeSlots = buildVisualTimeSlots(
      this.minTime,
      this.maxTime,
      this.slotDuration,
      this.slotLabelFormat
    );
    const slotHeight = getSlotHeight(this.hourHeight, this.slotDuration);
    const timedEventsByColumn = weekCols.map(col => getColumnTimedEvents(col));
    const l = this.locale.weekdays.shorthand;

    return html` <div
      style="overflow: auto; border: 1px solid var(--nx-border); border-radius: var(--nx-radius); max-height: 600px;"
    >
      <div
        class="grid min-w-[500px]"
        style="grid-template-columns: 80px repeat(${weekCols.length}, 1fr); gap: 1px; background: var(--nx-border);"
      >
        <div
          style="background: var(--nx-header-bg); color: var(--nx-text-muted); font-size: 0.75rem; font-weight: 600; text-align: center; padding: 8px;"
        >
          All Day
        </div>
        ${weekCols.map(
          col =>
            html` <div
              style="background: var(--nx-header-bg); color: var(--nx-header-text); font-size: 0.75rem; font-weight: 600; text-align: center; padding: 8px;"
            >
              <span
                style="display: block; font-size: 1.1rem; font-weight: 700; color: var(--nx-text);"
                >${col.date.day()}</span
              >
              <span style="display: block; color: var(--nx-text-muted); font-weight: 400;"
                >${l[col.date.dayOfWeek() % 7]}</span
              >
            </div>`
        )}
      </div>
      <div
        class="grid min-w-[500px]"
        style="grid-template-columns: 80px repeat(${weekCols.length}, 1fr); gap: 1px; background: var(--nx-border);"
      >
        <div style="background: var(--nx-surface);"></div>
        ${weekCols.map(
          col =>
            html` <div style="background: var(--nx-surface); padding: 2px;">
              ${(col.allDayEvents ?? []).map(
                e => html`
                  <div
                    style="font-size: 0.72rem; padding: 2px 6px; background: ${e.backgroundColor ??
                    'var(--nx-accent)'}; color: ${e.textColor ??
                    '#fff'}; border-radius: 4px; margin: 1px 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: pointer;"
                    @click=${(ev: Event) => {
                      ev.stopPropagation();
                      this._eventClick(ev, e);
                    }}
                  >
                    ${e.title}
                  </div>
                `
              )}
            </div>`
        )}
      </div>
      <div
        class="grid min-w-[500px]"
        style="grid-template-columns: 80px repeat(${weekCols.length}, 1fr); gap: 1px; background: var(--nx-border);"
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
        ${weekCols.map(
          (col, ci) =>
            html` <div style="background: var(--nx-surface); position: relative;">
              ${timeSlots.map(slot => {
                const isBiz = isBusinessTimeSlot(col.date, slot.totalMinutes, this.businessHours);
                const events = isBiz
                  ? getTimedEventsForSlot(
                      timedEventsByColumn[ci],
                      slot.totalMinutes,
                      this.slotDuration
                    )
                  : [];
                const backgroundEvents = isBiz
                  ? getBackgroundEventsForSlot(
                      timedEventsByColumn[ci],
                      slot.totalMinutes,
                      this.slotDuration
                    )
                  : [];
                return html` <div
                  style="height: ${slotHeight}px; border-bottom: 1px solid var(--nx-border-light); position: relative; cursor: ${isBiz
                    ? 'pointer'
                    : 'not-allowed'}; transition: background 0.1s; background: ${isBiz
                    ? 'transparent'
                    : 'rgba(100, 116, 139, 0.4)'}; opacity: ${isBiz ? '1' : '0.8'};"
                  @mouseenter=${(e: MouseEvent) => {
                    (e.currentTarget as HTMLElement).style.background = isBiz
                      ? 'var(--nx-hover)'
                      : 'rgba(100, 116, 139, 0.6)';
                  }}
                  @mouseleave=${(e: MouseEvent) =>
                    ((e.currentTarget as HTMLElement).style.background = isBiz
                      ? 'transparent'
                      : 'rgba(100, 116, 139, 0.4)')}
                  @click=${() => this._dateClick(col.date, slot.totalMinutes)}
                  @dragover=${(e: DragEvent) => {
                    if (isBiz) e.preventDefault();
                  }}
                  @drop=${(e: DragEvent) => this._onSlotDrop(e, col.date, slot.totalMinutes)}
                >
                  ${events.map(e => {
                    const content = this._renderEventContent(e);
                    return html` <div
                      class=${content.className}
                      style="position: absolute; inset: 2px 2px auto 2px; font-size: 0.72rem; padding: 2px 6px; border-radius: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: pointer; z-index: 10; background: ${e.backgroundColor ??
                      'var(--nx-accent)'}; color: ${e.textColor ?? '#fff'};"
                      title="${e.title}"
                      draggable=${this.eventStartEditable && e.startEditable}
                      @click=${(ev: Event) => {
                        ev.stopPropagation();
                        this._eventClick(ev, e);
                      }}
                      @dragstart=${(ev: DragEvent) => this._onEventDragStart(ev, e)}
                    >
                      ${content.html}
                    </div>`;
                  })}
                  ${backgroundEvents.map(
                    e =>
                      html` <div
                        style="position: absolute; inset: 0; background: color-mix(in srgb, ${e.backgroundColor ??
                        'var(--nx-accent)'} 15%, transparent); border-left: 3px solid ${e.backgroundColor ??
                        'var(--nx-accent)'}; pointer-events: none;"
                      ></div>`
                  )}
                </div>`;
              })}
            </div>`
        )}
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
