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
let NxEventChip = class NxEventChip extends LitElement {
    constructor() {
        super(...arguments);
        this.draggable = false;
        this.resizable = false;
    }
    render() {
        if (!this.event)
            return null;
        const e = this.event;
        return html `
      <div class="text-xs px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-90 transition-opacity mb-0.5 ${e.display === 'background' ? 'bg-gray-100 text-gray-500 border-l-2' : ''}"
        style="${e.display !== 'background' ? `background: ${e.backgroundColor ?? '#3b82f6'}; color: ${e.textColor ?? '#fff'}` : `border-left-color: ${e.backgroundColor ?? '#9ca3af'}`}"
        title="${e.title}" draggable=${this.draggable && !!e.startEditable}
        @click=${this._handleClick} @dragstart=${this._handleDragStart}>
        ${e.display === 'background' ? e.title : `${e.allDay ? '' : this._formatTime(e.start)}${e.title}`}
        ${this.resizable && e.durationEditable ? html `<span class="block h-1 cursor-s-resize mt-0.5 opacity-30 hover:opacity-100" @mousedown=${this._handleResizeStart}>⠿</span>` : ''}
      </div>
    `;
    }
    _formatTime(t) {
        const h = t.hour();
        const m = t.minute().toString().padStart(2, '0');
        return `${h % 12 || 12}:${m}${h >= 12 ? 'PM' : 'AM'} `;
    }
    _handleClick(e) {
        e.stopPropagation();
        this.dispatchEvent(new CustomEvent('eventClick', { detail: this.event, bubbles: true, composed: true }));
    }
    _handleDragStart(e) {
        if (!this.event)
            return;
        e.dataTransfer?.setData('text/plain', JSON.stringify({ eventId: this.event.id }));
    }
    _handleResizeStart(e) {
        e.stopPropagation();
        if (!this.event)
            return;
        this.dispatchEvent(new CustomEvent('resizeStart', { detail: { eventId: this.event.id, clientY: e.clientY }, bubbles: true, composed: true }));
    }
    createRenderRoot() { return this; }
};
__decorate([
    property({ type: Object }),
    __metadata("design:type", Object)
], NxEventChip.prototype, "event", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], NxEventChip.prototype, "draggable", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], NxEventChip.prototype, "resizable", void 0);
NxEventChip = __decorate([
    customElement('nx-event-chip')
], NxEventChip);
export { NxEventChip };
//# sourceMappingURL=event-chip.js.map