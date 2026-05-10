import { LitElement } from 'lit';
import type { YearGrid, Locale } from '@nexa-calendar/core';
export declare class NxYearView extends LitElement {
  grid: YearGrid;
  locale: Locale;
  render(): import('lit').TemplateResult<1>;
  private _renderMonth;
  private _navigateToMonth;
  private _dayClick;
  protected createRenderRoot(): this;
}
