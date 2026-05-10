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
import { DateUtils, getLocale } from '@nexa-calendar/core';
import { buildVisualTimeSlots, getBackgroundEventsForSlot, getColumnTimedEvents, getSlotDateTime, getSlotHeight, getTimedEventsForSlot, isBusinessTimeSlot, } from '../utils/time-grid';
let NxWeekView = class NxWeekView extends LitElement {
    constructor() {
        super(...arguments);
        this.columns = [];
        this.locale = getLocale('en');
        this.minTime = '00:00';
        this.maxTime = '24:00';
        this.slotDuration = 60;
        this.hourHeight = 48;
        this.slotLabelFormat = 'h:mm a';
        this.scrollToTime = '06:00';
        this.weekends = true;
        this.firstDay = 0;
        this.editable = true;
        this.eventStartEditable = true;
        this.eventDurationEditable = true;
        this.businessHours = false;
    }
    connectedCallback() {
        super.connectedCallback();
        console.log('WEEK VIEW connected - businessHours:', this.businessHours);
    }
    willUpdate(changedProperties) {
        if (changedProperties.has('businessHours')) {
            console.log('WEEK VIEW willUpdate - businessHours changed to:', this.businessHours);
        }
    }
    render() {
        console.log('WEEK VIEW RENDER - businessHours:', this.businessHours, 'type:', typeof this.businessHours);
        const col0 = this.columns[0];
        if (!col0)
            return html `<div style="padding: 16px; color: var(--nx-text-muted); font-size: 0.875rem;">
        Loading...
      </div>`;
        const timeSlots = buildVisualTimeSlots(this.minTime, this.maxTime, this.slotDuration, this.slotLabelFormat);
        const slotHeight = getSlotHeight(this.hourHeight, this.slotDuration);
        const visibleCols = this.columns.filter((_, i) => this.weekends || (i % 7 !== 0 && i % 7 !== 6));
        const timedEventsByColumn = visibleCols.map(col => getColumnTimedEvents(col));
        const l = this.locale.weekdays.shorthand;
        const days = this.firstDay === 0 ? [...l] : [...l.slice(this.firstDay), ...l.slice(0, this.firstDay)];
        return html ` <div
      style="overflow: auto; border: 1px solid var(--nx-border); border-radius: var(--nx-radius); max-height: 600px;"
    >
      <div
        style="display: grid; min-width: 600px; grid-template-columns: 80px repeat(${visibleCols.length}, 1fr); gap: 1px; background: var(--nx-border);"
      >
        <div
          style="background: var(--nx-header-bg); color: var(--nx-text-muted); font-size: 0.75rem; font-weight: 600; text-align: center; padding: 8px;"
        >
          All Day
        </div>
        ${visibleCols.map(col => html ` <div
              style="background: var(--nx-header-bg); color: var(--nx-header-text); font-size: 0.75rem; font-weight: 600; text-align: center; padding: 8px;"
            >
              <span
                style="display: block; font-size: 1.1rem; font-weight: 700; color: var(--nx-text);"
                >${col.date.day()}</span
              >
              <span style="display: block; color: var(--nx-text-muted); font-weight: 400;"
                >${days[col.date.dayOfWeek() % 7]}</span
              >
            </div>`)}
      </div>
      <div
        class="grid min-w-[600px]"
        style="grid-template-columns: 80px repeat(${visibleCols.length}, 1fr); gap: 1px; background: var(--nx-border);"
      >
        <div style="background: var(--nx-surface);"></div>
        ${visibleCols.map(col => html ` <div style="background: var(--nx-surface); padding: 2px;">
              ${(col.allDayEvents ?? []).map(e => html `
                  <div
                    style="font-size: 0.72rem; padding: 2px 6px; background: ${e.backgroundColor ??
            'var(--nx-accent)'}; color: ${e.textColor ??
            '#fff'}; border-radius: 4px; margin: 1px 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: pointer;"
                    @click=${(ev) => {
            ev.stopPropagation();
            this._eventClick(ev, e);
        }}
                  >
                    ${e.title}
                  </div>
                `)}
            </div>`)}
      </div>
      <div
        class="grid min-w-[600px]"
        style="grid-template-columns: 80px repeat(${visibleCols.length}, 1fr); gap: 1px; background: var(--nx-border);"
      >
        <div style="background: var(--nx-surface);">
          ${timeSlots.map(slot => html `
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
            `)}
        </div>
        ${visibleCols.map((col, ci) => html ` <div style="background: var(--nx-surface); position: relative;">
              ${timeSlots.map(slot => {
            const isBiz = isBusinessTimeSlot(col.date, slot.totalMinutes, this.businessHours);
            const events = isBiz
                ? getTimedEventsForSlot(timedEventsByColumn[ci], slot.totalMinutes, this.slotDuration)
                : [];
            const backgroundEvents = isBiz
                ? getBackgroundEventsForSlot(timedEventsByColumn[ci], slot.totalMinutes, this.slotDuration)
                : [];
            return html ` <div
                  style="height: ${slotHeight}px; border-bottom: 1px solid var(--nx-border-light); position: relative; background: ${isBiz
                ? 'transparent'
                : '#334155'}; transition: background 0.1s; cursor: ${isBiz
                ? 'pointer'
                : 'not-allowed'}; opacity: ${isBiz ? '1' : '0.9'};"
                  @mouseenter=${(e) => {
                e.currentTarget.style.background = isBiz
                    ? 'var(--nx-hover)'
                    : '#1e293b';
            }}
                  @mouseleave=${(e) => {
                e.currentTarget.style.background = isBiz
                    ? 'transparent'
                    : '#334155';
            }}
                  @click=${() => this._dateClick(col.date, slot.totalMinutes)}
                  @dragover=${(e) => {
                if (isBiz)
                    e.preventDefault();
            }}
                  @drop=${(e) => this._onSlotDrop(e, col.date, slot.totalMinutes)}
                >
                  ${events.map(e => {
                const content = this._renderEventContent(e);
                return html ` <div
                      class=${content.className}
                      style="position: absolute; inset: 2px 2px auto 2px; font-size: 0.72rem; padding: 2px 6px; border-radius: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: pointer; z-index: 10; background: ${e.backgroundColor ??
                    'var(--nx-accent)'}; color: ${e.textColor ?? '#fff'};"
                      title="${e.title}"
                      draggable=${this.eventStartEditable && e.startEditable}
                      @click=${(ev) => {
                    ev.stopPropagation();
                    this._eventClick(ev, e);
                }}
                      @dragstart=${(ev) => this._onEventDragStart(ev, e)}
                    >
                      ${content.html}
                    </div>`;
            })}
                  ${backgroundEvents.map(e => html ` <div
                        style="position: absolute; inset: 0; background: color-mix(in srgb, ${e.backgroundColor ??
                'var(--nx-accent)'} 15%, transparent); border-left: 3px solid ${e.backgroundColor ??
                'var(--nx-accent)'}; pointer-events: none;"
                      ></div>`)}
                </div>`;
        })}
            </div>`)}
      </div>
    </div>`;
    }
    _formatTime(t) {
        return DateUtils.formatTime(t, this.slotLabelFormat);
    }
    _renderEventContent(event) {
        if (this.eventContent) {
            const custom = this.eventContent(event);
            return { html: custom.template, className: custom.className ?? '' };
        }
        return { html: `${this._formatTime(event.start)} ${event.title}`, className: '' };
    }
    _dateClick(date, totalMinutes) {
        if (!isBusinessTimeSlot(date, totalMinutes, this.businessHours))
            return;
        this.dispatchEvent(new CustomEvent('dateClick', {
            detail: { date: getSlotDateTime(date, totalMinutes), allDay: false },
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
    _onSlotDrop(e, date, totalMinutes) {
        e.preventDefault();
        if (!isBusinessTimeSlot(date, totalMinutes, this.businessHours))
            return;
        const data = e.dataTransfer?.getData('text/plain');
        if (!data)
            return;
        try {
            const { eventId } = JSON.parse(data);
            this.dispatchEvent(new CustomEvent('eventDrop', {
                detail: { eventId, newStart: getSlotDateTime(date, totalMinutes).toISOString() },
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
], NxWeekView.prototype, "columns", void 0);
__decorate([
    property({ type: Object }),
    __metadata("design:type", Object)
], NxWeekView.prototype, "locale", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", Object)
], NxWeekView.prototype, "minTime", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", Object)
], NxWeekView.prototype, "maxTime", void 0);
__decorate([
    property({ type: Number }),
    __metadata("design:type", Object)
], NxWeekView.prototype, "slotDuration", void 0);
__decorate([
    property({ type: Number }),
    __metadata("design:type", Object)
], NxWeekView.prototype, "hourHeight", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", Object)
], NxWeekView.prototype, "slotLabelFormat", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", Object)
], NxWeekView.prototype, "scrollToTime", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], NxWeekView.prototype, "weekends", void 0);
__decorate([
    property({ type: Number }),
    __metadata("design:type", Object)
], NxWeekView.prototype, "firstDay", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], NxWeekView.prototype, "editable", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], NxWeekView.prototype, "eventStartEditable", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], NxWeekView.prototype, "eventDurationEditable", void 0);
__decorate([
    property(),
    __metadata("design:type", Object)
], NxWeekView.prototype, "businessHours", void 0);
NxWeekView = __decorate([
    customElement('nx-week-view')
], NxWeekView);
export { NxWeekView };
//# sourceMappingURL=week-view.js.map