export type NxTheme = 'light' | 'dark' | 'ocean' | 'rose' | 'slate' | 'forest' | 'amber' | 'custom';
export interface ThemeTokens {
    '--nx-bg': string;
    '--nx-surface': string;
    '--nx-surface-alt': string;
    '--nx-border': string;
    '--nx-border-light': string;
    '--nx-text': string;
    '--nx-text-muted': string;
    '--nx-text-faint': string;
    '--nx-accent': string;
    '--nx-accent-hover': string;
    '--nx-accent-text': string;
    '--nx-today-bg': string;
    '--nx-today-ring': string;
    '--nx-weekend-bg': string;
    '--nx-header-bg': string;
    '--nx-header-text': string;
    '--nx-hover': string;
    '--nx-shadow': string;
    '--nx-radius': string;
}
export interface CustomThemeInput {
    name?: string;
    '--nx-bg'?: string;
    '--nx-surface'?: string;
    '--nx-surface-alt'?: string;
    '--nx-border'?: string;
    '--nx-border-light'?: string;
    '--nx-text'?: string;
    '--nx-text-muted'?: string;
    '--nx-text-faint'?: string;
    '--nx-accent'?: string;
    '--nx-accent-hover'?: string;
    '--nx-accent-text'?: string;
    '--nx-today-bg'?: string;
    '--nx-today-ring'?: string;
    '--nx-weekend-bg'?: string;
    '--nx-header-bg'?: string;
    '--nx-header-text'?: string;
    '--nx-hover'?: string;
    '--nx-shadow'?: string;
    '--nx-radius'?: string;
}
export declare const themes: Record<NxTheme, ThemeTokens>;
export declare function applyTheme(element: HTMLElement, theme: NxTheme | CustomThemeInput): void;
