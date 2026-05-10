var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getLocale } from '@nexa-calendar/core';
let NxTimelineView = class NxTimelineView extends LitElement {
    constructor() {
        super(...arguments);
        this.grid = { columns: [], eventRows: [] };
        this.locale = getLocale('en');
        this.editable = true;
        this.eventStartEditable = true;
    }
    render() {
        const { columns, eventRows } = this.grid;
        if (!columns.length)
            return html `<div style="padding: 16px; color: var(--nx-text-muted); font-size: 0.875rem;">
        Loading...
      </div>`;
        const colWidth = columns.length > 31 ? 80 : 120;
        const rowHeight = 44;
        return html ` <div
      style="border: 1px solid var(--nx-border); border-radius: var(--nx-radius); overflow: hidden; background: var(--nx-surface);"
    >
      <div style="overflow: auto; max-height: 500px;">
        <div style="min-width: ${columns.length * colWidth}px">
          <!-- Header -->
          <div
            style="display: flex; background: var(--nx-header-bg); border-bottom: 1px solid var(--nx-border); position: sticky; top: 0; z-index: 10;"
          >
            ${columns.map(col => html ` <div
                  style="flex-shrink: 0; padding: 10px 8px; text-align: center; font-size: 0.75rem; font-weight: 600; border-right: 1px solid var(--nx-border-light);
                  width: ${colWidth}px;
                  ${col.isToday
            ? 'background: var(--nx-today-bg); color: var(--nx-accent)'
            : col.isWeekend
                ? 'color: var(--nx-text-faint)'
                : 'color: var(--nx-text-muted)'}"
                >
                  ${col.label}
                </div>`)}
          </div>
          <!-- Body -->
          <div style="min-height: 100px; background: var(--nx-bg);">
            <div
              style="position: relative; height: ${Math.max(100, eventRows.length * rowHeight)}px; min-width: ${columns.length * colWidth}px;"
            >
              <!-- Grid lines -->
              ${columns.map((col, i) => html ` <div
                    style="position: absolute; top: 0; height: 100%; border-right: 1px solid var(--nx-border-light);
                    left: ${i * colWidth}px; width: ${colWidth}px;
                    ${col.isToday
            ? 'background: var(--nx-today-bg)'
            : col.isWeekend
                ? 'background: var(--nx-weekend-bg)'
                : ''}"
                    @click=${() => this._dateClick(col.date)}
                  ></div>`)}
              <!-- Time slots -->
              ${Array.from({ length: Math.ceil((eventRows.length * rowHeight) / 60) }).map((_, slotIdx) => html `
                  <div
                    style="position: absolute; left: 0; right: 0; height: 1px; background: var(--nx-border-light); top: ${slotIdx *
            60}px;"
                  ></div>
                `)}
              <!-- Events -->
              ${eventRows.flatMap((row, ri) => row.events.map(pe => {
            const leftPx = (pe.leftPct / 100) * columns.length * colWidth;
            const widthPx = Math.max(40, (pe.widthPct / 100) * columns.length * colWidth);
            const color = pe.event.backgroundColor ?? 'var(--nx-accent)';
            const textColor = pe.event.textColor ?? 'var(--nx-accent-text)';
            return html ` <div
                    style="position: absolute; height: 28px; border-radius: 6px; padding: 0 10px; font-size: 0.75rem; font-weight: 500; line-height: 28px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; z-index: 20;
                      left: ${leftPx}px; width: ${widthPx}px; top: ${ri * rowHeight + 8}px;
                      background: ${color}; color: ${textColor};
                      box-shadow: 0 1px 3px rgba(0,0,0,0.15);"
                    title="${pe.event.title}"
                    draggable=${this.eventStartEditable && pe.event.startEditable}
                    @click=${(ev) => {
                ev.stopPropagation();
                this._eventClick(ev, pe.event);
            }}
                    @mouseenter=${(e) => {
                e.target.style.transform = 'scale(1.02)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
            }}
                    @mouseleave=${(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.15)';
            }}
                    @dragstart=${(ev) => this._onEventDragStart(ev, pe.event)}
                  >
                    ${(() => {
                const content = this._renderEventContent(pe.event);
                return html `<span class=${content.className}>${content.html}</span>`;
            })()}
                  </div>`;
        }))}
              <!-- Background events -->
              ${eventRows.flatMap((row, ri) => row.events
            .filter(pe => pe.event.display === 'background')
            .map(pe => {
            const leftPx = (pe.leftPct / 100) * columns.length * colWidth;
            const widthPx = Math.max(40, (pe.widthPct / 100) * columns.length * colWidth);
            return html ` <div
                      style="position: absolute; height: 28px; border-radius: 4px; pointer-events: none; z-index: 15;
                        left: ${leftPx}px; width: ${widthPx}px; top: ${ri * rowHeight + 8}px;
                        background: ${pe.event.backgroundColor ?? '#9ca3af'}; opacity: 0.2;"
                    ></div>`;
        }))}
            </div>
          </div>
        </div>
      </div>
    </div>`;
    }
    _renderEventContent(event) {
        if (this.eventContent) {
            const custom = this.eventContent(event);
            return { html: custom.template, className: custom.className ?? '' };
        }
        return { html: event.title, className: '' };
    }
    _dateClick(date) {
        this.dispatchEvent(new CustomEvent('dateClick', {
            detail: { date, allDay: true },
            bubbles: true,
            composed: true,
        }));
    }
    _eventClick(ev, event) {
        ev.stopPropagation();
        this.dispatchEvent(new CustomEvent('eventClick', { detail: event, bubbles: true, composed: true }));
    }
    _onEventDragStart(ev, event) {
        if (!this.eventStartEditable || !event.startEditable)
            return;
        ev.dataTransfer?.setData('text/plain', JSON.stringify({ eventId: event.id }));
    }
    createRenderRoot() {
        return this;
    }
};
__decorate([
    property({ type: Object }),
    __metadata("design:type", Object)
], NxTimelineView.prototype, "grid", void 0);
__decorate([
    property({ type: Object }),
    __metadata("design:type", Object)
], NxTimelineView.prototype, "locale", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], NxTimelineView.prototype, "editable", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], NxTimelineView.prototype, "eventStartEditable", void 0);
NxTimelineView = __decorate([
    customElement('nx-timeline-view')
], NxTimelineView);
export { NxTimelineView };
//# sourceMappingURL=timeline-view.js.map