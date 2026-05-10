import { LitElement } from 'lit';
import type { ListEvent, Locale } from '@nexa-calendar/core';
export declare class NxListView extends LitElement {
  items: ListEvent[];
  locale: Locale;
  noEventsText: string;
  render(): import('lit').TemplateResult<1>;
  private _groupByDate;
  private _formatDateHeader;
  private _formatTime;
  private _eventClick;
  protected createRenderRoot(): this;
}
