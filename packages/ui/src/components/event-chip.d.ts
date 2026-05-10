import { LitElement } from 'lit';
import type { ICalendarEvent } from '@nexa-calendar/core';
export declare class NxEventChip extends LitElement {
  event?: ICalendarEvent;
  draggable: boolean;
  resizable: boolean;
  render(): import('lit').TemplateResult<1> | null;
  private _formatTime;
  private _handleClick;
  private _handleDragStart;
  private _handleResizeStart;
  protected createRenderRoot(): this;
}
