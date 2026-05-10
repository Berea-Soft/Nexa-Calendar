import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import type { ICalendarEvent } from '@nexa-calendar/core'

@customElement('nx-event-chip')
export class NxEventChip extends LitElement {
  @property({ type: Object }) event?: ICalendarEvent
  @property({ type: Boolean }) draggable = false
  @property({ type: Boolean }) resizable = false

  render() {
    if (!this.event) return null
    const e = this.event
    return html`
      <div class="text-xs px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-90 transition-opacity mb-0.5 ${e.display === 'background' ? 'bg-gray-100 text-gray-500 border-l-2' : ''}"
        style="${e.display !== 'background' ? `background: ${e.backgroundColor ?? '#3b82f6'}; color: ${e.textColor ?? '#fff'}` : `border-left-color: ${e.backgroundColor ?? '#9ca3af'}`}"
        title="${e.title}" draggable=${this.draggable && !!e.startEditable}
        @click=${this._handleClick} @dragstart=${this._handleDragStart}>
        ${e.display === 'background' ? e.title : `${e.allDay ? '' : this._formatTime(e.start)}${e.title}`}
        ${this.resizable && e.durationEditable ? html`<span class="block h-1 cursor-s-resize mt-0.5 opacity-30 hover:opacity-100" @mousedown=${this._handleResizeStart}>⠿</span>` : ''}
      </div>
    `
  }

  private _formatTime(t: { hour(): number; minute(): number }): string {
    const h = t.hour(); const m = t.minute().toString().padStart(2, '0')
    return `${h % 12 || 12}:${m}${h >= 12 ? 'PM' : 'AM'} `
  }

  private _handleClick(e: Event) {
    e.stopPropagation()
    this.dispatchEvent(new CustomEvent('eventClick', { detail: this.event, bubbles: true, composed: true }))
  }

  private _handleDragStart(e: DragEvent) {
    if (!this.event) return
    e.dataTransfer?.setData('text/plain', JSON.stringify({ eventId: this.event.id }))
  }

  private _handleResizeStart(e: MouseEvent) {
    e.stopPropagation()
    if (!this.event) return
    this.dispatchEvent(new CustomEvent('resizeStart', { detail: { eventId: this.event.id, clientY: e.clientY }, bubbles: true, composed: true }))
  }

  protected createRenderRoot() { return this }
}
