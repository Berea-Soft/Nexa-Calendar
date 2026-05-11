import type { ProjectTemplate } from '@stackblitz/sdk';

type FileContent = string;

export type ProjectFiles = Record<string, FileContent>;
export type ExampleConfig = ProjectFiles;

export interface ExampleMeta {
  key: string;
  title: string;
  description: string;
  emoji: string;
}

export type FrameworkKey = 'vue' | 'react' | 'svelte' | 'angular' | 'vanilla';

export interface FrameworkMeta {
  key: FrameworkKey;
  label: string;
  emoji: string;
}

export type FrameworkExamples = Record<string, ExampleConfig>;
export type CodeExamples = Record<FrameworkKey, FrameworkExamples>;
export type TemplateMap = Record<FrameworkKey, ProjectTemplate>;
