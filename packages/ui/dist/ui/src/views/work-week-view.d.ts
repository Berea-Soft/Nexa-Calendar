import { LitElement } from 'lit';
import type { DayColumn, ICalendarEvent, Locale, BusinessHours } from '@nexa-calendar/core';
export declare class NxWorkWeekView extends LitElement {
    columns: DayColumn[];
    locale: Locale;
    minTime: string;
    maxTime: string;
    slotDuration: number;
    hourHeight: number;
    slotLabelFormat: string;
    scrollToTime: string;
    editable: boolean;
    eventStartEditable: boolean;
    eventDurationEditable: boolean;
    businessHours: BusinessHours | BusinessHours[] | boolean;
    eventContent?: (event: ICalendarEvent) => {
        template: string;
        className?: string;
    };
    render(): import("lit").TemplateResult<1>;
    private _formatTime;
    private _renderEventContent;
    private _dateClick;
    private _eventClick;
    private _onEventDragStart;
    private _onSlotDrop;
    protected createRenderRoot(): this;
}
