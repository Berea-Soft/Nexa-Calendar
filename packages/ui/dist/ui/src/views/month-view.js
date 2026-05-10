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
import { customElement, property, state } from 'lit/decorators.js';
import { DateUtils, getLocale } from '@nexa-calendar/core';
let NxMonthView = class NxMonthView extends LitElement {
    constructor() {
        super(...arguments);
        this.cells = [];
        this.locale = getLocale('en');
        this.dayMaxEvents = false;
        this.showNonCurrentDates = true;
        this.weekends = true;
        this.firstDay = 0;
        this.editable = true;
        this.eventStartEditable = true;
        this.businessHours = false;
        this._popoverCell = null;
        this._closePopoverOnOutsideClick = (ev) => {
            const target = ev.target;
            if (!target.closest('nx-month-view')) {
                this._popoverCell = null;
            }
        };
    }
    render() {
        const weekdays = this._getWeekdays();
        const weeks = this._getWeeks();
        const maxEvents = this.dayMaxEvents === true ? Infinity : this.dayMaxEvents || Infinity;
        return html ` <div class="grid grid-cols-7" style="gap: 1px; background: var(--nx-border);">
      ${weekdays.map(d => html `
          <div
            style="background: var(--nx-header-bg); color: var(--nx-text-muted);"
            class="px-3 py-2 text-center text-xs font-semibold uppercase tracking-wider"
          >
            ${d}
          </div>
        `)}
      ${weeks.flatMap((_week, _wi) => _week.map((cell, ci) => {
            if (!this.weekends && (ci === 0 || ci === 6))
                return html ``;
            if (!this.showNonCurrentDates && !cell.isCurrentMonth)
                return html ``;
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
            return html ` <div
            style="background: ${cellBg}; ${todayRing} min-height: 100px; opacity: ${isBiz
                ? 1
                : 0.6}; position: relative; padding: 6px; cursor: pointer; transition: background 0.15s;"
            @mouseenter=${(e) => (e.currentTarget.style.background = `var(--nx-hover)`)}
            @mouseleave=${(e) => (e.currentTarget.style.background = cellBg)}
            @click=${() => this._selectDate(cell)}
            @dragover=${(e) => e.preventDefault()}
            @drop=${(e) => this._onDrop(e, cell)}
          >
            <span
              style="font-size: 0.8rem; font-weight: 600; color: ${cell.isToday
                ? 'var(--nx-accent)'
                : cell.isCurrentMonth
                    ? 'var(--nx-text)'
                    : 'var(--nx-text-faint)'};"
            >
              ${cell.isToday
                ? html `<span
                    style="background: var(--nx-accent); color: var(--nx-accent-text); border-radius: 999px; width: 1.5rem; height: 1.5rem; display: inline-flex; align-items: center; justify-content: center; font-size: 0.75rem;"
                    >${cell.date.day()}</span
                  >`
                : cell.date.day()}
            </span>
            <div style="margin-top: 4px; display: flex; flex-direction: column; gap: 2px;">
              ${visibleEvents.map(e => html `
                  <div
                    style="${e.display === 'background'
                ? `background: color-mix(in srgb, ${e.backgroundColor ?? 'var(--nx-accent)'} 15%, transparent); border-left: 3px solid ${e.backgroundColor ?? 'var(--nx-accent)'}; color: var(--nx-text-muted); margin: 0 -6px; padding: 2px 6px;`
                : `background: ${e.backgroundColor ?? 'var(--nx-accent)'}; color: ${e.textColor ?? '#fff'}; border-radius: 4px; padding: 2px 6px;`}
                    font-size: 0.72rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: pointer; transition: opacity 0.1s;"
                    title="${e.title}"
                    draggable=${this.eventStartEditable && e.startEditable}
                    @mouseenter=${(ev) => (ev.currentTarget.style.opacity = '0.8')}
                    @mouseleave=${(ev) => (ev.currentTarget.style.opacity = '1')}
                    @click=${(ev) => {
                ev.stopPropagation();
                this._eventClick(ev, e);
            }}
                    @dragstart=${(ev) => this._onEventDragStart(ev, e)}
                  >
                    ${e.display === 'background'
                ? e.title
                : (() => {
                    const content = this._renderEventContent(e);
                    return html `<span class=${content.className}>${content.html}</span>`;
                })()}
                  </div>
                `)}
              ${hasMore
                ? html ` <div
                    style="font-size: 0.72rem; color: var(--nx-accent); font-weight: 600; padding: 0 4px; cursor: pointer;"
                    @mouseenter=${(e) => (e.currentTarget.style.color = 'var(--nx-accent-hover)')}
                    @mouseleave=${(e) => (e.currentTarget.style.color = 'var(--nx-accent)')}
                    @click=${(ev) => {
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
        }))}
    </div>`;
    }
    _renderPopover(cell) {
        return html ` <div
      style="position: absolute; z-index: 50; top: calc(100% + 4px); left: 0; width: 240px; background: var(--nx-surface); border: 1px solid var(--nx-border); border-radius: var(--nx-radius); box-shadow: var(--nx-shadow);"
      @click=${(ev) => ev.stopPropagation()}
    >
      <div
        style="padding: 8px 12px; border-bottom: 1px solid var(--nx-border-light); font-size: 0.8rem; font-weight: 600; color: var(--nx-text);"
      >
        ${cell.date.format('dddd D')}
      </div>
      <div
        style="max-height: 180px; overflow-y: auto; padding: 6px; display: flex; flex-direction: column; gap: 3px;"
      >
        ${cell.events.map(e => html `
            <div
              style="${e.display === 'background'
            ? `background: color-mix(in srgb, ${e.backgroundColor ?? 'var(--nx-accent)'} 15%, transparent); border-left: 3px solid ${e.backgroundColor ?? 'var(--nx-accent)'}; color: var(--nx-text-muted);`
            : `background: ${e.backgroundColor ?? 'var(--nx-accent)'}; color: ${e.textColor ?? '#fff'}; border-radius: 4px;`}
              font-size: 0.72rem; padding: 4px 8px; cursor: pointer; transition: opacity 0.1s;"
              @mouseenter=${(ev) => (ev.currentTarget.style.opacity = '0.8')}
              @mouseleave=${(ev) => (ev.currentTarget.style.opacity = '1')}
              @click=${(ev) => {
            ev.stopPropagation();
            this._eventClick(ev, e);
            this._popoverCell = null;
        }}
            >
              ${e.display === 'background'
            ? e.title
            : (() => {
                const content = this._renderEventContent(e);
                return html `<span class=${content.className}>${content.html}</span>`;
            })()}
            </div>
          `)}
      </div>
    </div>`;
    }
    _togglePopover(cell) {
        if (this._popoverCell?.date.toISOString() === cell.date.toISOString()) {
            this._popoverCell = null;
        }
        else {
            this._popoverCell = cell;
        }
    }
    _getWeekdays() {
        const l = this.locale.weekdays.shorthand;
        if (this.firstDay === 0)
            return [...l];
        return [...l.slice(this.firstDay), ...l.slice(0, this.firstDay)];
    }
    _getWeeks() {
        const weeks = [];
        for (let i = 0; i < this.cells.length; i += 7)
            weeks.push(this.cells.slice(i, i + 7));
        return weeks.filter(w => w.length === 7);
    }
    _getVisibleEvents(events, max) {
        const sorted = [...events].sort((a, b) => a.start.valueOf() - b.start.valueOf());
        const bg = sorted.filter(e => e.display === 'background');
        const normal = sorted.filter(e => e.display !== 'background');
        return [...bg, ...(max === Infinity ? normal : normal.slice(0, max))];
    }
    _isBusinessDay(date) {
        if (!this.businessHours)
            return true;
        if (typeof this.businessHours === 'boolean')
            return this.businessHours;
        const hours = Array.isArray(this.businessHours) ? this.businessHours : [this.businessHours];
        return hours.some(h => DateUtils.isInBusinessHours(date, h));
    }
    _formatTime(t) {
        const h = t.hour();
        const m = t.minute().toString().padStart(2, '0');
        return `${h % 12 || 12}:${m}${h >= 12 ? 'PM' : 'AM'} `;
    }
    _renderEventContent(event) {
        if (this.eventContent) {
            const custom = this.eventContent(event);
            return { html: custom.template, className: custom.className ?? '' };
        }
        const timeStr = event.allDay ? '' : this._formatTime(event.start);
        return { html: `${timeStr}${event.title}`, className: '' };
    }
    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('click', this._closePopoverOnOutsideClick);
    }
    disconnectedCallback() {
        document.removeEventListener('click', this._closePopoverOnOutsideClick);
        super.disconnectedCallback();
    }
    _selectDate(cell) {
        this.dispatchEvent(new CustomEvent('dateClick', {
            detail: { date: cell.date, allDay: true },
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
    _onDrop(e, cell) {
        e.preventDefault();
        const data = e.dataTransfer?.getData('text/plain');
        if (!data)
            return;
        try {
            const { eventId } = JSON.parse(data);
            this.dispatchEvent(new CustomEvent('eventDrop', {
                detail: { eventId, newStart: cell.date.toISOString() },
                bubbles: true,
                composed: true,
            }));
        }
        catch {
            /* ignore */
        }
    }
    createRenderRoot() {
        return this;
    }
};
__decorate([
    property({ type: Array }),
    __metadata("design:type", Array)
], NxMonthView.prototype, "cells", void 0);
__decorate([
    property({ type: Object }),
    __metadata("design:type", Object)
], NxMonthView.prototype, "locale", void 0);
__decorate([
    property({ type: [Number, Boolean] }),
    __metadata("design:type", Object)
], NxMonthView.prototype, "dayMaxEvents", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], NxMonthView.prototype, "showNonCurrentDates", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], NxMonthView.prototype, "weekends", void 0);
__decorate([
    property({ type: Number }),
    __metadata("design:type", Object)
], NxMonthView.prototype, "firstDay", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], NxMonthView.prototype, "editable", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], NxMonthView.prototype, "eventStartEditable", void 0);
__decorate([
    property({ type: Object }),
    __metadata("design:type", Object)
], NxMonthView.prototype, "businessHours", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], NxMonthView.prototype, "_popoverCell", void 0);
NxMonthView = __decorate([
    customElement('nx-month-view')
], NxMonthView);
export { NxMonthView };
//# sourceMappingURL=month-view.js.map