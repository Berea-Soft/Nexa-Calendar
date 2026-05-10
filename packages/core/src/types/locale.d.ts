export interface Locale {
  code: string;
  direction: 'ltr' | 'rtl';
  weekdays: {
    shorthand: [string, string, string, string, string, string, string];
    long: [string, string, string, string, string, string, string];
  };
  months: {
    shorthand: [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
    ];
    long: [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
    ];
  };
  buttonText: {
    today: string;
    month: string;
    week: string;
    day: string;
    list: string;
    prev: string;
    next: string;
  };
  titleFormats: {
    month: string;
    week: string;
    day: string;
    list: string;
  };
  moreLinkText: (n: number) => string;
  noEventsText: string;
  timeFormat: string;
}
export type LocaleCode = string;
