import { LitElement } from 'lit';
import type { TimelineGrid, Locale } from '@nexa-calendar/core';
export declare class NxTimelineView extends LitElement {
  grid: TimelineGrid;
  locale: Locale;
  editable: boolean;
  eventStartEditable: boolean;
  render(): import('lit').TemplateResult<1>;
  private _dateClick;
  private _eventClick;
  private _onEventDragStart;
  protected createRenderRoot(): this;
}
