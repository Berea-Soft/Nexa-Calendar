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
let NxDayView = class NxDayView extends LitElement {
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
        this.editable = true;
        this.eventStartEditable = true;
        this.eventDurationEditable = true;
        this.businessHours = false;
    }
    render() {
        const col = this.columns[0];
        if (!col)
            return html `<div style="padding: 16px; color: var(--nx-text-muted); font-size: 0.875rem;">
        No data
      </div>`;
        const timeSlots = buildVisualTimeSlots(this.minTime, this.maxTime, this.slotDuration, this.slotLabelFormat);
        const slotHeight = getSlotHeight(this.hourHeight, this.slotDuration);
        const timedEvents = getColumnTimedEvents(col);
        const l = this.locale;
        return html ` <div
      style="border: 1px solid var(--nx-border); border-radius: var(--nx-radius); overflow: hidden;"
    >
      <div
        style="background: var(--nx-header-bg); padding: 10px 16px; border-bottom: 1px solid var(--nx-border);"
      >
        <span style="font-size: 0.875rem; font-weight: 600; color: var(--nx-header-text);"
          >${l.weekdays.long[col.date.dayOfWeek() % 7]}, ${l.months.long[col.date.month() - 1]}
          ${col.date.day()}, ${col.date.year()}</span
        >
      </div>
      <div
        class="grid"
        style="grid-template-columns: 80px 1fr; gap: 1px; background: var(--nx-border);"
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
        <div style="background: var(--nx-surface); position: relative;">
          ${timeSlots.map(slot => {
            const isBiz = isBusinessTimeSlot(col.date, slot.totalMinutes, this.businessHours);
            const slotBg = isBiz ? 'transparent' : '#334155';
            const events = isBiz
                ? getTimedEventsForSlot(timedEvents, slot.totalMinutes, this.slotDuration)
                : [];
            const backgroundEvents = isBiz
                ? getBackgroundEventsForSlot(timedEvents, slot.totalMinutes, this.slotDuration)
                : [];
            return html ` <div
              style=${'height:' +
                slotHeight +
                'px;border-bottom:1px solid var(--nx-border-light);position:relative;background:' +
                slotBg +
                ';cursor:' +
                (isBiz ? 'pointer' : 'not-allowed') +
                ';transition:background 0.1s;opacity:' +
                (isBiz ? '1' : '0.9') +
                ';'}
              @mouseenter=${(e) => {
                const el = e.currentTarget;
                el.style.background = isBiz ? 'var(--nx-hover)' : '#1e293b';
            }}
              @mouseleave=${(e) => {
                const el = e.currentTarget;
                el.style.background = slotBg;
            }}
              @click=${() => this._dateClick(col.date, slot.totalMinutes)}
              @dragover=${(e) => {
                if (isBiz)
                    e.preventDefault();
            }}
              @drop=${(e) => this._onSlotDrop(e, col.date, slot.totalMinutes)}
            >
              ${events.map(ev => {
                const content = this._renderEventContent(ev);
                return html ` <div
                  class=${content.className}
                  style=${'position:absolute;inset:2px 2px auto 2px;font-size:0.72rem;padding:2px 8px;border-radius:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer;z-index:10;background:' +
                    (ev.backgroundColor ?? 'var(--nx-accent)') +
                    ';color:' +
                    (ev.textColor ?? '#fff') +
                    ';'}
                  title="${ev.title}"
                  draggable=${this.eventStartEditable && ev.startEditable}
                  @click=${(e2) => {
                    e2.stopPropagation();
                    this._eventClick(e2, ev);
                }}
                  @dragstart=${(e2) => this._onEventDragStart(e2, ev)}
                >
                  ${content.html}
                </div>`;
            })}
              ${backgroundEvents.map(ev => {
                const bgMix = 'color-mix(in srgb, ' +
                    (ev.backgroundColor ?? 'var(--nx-accent)') +
                    ' 15%, transparent)';
                const borderColor = ev.backgroundColor ?? 'var(--nx-accent)';
                return html `<div
                  style=${'position:absolute;inset:0;background:' +
                    bgMix +
                    ';border-left:3px solid ' +
                    borderColor +
                    ';pointer-events:none;'}
                ></div>`;
            })}
            </div>`;
        })}
        </div>
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
        return {
            html: `${event.title}${event.end ? html ` <span style="opacity:0.8;margin-left:4px">${this._formatTime(event.start)} – ${this._formatTime(event.end)}</span>` : ''}`,
            className: '',
        };
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
], NxDayView.prototype, "columns", void 0);
__decorate([
    property({ type: Object }),
    __metadata("design:type", Object)
], NxDayView.prototype, "locale", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", Object)
], NxDayView.prototype, "minTime", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", Object)
], NxDayView.prototype, "maxTime", void 0);
__decorate([
    property({ type: Number }),
    __metadata("design:type", Object)
], NxDayView.prototype, "slotDuration", void 0);
__decorate([
    property({ type: Number }),
    __metadata("design:type", Object)
], NxDayView.prototype, "hourHeight", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", Object)
], NxDayView.prototype, "slotLabelFormat", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", Object)
], NxDayView.prototype, "scrollToTime", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], NxDayView.prototype, "editable", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], NxDayView.prototype, "eventStartEditable", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], NxDayView.prototype, "eventDurationEditable", void 0);
__decorate([
    property(),
    __metadata("design:type", Object)
], NxDayView.prototype, "businessHours", void 0);
NxDayView = __decorate([
    customElement('nx-day-view')
], NxDayView);
export { NxDayView };
//# sourceMappingURL=day-view.js.map