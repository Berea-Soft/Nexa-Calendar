import { LitElement } from 'lit';
import type { ResourceTimelineGrid, Locale } from '@nexa-calendar/core';
export declare class NxResourceTimelineView extends LitElement {
  grid: ResourceTimelineGrid;
  locale: Locale;
  editable: boolean;
  eventStartEditable: boolean;
  render(): import('lit').TemplateResult<1>;
  private _renderRow;
  private _dateClick;
  private _eventClick;
  private _onEventDragStart;
  protected createRenderRoot(): this;
}
