import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import type { ViewType, Locale } from '@nexa-calendar/core'
import { getLocale } from '@nexa-calendar/core'

const ICON_PREV = html`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="10 4 6 8 10 12"/></svg>`
const ICON_NEXT = html`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 4 10 8 6 12"/></svg>`

@customElement('nx-toolbar')
export class NxToolbar extends LitElement {
  @property({ type: String }) title = ''
  @property({ type: String }) view: ViewType = 'month'
  @property({ type: Object }) locale: Locale = getLocale('en')
  @property({ type: Array }) views: ViewType[] = ['month', 'workWeek', 'week', 'day', 'list', 'timeline', 'timelineWeek', 'timelineMonth']

  render() {
    const t = this.locale.buttonText
    const allViews: ViewType[] = ['month', 'workWeek', 'week', 'day', 'list', 'timeline', 'timelineDay', 'timelineWeek', 'timelineMonth', 'year']
    const availableViews = this.views && this.views.length > 0
      ? allViews.filter(v => this.views.includes(v))
      : allViews

    const viewLabels: Record<string, string> = {
      month: t.month,
      workWeek: 'Work Week',
      week: t.week,
      day: t.day,
      list: t.list,
      timeline: 'Timeline',
      timelineDay: 'TL Day',
      timelineWeek: 'TL Week',
      timelineMonth: 'TL Month',
      year: 'Year',
    }

    const btnBase = `display: inline-flex; align-items: center; justify-content: center; padding: 6px 8px; border-radius: 6px; border: none; cursor: pointer; font-size: 0.8rem; font-weight: 500; transition: background 0.15s, color 0.15s; line-height: 1;`
    const btnNav = `${btnBase} background: var(--nx-surface-alt); color: var(--nx-text-muted);`
    const btnToday = `${btnBase} background: var(--nx-accent); color: var(--nx-accent-text); padding: 6px 14px;`

    return html`
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; border-bottom: 1px solid var(--nx-border); background: var(--nx-header-bg); flex-wrap: wrap; gap: 8px;">

        <!-- Left: nav controls -->
        <div style="display: flex; align-items: center; gap: 4px;">
          <button style="${btnNav}" title="${t.prev}"
            @mouseenter=${(e: MouseEvent) => (e.currentTarget as HTMLElement).style.background = 'var(--nx-hover)'}
            @mouseleave=${(e: MouseEvent) => (e.currentTarget as HTMLElement).style.background = 'var(--nx-surface-alt)'}
            @click=${this._emit('prev')}>${ICON_PREV}</button>
          <button style="${btnNav}" title="${t.next}"
            @mouseenter=${(e: MouseEvent) => (e.currentTarget as HTMLElement).style.background = 'var(--nx-hover)'}
            @mouseleave=${(e: MouseEvent) => (e.currentTarget as HTMLElement).style.background = 'var(--nx-surface-alt)'}
            @click=${this._emit('next')}>${ICON_NEXT}</button>
          <button style="${btnToday}; margin-left: 6px;"
            @mouseenter=${(e: MouseEvent) => (e.currentTarget as HTMLElement).style.background = 'var(--nx-accent-hover)'}
            @mouseleave=${(e: MouseEvent) => (e.currentTarget as HTMLElement).style.background = 'var(--nx-accent)'}
            @click=${this._emit('today')}>${t.today}</button>
        </div>

        <!-- Center: title -->
        <h2 style="font-size: 1rem; font-weight: 700; color: var(--nx-text); text-transform: capitalize; margin: 0; flex: 1; text-align: center; min-width: 120px;">${this.title}</h2>

        <!-- Right: view switcher -->
        <div style="display: flex; align-items: center; gap: 2px; background: var(--nx-surface-alt); border-radius: 8px; padding: 3px; border: 1px solid var(--nx-border-light); flex-wrap: wrap;">
          ${availableViews.map(v => {
            const isActive = this.view === v
            return html`
              <button
                style="padding: 4px 10px; font-size: 0.75rem; font-weight: ${isActive ? '600' : '500'}; border-radius: 6px; border: none; cursor: pointer; transition: background 0.15s, color 0.15s; white-space: nowrap;
                  background: ${isActive ? 'var(--nx-surface)' : 'transparent'};
                  color: ${isActive ? 'var(--nx-accent)' : 'var(--nx-text-muted)'};
                  box-shadow: ${isActive ? 'var(--nx-shadow)' : 'none'};"
                @mouseenter=${(e: MouseEvent) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'var(--nx-text)' }}
                @mouseleave=${(e: MouseEvent) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'var(--nx-text-muted)' }}
                @click=${this._emit('viewChange', v)}>
                ${viewLabels[v] ?? v}
              </button>`
          })}
        </div>
      </div>
    `
  }

  private _emit = (type: string, detail?: unknown) => (e: Event) => {
    e.stopPropagation()
    this.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }))
  }

  protected createRenderRoot() { return this }
}
