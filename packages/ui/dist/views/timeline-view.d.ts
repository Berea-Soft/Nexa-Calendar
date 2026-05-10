import { LitElement } from 'lit';
import type { TimelineGrid, ICalendarEvent, Locale } from '@nexa-calendar/core';
export declare class NxTimelineView extends LitElement {
    grid: TimelineGrid;
    locale: Locale;
    editable: boolean;
    eventStartEditable: boolean;
    eventContent?: (event: ICalendarEvent) => {
        template: string;
        className?: string;
    };
    render(): import("lit").TemplateResult<1>;
    private _renderEventContent;
    private _dateClick;
    private _eventClick;
    private _onEventDragStart;
    protected createRenderRoot(): this;
}
