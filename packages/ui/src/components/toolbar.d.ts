import { LitElement } from 'lit';
import type { ViewType, Locale } from '@nexa-calendar/core';
export declare class NxToolbar extends LitElement {
  title: string;
  view: ViewType;
  locale: Locale;
  views: ViewType[];
  render(): import('lit').TemplateResult<1>;
  private _emit;
  protected createRenderRoot(): this;
}
