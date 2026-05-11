import { angularExamples } from './code-examples/angular';
import { reactExamples } from './code-examples/react';
import { demoExampleMeta } from './code-examples/shared';
import { svelteExamples } from './code-examples/svelte';
import type {
  CodeExamples,
  ExampleMeta,
  FrameworkKey,
  FrameworkMeta,
  TemplateMap,
} from './code-examples/types';
import { vanillaExamples } from './code-examples/vanilla';
import { vueExamples } from './code-examples/vue';

export type {
  CodeExamples,
  ExampleConfig,
  ExampleMeta,
  FrameworkExamples,
  FrameworkKey,
  FrameworkMeta,
  ProjectFiles,
  TemplateMap,
} from './code-examples/types';

export const codeExamples: CodeExamples = {
  vue: vueExamples,
  react: reactExamples,
  svelte: svelteExamples,
  angular: angularExamples,
  vanilla: vanillaExamples,
};

export const examplesByFramework: Record<FrameworkKey, ExampleMeta[]> = {
  vue: demoExampleMeta,
  react: demoExampleMeta,
  svelte: demoExampleMeta,
  angular: demoExampleMeta,
  vanilla: demoExampleMeta,
};

export const frameworks: FrameworkMeta[] = [
  { key: 'vue', label: 'Vue 3', emoji: '💚' },
  { key: 'react', label: 'React', emoji: '⚛️' },
  { key: 'svelte', label: 'Svelte', emoji: '🔥' },
  { key: 'angular', label: 'Angular', emoji: '🅰️' },
  { key: 'vanilla', label: 'Vanilla JS', emoji: '📜' },
];

export const templateMap: TemplateMap = {
  vue: 'node',
  react: 'node',
  svelte: 'node',
  angular: 'angular-cli',
  vanilla: 'javascript',
};
