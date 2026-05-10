var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
            ? (desc = Object.getOwnPropertyDescriptor(target, key))
            : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return (c > 3 && r && Object.defineProperty(target, key, r), r);
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
      return Reflect.metadata(k, v);
  };
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getLocale } from '@nexa-calendar/core';
const RESOURCE_COL_WIDTH = 160;
const TIME_COL_WIDTH = 100;
let NxResourceTimelineView = class NxResourceTimelineView extends LitElement {
  constructor() {
    super(...arguments);
    this.grid = { columns: [], rows: [] };
    this.locale = getLocale('en');
    this.editable = true;
    this.eventStartEditable = true;
  }
  render() {
    const { columns, rows } = this.grid;
    if (!columns.length)
      return html`<div style="padding: 16px; color: var(--nx-text-muted); font-size: 0.875rem;">
        Loading...
      </div>`;
    const totalTimeWidth = columns.length * TIME_COL_WIDTH;
    return html`
      <div
        style="border: 1px solid var(--nx-border); border-radius: var(--nx-radius); overflow: hidden; background: var(--nx-surface);"
      >
        <div style="overflow: auto; max-height: 520px;">
          <div style="min-width: ${RESOURCE_COL_WIDTH + totalTimeWidth}px">
            <!-- Header row -->
            <div
              style="display: flex; background: var(--nx-header-bg); border-bottom: 1px solid var(--nx-border); position: sticky; top: 0; z-index: 20;"
            >
              <!-- Resource header label -->
              <div
                style="flex-shrink: 0; padding: 10px 12px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--nx-text-muted); border-right: 1px solid var(--nx-border); background: var(--nx-header-bg); position: sticky; left: 0; z-index: 30;
                width: ${RESOURCE_COL_WIDTH}px; min-width: ${RESOURCE_COL_WIDTH}px;"
              >
                Resource
              </div>
              <!-- Time column headers -->
              <div style="display: flex;">
                ${columns.map(
                  col => html`
                    <div
                      style="flex-shrink: 0; padding: 10px 8px; text-align: center; font-size: 0.7rem; font-weight: 600; border-right: 1px solid var(--nx-border-light);
                    width: ${TIME_COL_WIDTH}px; min-width: ${TIME_COL_WIDTH}px;
                    ${col.isToday
                        ? 'background: var(--nx-today-bg); color: var(--nx-accent)'
                        : col.isWeekend
                          ? 'color: var(--nx-text-faint)'
                          : 'color: var(--nx-text-muted)'}"
                    >
                      ${col.label}
                    </div>
                  `
                )}
              </div>
            </div>

            <!-- Resource rows -->
            ${rows.map(row => this._renderRow(row, columns, totalTimeWidth))}
            ${!rows.length
              ? html`
                  <div
                    style="padding: 32px; text-align: center; color: var(--nx-text-faint); font-size: 0.875rem;"
                  >
                    No resources configured
                  </div>
                `
              : ''}
          </div>
        </div>
      </div>
    `;
  }
  _renderRow(row, columns, totalTimeWidth) {
    const rowHeight = Math.max(44, row.events.length * 36 + 8);
    const indent = row.depth * 16;
    return html`
      <div
        style="display: flex; border-bottom: 1px solid var(--nx-border-light); transition: background 0.15s;"
        @mouseenter=${e => (e.currentTarget.style.background = 'var(--nx-hover)')}
        @mouseleave=${e => (e.currentTarget.style.background = 'transparent')}
      >
        <!-- Resource label (frozen left column) -->
        <div
          style="flex-shrink: 0; display: flex; align-items: center; border-right: 1px solid var(--nx-border); background: var(--nx-surface); position: sticky; left: 0; z-index: 10; padding: 8px 12px;
          width: ${RESOURCE_COL_WIDTH}px; min-width: ${RESOURCE_COL_WIDTH}px; min-height: ${rowHeight}px; padding-left: ${12 +
          indent}px;"
        >
          <div>
            ${row.depth > 0
              ? html`<span style="color: var(--nx-text-faint); margin-right: 4px;">↳</span>`
              : ''}
            <div
              style="font-size: 0.8rem; font-weight: 500; color: var(--nx-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
              title="${row.resource.title}"
            >
              ${row.resource.title}
            </div>
          </div>
        </div>

        <!-- Time grid for this resource -->
        <div
          style="position: relative; flex: 1; background: var(--nx-bg); height: ${rowHeight}px; min-width: ${totalTimeWidth}px;"
        >
          <!-- Column background lines -->
          ${columns.map(
            (col, ci) => html`
              <div
                style="position: absolute; top: 0; height: 100%; border-right: 1px solid var(--nx-border-light);
              left: ${ci * TIME_COL_WIDTH}px; width: ${TIME_COL_WIDTH}px;
                ${col.isToday
                  ? 'background: var(--nx-today-bg)'
                  : col.isWeekend
                    ? 'background: var(--nx-weekend-bg)'
                    : ''}"
                @click=${() => this._dateClick(col.date, row)}
              ></div>
            `
          )}

          <!-- Events -->
          ${row.events.map((pe, ei) => {
            const leftPx = (pe.leftPct / 100) * totalTimeWidth;
            const widthPx = Math.max(40, (pe.widthPct / 100) * totalTimeWidth);
            const eventColor = pe.event.backgroundColor ?? 'var(--nx-accent)';
            const eventTextColor = pe.event.textColor ?? 'var(--nx-accent-text)';
            return html`
              <div
                style="position: absolute; height: 28px; border-radius: 6px; padding: 0 10px; font-size: 0.72rem; font-weight: 500; line-height: 28px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; z-index: 20;
                left: ${leftPx}px; width: ${widthPx}px; top: ${ei * 36 + 8}px;
                background: ${eventColor}; color: ${eventTextColor};
                box-shadow: 0 1px 3px rgba(0,0,0,0.15);"
                title="${pe.event.title}"
                draggable=${this.eventStartEditable && pe.event.startEditable}
                @click=${ev => {
                  ev.stopPropagation();
                  this._eventClick(ev, pe.event);
                }}
                @mouseenter=${e => {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                }}
                @mouseleave=${e => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.15)';
                }}
                @dragstart=${ev => this._onEventDragStart(ev, pe.event)}
              >
                ${pe.event.title}
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }
  _dateClick(date, row) {
    this.dispatchEvent(
      new CustomEvent('dateClick', {
        detail: { date, allDay: true, resource: row.resource },
        bubbles: true,
        composed: true,
      })
    );
  }
  _eventClick(ev, event) {
    ev.stopPropagation();
    this.dispatchEvent(
      new CustomEvent('eventClick', { detail: event, bubbles: true, composed: true })
    );
  }
  _onEventDragStart(ev, event) {
    if (!this.eventStartEditable || !event.startEditable) return;
    ev.dataTransfer?.setData('text/plain', JSON.stringify({ eventId: event.id }));
  }
  createRenderRoot() {
    return this;
  }
};
__decorate(
  [property({ type: Object }), __metadata('design:type', Object)],
  NxResourceTimelineView.prototype,
  'grid',
  void 0
);
__decorate(
  [property({ type: Object }), __metadata('design:type', Object)],
  NxResourceTimelineView.prototype,
  'locale',
  void 0
);
__decorate(
  [property({ type: Boolean }), __metadata('design:type', Object)],
  NxResourceTimelineView.prototype,
  'editable',
  void 0
);
__decorate(
  [property({ type: Boolean }), __metadata('design:type', Object)],
  NxResourceTimelineView.prototype,
  'eventStartEditable',
  void 0
);
NxResourceTimelineView = __decorate(
  [customElement('nx-resource-timeline-view')],
  NxResourceTimelineView
);
export { NxResourceTimelineView };
//# sourceMappingURL=resource-timeline-view.js.map
