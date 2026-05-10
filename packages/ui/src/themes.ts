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

const defaultTokens: ThemeTokens = {
  '--nx-bg': '#ffffff',
  '--nx-surface': '#ffffff',
  '--nx-surface-alt': '#f9fafb',
  '--nx-border': '#e5e7eb',
  '--nx-border-light': '#f3f4f6',
  '--nx-text': '#111827',
  '--nx-text-muted': '#6b7280',
  '--nx-text-faint': '#9ca3af',
  '--nx-accent': '#3b82f6',
  '--nx-accent-hover': '#2563eb',
  '--nx-accent-text': '#ffffff',
  '--nx-today-bg': '#eff6ff',
  '--nx-today-ring': '#3b82f6',
  '--nx-weekend-bg': '#fafafa',
  '--nx-header-bg': '#f9fafb',
  '--nx-header-text': '#374151',
  '--nx-hover': '#f3f4f6',
  '--nx-shadow': '0 1px 3px 0 rgb(0 0 0 / .1), 0 1px 2px -1px rgb(0 0 0 / .1)',
  '--nx-radius': '0.75rem',
};

export const themes: Record<NxTheme, ThemeTokens> = {
  light: {
    '--nx-bg': '#ffffff',
    '--nx-surface': '#ffffff',
    '--nx-surface-alt': '#f9fafb',
    '--nx-border': '#e5e7eb',
    '--nx-border-light': '#f3f4f6',
    '--nx-text': '#111827',
    '--nx-text-muted': '#6b7280',
    '--nx-text-faint': '#9ca3af',
    '--nx-accent': '#3b82f6',
    '--nx-accent-hover': '#2563eb',
    '--nx-accent-text': '#ffffff',
    '--nx-today-bg': '#eff6ff',
    '--nx-today-ring': '#3b82f6',
    '--nx-weekend-bg': '#fafafa',
    '--nx-header-bg': '#f9fafb',
    '--nx-header-text': '#374151',
    '--nx-hover': '#f3f4f6',
    '--nx-shadow': '0 1px 3px 0 rgb(0 0 0 / .1), 0 1px 2px -1px rgb(0 0 0 / .1)',
    '--nx-radius': '0.75rem',
  },
  dark: {
    '--nx-bg': '#0f172a',
    '--nx-surface': '#1e293b',
    '--nx-surface-alt': '#0f172a',
    '--nx-border': '#334155',
    '--nx-border-light': '#1e293b',
    '--nx-text': '#f1f5f9',
    '--nx-text-muted': '#94a3b8',
    '--nx-text-faint': '#64748b',
    '--nx-accent': '#60a5fa',
    '--nx-accent-hover': '#93c5fd',
    '--nx-accent-text': '#0f172a',
    '--nx-today-bg': '#1e3a5f',
    '--nx-today-ring': '#60a5fa',
    '--nx-weekend-bg': '#162032',
    '--nx-header-bg': '#0f172a',
    '--nx-header-text': '#cbd5e1',
    '--nx-hover': '#334155',
    '--nx-shadow': '0 1px 3px 0 rgb(0 0 0 / .4)',
    '--nx-radius': '0.75rem',
  },
  ocean: {
    '--nx-bg': '#f0f9ff',
    '--nx-surface': '#ffffff',
    '--nx-surface-alt': '#e0f2fe',
    '--nx-border': '#bae6fd',
    '--nx-border-light': '#e0f2fe',
    '--nx-text': '#0c4a6e',
    '--nx-text-muted': '#0369a1',
    '--nx-text-faint': '#7dd3fc',
    '--nx-accent': '#0284c7',
    '--nx-accent-hover': '#0369a1',
    '--nx-accent-text': '#ffffff',
    '--nx-today-bg': '#e0f2fe',
    '--nx-today-ring': '#0284c7',
    '--nx-weekend-bg': '#f0f9ff',
    '--nx-header-bg': '#e0f2fe',
    '--nx-header-text': '#0c4a6e',
    '--nx-hover': '#bae6fd',
    '--nx-shadow': '0 1px 3px 0 rgb(2 132 199 / .15)',
    '--nx-radius': '0.75rem',
  },
  rose: {
    '--nx-bg': '#fff1f2',
    '--nx-surface': '#ffffff',
    '--nx-surface-alt': '#ffe4e6',
    '--nx-border': '#fecdd3',
    '--nx-border-light': '#ffe4e6',
    '--nx-text': '#881337',
    '--nx-text-muted': '#be123c',
    '--nx-text-faint': '#fda4af',
    '--nx-accent': '#e11d48',
    '--nx-accent-hover': '#be123c',
    '--nx-accent-text': '#ffffff',
    '--nx-today-bg': '#ffe4e6',
    '--nx-today-ring': '#e11d48',
    '--nx-weekend-bg': '#fff1f2',
    '--nx-header-bg': '#ffe4e6',
    '--nx-header-text': '#881337',
    '--nx-hover': '#fecdd3',
    '--nx-shadow': '0 1px 3px 0 rgb(225 29 72 / .15)',
    '--nx-radius': '0.75rem',
  },
  slate: {
    '--nx-bg': '#f8fafc',
    '--nx-surface': '#ffffff',
    '--nx-surface-alt': '#f1f5f9',
    '--nx-border': '#cbd5e1',
    '--nx-border-light': '#e2e8f0',
    '--nx-text': '#0f172a',
    '--nx-text-muted': '#475569',
    '--nx-text-faint': '#94a3b8',
    '--nx-accent': '#475569',
    '--nx-accent-hover': '#334155',
    '--nx-accent-text': '#ffffff',
    '--nx-today-bg': '#e2e8f0',
    '--nx-today-ring': '#64748b',
    '--nx-weekend-bg': '#f8fafc',
    '--nx-header-bg': '#f1f5f9',
    '--nx-header-text': '#1e293b',
    '--nx-hover': '#e2e8f0',
    '--nx-shadow': '0 1px 3px 0 rgb(0 0 0 / .08)',
    '--nx-radius': '0.5rem',
  },
  forest: {
    '--nx-bg': '#f0fdf4',
    '--nx-surface': '#ffffff',
    '--nx-surface-alt': '#dcfce7',
    '--nx-border': '#bbf7d0',
    '--nx-border-light': '#dcfce7',
    '--nx-text': '#14532d',
    '--nx-text-muted': '#166534',
    '--nx-text-faint': '#86efac',
    '--nx-accent': '#16a34a',
    '--nx-accent-hover': '#15803d',
    '--nx-accent-text': '#ffffff',
    '--nx-today-bg': '#dcfce7',
    '--nx-today-ring': '#16a34a',
    '--nx-weekend-bg': '#f0fdf4',
    '--nx-header-bg': '#dcfce7',
    '--nx-header-text': '#14532d',
    '--nx-hover': '#bbf7d0',
    '--nx-shadow': '0 1px 3px 0 rgb(22 163 74 / .15)',
    '--nx-radius': '0.75rem',
  },
  amber: {
    '--nx-bg': '#fffbeb',
    '--nx-surface': '#ffffff',
    '--nx-surface-alt': '#fef3c7',
    '--nx-border': '#fde68a',
    '--nx-border-light': '#fef3c7',
    '--nx-text': '#78350f',
    '--nx-text-muted': '#92400e',
    '--nx-text-faint': '#fcd34d',
    '--nx-accent': '#d97706',
    '--nx-accent-hover': '#b45309',
    '--nx-accent-text': '#ffffff',
    '--nx-today-bg': '#fef3c7',
    '--nx-today-ring': '#d97706',
    '--nx-weekend-bg': '#fffbeb',
    '--nx-header-bg': '#fef3c7',
    '--nx-header-text': '#78350f',
    '--nx-hover': '#fde68a',
    '--nx-shadow': '0 1px 3px 0 rgb(217 119 6 / .15)',
    '--nx-radius': '0.75rem',
  },
  custom: defaultTokens,
};

export function applyTheme(element: HTMLElement, theme: NxTheme | CustomThemeInput): void {
  let tokens: ThemeTokens;

  if (typeof theme === 'object' && theme !== null) {
    tokens = { ...defaultTokens, ...theme } as ThemeTokens;
  } else {
    tokens = themes[theme as NxTheme] ?? themes.light;
  }

  for (const [prop, value] of Object.entries(tokens)) {
    if (value !== undefined) {
      element.style.setProperty(prop, value);
    }
  }

  const themeName = typeof theme === 'object' ? (theme.name ?? 'custom') : theme;
  element.setAttribute('data-nx-theme', themeName);
}
