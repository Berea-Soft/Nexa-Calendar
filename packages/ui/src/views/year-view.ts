import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import type { YearGrid, YearMonth, Locale, ICalendarEvent } from '@nexa-calendar/core'
import { getLocale } from '@nexa-calendar/core'

@customElement('nx-year-view')
export class NxYearView extends LitElement {
  @property({ type: Object }) grid: YearGrid = { year: new Date().getFullYear(), months: [] }
  @property({ type: Object }) locale: Locale = getLocale('en')
  eventContent?: (event: ICalendarEvent) => { template: string; className?: string }

  render() {
    const { year, months } = this.grid
    if (!months.length) return html`<div style="padding: 16px; color: var(--nx-text-muted); font-size: 0.875rem;">Loading...</div>`

    return html`
      <div style="padding: 16px;">
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
          ${months.map(m => this._renderMonth(m))}
        </div>
      </div>
    `
  }

  private _renderMonth(month: YearMonth) {
    const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    return html`
      <div style="background: var(--nx-surface); border: 1px solid var(--nx-border); border-radius: var(--nx-radius); overflow: hidden; transition: box-shadow 0.15s;"
        @mouseenter=${(e: MouseEvent) => (e.currentTarget as HTMLElement).style.boxShadow = 'var(--nx-shadow)'}
        @mouseleave=${(e: MouseEvent) => (e.currentTarget as HTMLElement).style.boxShadow = 'none'}>
        <div style="background: var(--nx-header-bg); padding: 8px 12px; border-bottom: 1px solid var(--nx-border); display: flex; align-items: center; justify-content: space-between;">
          <span style="font-size: 0.875rem; font-weight: 600; color: var(--nx-text);">${month.label}</span>
          <button
            style="font-size: 0.7rem; font-weight: 500; color: var(--nx-accent); background: transparent; border: none; cursor: pointer; padding: 4px 8px; border-radius: 4px; transition: color 0.15s, background 0.15s;"
            @mouseenter=${(e: MouseEvent) => (e.currentTarget as HTMLElement).style.color = 'var(--nx-accent-hover)'}
            @mouseleave=${(e: MouseEvent) => (e.currentTarget as HTMLElement).style.color = 'var(--nx-accent)'}
            @click=${() => this._navigateToMonth(month)}>
            View
          </button>
        </div>
        <div style="padding: 8px;">
          <div style="display: grid; grid-template-columns: repeat(7, 1fr); margin-bottom: 4px;">
            ${dayLabels.map(d => html`
              <div style="text-align: center; font-size: 0.7rem; font-weight: 500; color: var(--nx-text-faint); padding: 2px 0;">${d}</div>
            `)}
          </div>
          <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px;">
            ${month.cells.map(cell => {
              const isToday = cell.isToday
              const isCurrentMonth = cell.isCurrentMonth
              const hasEvents = cell.hasEvents

              let cellStyle = 'position: relative; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; border-radius: 4px; cursor: pointer; aspect-ratio: 1; min-height: 24px; transition: background 0.1s;'

              if (isToday) {
                cellStyle += ' background: var(--nx-accent); color: var(--nx-accent-text); font-weight: 700;'
              } else if (isCurrentMonth) {
                cellStyle += ' color: var(--nx-text);'
              } else {
                cellStyle += ' color: var(--nx-text-faint);'
              }

              if (hasEvents && !isToday && isCurrentMonth) {
                cellStyle += ' font-weight: 600;'
              }

              return html`
                <div
                  style="${cellStyle}"
                  title="${hasEvents ? `${cell.eventCount} event${cell.eventCount !== 1 ? 's' : ''}` : ''}"
                  @mouseenter=${(e: MouseEvent) => { if (!isToday && isCurrentMonth) (e.currentTarget as HTMLElement).style.background = 'var(--nx-hover)' }}
                  @mouseleave=${(e: MouseEvent) => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  @click=${() => this._dayClick(cell)}>
                  ${cell.date.day()}
                  ${hasEvents && isCurrentMonth && !isToday ? html`
                    <span style="position: absolute; bottom: 2px; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; border-radius: 50%; background: var(--nx-accent);"></span>
                  ` : ''}
                </div>
              `
            })}
          </div>
        </div>
      </div>
    `
  }

  private _navigateToMonth(month: YearMonth) {
    this.dispatchEvent(new CustomEvent('navigateToMonth', {
      detail: { date: month.monthDate },
      bubbles: true,
      composed: true,
    }))
  }

  private _dayClick(cell: import('@nexa-calendar/core').YearMonthCell) {
    this.dispatchEvent(new CustomEvent('dateClick', {
      detail: { date: cell.date, allDay: true },
      bubbles: true,
      composed: true,
    }))
  }

  protected createRenderRoot() { return this }
}