import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import type { TimelineGrid, ICalendarEvent, Locale } from '@nexa-calendar/core'
import { getLocale } from '@nexa-calendar/core'

@customElement('nx-timeline-view')
export class NxTimelineView extends LitElement {
  @property({ type: Object }) grid: TimelineGrid = { columns: [], eventRows: [] }
  @property({ type: Object }) locale: Locale = getLocale('en')
  @property({ type: Boolean }) editable = true
  @property({ type: Boolean }) eventStartEditable = true
  eventContent?: (event: ICalendarEvent) => { template: string; className?: string }

  render() {
    const { columns, eventRows } = this.grid
    if (!columns.length) return html`<div style="padding: 16px; color: var(--nx-text-muted); font-size: 0.875rem;">Loading...</div>`

    const colWidth = columns.length > 31 ? 80 : 120
    const rowHeight = 44

    return html`
      <div style="border: 1px solid var(--nx-border); border-radius: var(--nx-radius); overflow: hidden; background: var(--nx-surface);">
        <div style="overflow: auto; max-height: 500px;">
          <div style="min-width: ${columns.length * colWidth}px">
            <!-- Header -->
            <div style="display: flex; background: var(--nx-header-bg); border-bottom: 1px solid var(--nx-border); position: sticky; top: 0; z-index: 10;">
              ${columns.map(col => html`
                <div style="flex-shrink: 0; padding: 10px 8px; text-align: center; font-size: 0.75rem; font-weight: 600; border-right: 1px solid var(--nx-border-light);
                  width: ${colWidth}px;
                  ${col.isToday ? 'background: var(--nx-today-bg); color: var(--nx-accent)' : col.isWeekend ? 'color: var(--nx-text-faint)' : 'color: var(--nx-text-muted)'}">
                  ${col.label}
                </div>`)}
            </div>
            <!-- Body -->
            <div style="min-height: 100px; background: var(--nx-bg);">
              <div style="position: relative; height: ${Math.max(100, eventRows.length * rowHeight)}px; min-width: ${columns.length * colWidth}px;">
                <!-- Grid lines -->
                ${columns.map((col, i) => html`
                  <div style="position: absolute; top: 0; height: 100%; border-right: 1px solid var(--nx-border-light);
                    left: ${i * colWidth}px; width: ${colWidth}px;
                    ${col.isToday ? 'background: var(--nx-today-bg)' : col.isWeekend ? 'background: var(--nx-weekend-bg)' : ''}"
                    @click=${() => this._dateClick(col.date)}>
                  </div>`)}
                <!-- Time slots -->
                ${Array.from({ length: Math.ceil(eventRows.length * rowHeight / 60) }).map((_, slotIdx) => html`
                  <div style="position: absolute; left: 0; right: 0; height: 1px; background: var(--nx-border-light); top: ${slotIdx * 60}px;"></div>
                `)}
                <!-- Events -->
                ${eventRows.flatMap((row, ri) => row.events.map(pe => {
                  const leftPx = (pe.leftPct / 100) * columns.length * colWidth
                  const widthPx = Math.max(40, (pe.widthPct / 100) * columns.length * colWidth)
                  const color = pe.event.backgroundColor ?? 'var(--nx-accent)'
                  const textColor = pe.event.textColor ?? 'var(--nx-accent-text)'
                  return html`
                    <div style="position: absolute; height: 28px; border-radius: 6px; padding: 0 10px; font-size: 0.75rem; font-weight: 500; line-height: 28px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; z-index: 20;
                      left: ${leftPx}px; width: ${widthPx}px; top: ${ri * rowHeight + 8}px;
                      background: ${color}; color: ${textColor};
                      box-shadow: 0 1px 3px rgba(0,0,0,0.15);"
                      title="${pe.event.title}"
                      draggable=${this.eventStartEditable && pe.event.startEditable}
                      @click=${(ev: Event) => { ev.stopPropagation(); this._eventClick(ev, pe.event) }}
                      @mouseenter=${(e: MouseEvent) => { (e.target as HTMLElement).style.transform = 'scale(1.02)'; (e.target as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)' }}
                      @mouseleave=${(e: MouseEvent) => { (e.target as HTMLElement).style.transform = 'scale(1)'; (e.target as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.15)' }}
                      @dragstart=${(ev: DragEvent) => this._onEventDragStart(ev, pe.event)}>
${(() => { const content = this._renderEventContent(pe.event); return html`<span class=${content.className}>${content.html}</span>` })()}
                    </div>`
                }))}
                <!-- Background events -->
                ${eventRows.flatMap((row, ri) => row.events
                  .filter(pe => pe.event.display === 'background')
                  .map(pe => {
                    const leftPx = (pe.leftPct / 100) * columns.length * colWidth
                    const widthPx = Math.max(40, (pe.widthPct / 100) * columns.length * colWidth)
                    return html`
                      <div style="position: absolute; height: 28px; border-radius: 4px; pointer-events: none; z-index: 15;
                        left: ${leftPx}px; width: ${widthPx}px; top: ${ri * rowHeight + 8}px;
                        background: ${(pe.event.backgroundColor ?? '#9ca3af')}; opacity: 0.2;">
                      </div>`
                  }))}
              </div>
            </div>
          </div>
        </div>
      </div>`
  }

  private _renderEventContent(event: ICalendarEvent): { html: string; className: string } {
    if (this.eventContent) {
      const custom = this.eventContent(event)
      return { html: custom.template, className: custom.className ?? '' }
    }
    return { html: event.title, className: '' }
  }

  private _dateClick(date: import('@bereasoftware/time-guard').TimeGuard) {
    this.dispatchEvent(new CustomEvent('dateClick', { detail: { date, allDay: true }, bubbles: true, composed: true }))
  }

  private _eventClick(ev: Event, event: ICalendarEvent) {
    ev.stopPropagation()
    this.dispatchEvent(new CustomEvent('eventClick', { detail: event, bubbles: true, composed: true }))
  }

  private _onEventDragStart(ev: DragEvent, event: ICalendarEvent) {
    if (!this.eventStartEditable || !event.startEditable) return
    ev.dataTransfer?.setData('text/plain', JSON.stringify({ eventId: event.id }))
  }

  protected createRenderRoot() { return this }
}