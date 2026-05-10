import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { ListEvent, ICalendarEvent, Locale } from '@nexa-calendar/core';
import { getLocale } from '@nexa-calendar/core';

@customElement('nx-list-view')
export class NxListView extends LitElement {
  @property({ type: Array }) items: ListEvent[] = [];
  @property({ type: Object }) locale: Locale = getLocale('en');
  @property({ type: String }) noEventsText = 'No events in this range';
  eventContent?: (event: ICalendarEvent) => { template: string; className?: string };

  render() {
    if (this.items.length === 0)
      return html` <div
        style="display: flex; align-items: center; justify-content: center; height: 192px; color: var(--nx-text-muted); font-size: 0.875rem;"
      >
        ${this.noEventsText}
      </div>`;
    const grouped = this._groupByDate();
    return html` <div
      style="border: 1px solid var(--nx-border); border-radius: var(--nx-radius); overflow: hidden;"
    >
      ${grouped.map(
        ({ date, events }) =>
          html` <div style="border-bottom: 1px solid var(--nx-border-light);">
            <div
              style="background: var(--nx-header-bg); padding: 6px 16px; font-size: 0.72rem; font-weight: 700; color: var(--nx-text-muted); text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid var(--nx-border-light);"
            >
              ${this._formatDateHeader(date)}
            </div>
            ${events.map(
              item =>
                html` <div
                  style="display: flex; align-items: flex-start; gap: 16px; padding: 10px 16px; cursor: pointer; border-left: 3px solid ${item
                    .event.backgroundColor ?? 'var(--nx-accent)'}; transition: background 0.1s;"
                  @mouseenter=${(e: MouseEvent) =>
                    ((e.currentTarget as HTMLElement).style.background = 'var(--nx-hover)')}
                  @mouseleave=${(e: MouseEvent) =>
                    ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                  @click=${() => this._eventClick(item.event)}
                >
                  <div style="flex-shrink: 0; width: 64px; text-align: right;">
                    ${!item.event.allDay
                      ? html`<div style="font-size: 0.72rem; color: var(--nx-text-muted);">
                          ${this._formatTime(item.event.start)}${item.event.end
                            ? ` – ${this._formatTime(item.event.end)}`
                            : ''}
                        </div>`
                      : html`<div style="font-size: 0.72rem; color: var(--nx-text-faint);">
                          All day
                        </div>`}
                  </div>
                  <div style="flex: 1; min-width: 0;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      ${(() => {
                        const content = this._renderEventContent(item.event);
                        return html`<span
                          class=${content.className}
                          style="font-size: 0.875rem; font-weight: 600; color: var(--nx-text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
                          >${content.html}</span
                        >`;
                      })()}
                      ${item.event.groupId
                        ? html`<span
                            style="font-size: 0.7rem; background: var(--nx-surface-alt); color: var(--nx-text-muted); padding: 1px 6px; border-radius: 4px;"
                            >${item.event.groupId}</span
                          >`
                        : ''}
                    </div>
                    ${item.event.extendedProps?.description
                      ? html`<p
                          style="font-size: 0.75rem; color: var(--nx-text-muted); margin: 2px 0 0; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;"
                        >
                          ${item.event.extendedProps.description as string}
                        </p>`
                      : ''}
                  </div>
                </div>`
            )}
          </div>`
      )}
    </div>`;
  }

  private _groupByDate(): { date: string; events: ListEvent[] }[] {
    const map = new Map<string, ListEvent[]>();
    for (const item of this.items) {
      const key = item.date.toISOString().slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, events]) => ({ date, events }));
  }

  private _formatDateHeader(isoDate: string): string {
    const l = this.locale;
    const parts = isoDate.split('-');
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const date = new Date(parseInt(parts[0], 10), month, day);
    return `${l.weekdays.long[date.getDay() % 7]}, ${l.months.long[month]} ${day}`;
  }

  private _formatTime(t: { hour(): number; minute(): number }): string {
    const h = t.hour();
    const m = t.minute().toString().padStart(2, '0');
    return `${h % 12 || 12}:${m}${h >= 12 ? 'PM' : 'AM'}`;
  }

  private _renderEventContent(event: ICalendarEvent): { html: string; className: string } {
    if (this.eventContent) {
      const custom = this.eventContent(event);
      return { html: custom.template, className: custom.className ?? '' };
    }
    return { html: event.title, className: '' };
  }

  private _eventClick(event: ICalendarEvent) {
    this.dispatchEvent(
      new CustomEvent('eventClick', { detail: event, bubbles: true, composed: true })
    );
  }

  protected createRenderRoot() {
    return this;
  }
}
