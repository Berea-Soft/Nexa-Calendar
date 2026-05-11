<template>
  <div class="demos2-page">
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="mb-12">
        <h1 class="text-4xl font-bold text-white mb-4">Interactive Demos</h1>
        <p class="text-slate-400 text-lg">
          Select a framework and explore interactive calendar examples.
        </p>
      </div>

      <div class="mb-12 flex flex-wrap gap-3">
        <button
          v-for="fw in frameworks"
          :key="fw.key"
          @click="selectedFramework = fw.key as FrameworkKey"
          :class="[
            'px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2',
            selectedFramework === fw.key
              ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
              : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white border border-slate-700/50',
          ]"
        >
          <component :is="frameworkIcons[fw.key]" class="size-5 shrink-0" />
          {{ fw.label }}
        </button>
      </div>

      <div class="mb-8">
        <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Select Example
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            v-for="example in currentExamples"
            :key="example.key"
            @click="selectedExample = example.key"
            :class="[
              'p-4 rounded-lg text-left transition-all border',
              selectedExample === example.key
                ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                : 'bg-slate-800/30 border-slate-700/30 text-slate-400 hover:border-slate-600/50 hover:bg-slate-800/50',
            ]"
          >
            <div class="text-2xl mb-2">{{ example.emoji }}</div>
            <div class="font-semibold text-white text-sm">{{ example.title }}</div>
            <div class="text-xs text-slate-400 mt-1">{{ example.description }}</div>
          </button>
        </div>
      </div>

      <div class="stackblitz-wrapper">
        <div class="stackblitz-header">
          <h3 class="font-semibold text-white">
            {{ currentExample?.title }} · {{ currentFramework?.label }}
          </h3>
          <div class="flex gap-3">
            <button
              @click="openInNewWindow"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all"
            >
              Open in StackBlitz
            </button>
          </div>
        </div>
        <div class="mt-4">
          <div
            class="stackblitz-preview bg-slate-800 rounded-lg border border-slate-700 overflow-hidden"
          >
            <div id="embed-container" style="height: 600px"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, type ComputedRef, type Ref } from 'vue';
import sdk, { type EmbedOptions, type OpenOptions, type Project } from '@stackblitz/sdk';
import { IconAngular, IconJS, IconReact, IconSvelte, IconVue } from '../components/common/icons';
import {
  codeExamples,
  examplesByFramework,
  frameworks,
  templateMap,
  type ExampleConfig,
  type ExampleMeta,
  type FrameworkKey,
  type FrameworkMeta,
} from '../data/code-examples';

const { embedProject, openProject } = sdk;

const frameworkIcons: Record<FrameworkKey, unknown> = {
  vue: IconVue,
  react: IconReact,
  svelte: IconSvelte,
  angular: IconAngular,
  vanilla: IconJS,
};

const selectedFramework: Ref<FrameworkKey> = ref<FrameworkKey>('vue');
const selectedExample: Ref<string> = ref(examplesByFramework.vue[0]?.key ?? '');

const currentFramework: ComputedRef<FrameworkMeta | undefined> = computed(() =>
  frameworks.find(framework => framework.key === selectedFramework.value)
);
const currentExamples: ComputedRef<ExampleMeta[]> = computed(
  () => examplesByFramework[selectedFramework.value] ?? []
);
const currentExample: ComputedRef<ExampleMeta | undefined> = computed(
  () =>
    currentExamples.value.find(example => example.key === selectedExample.value) ??
    currentExamples.value[0]
);

function loadExample(framework: FrameworkKey, exampleKey: string): Project {
  const frameworkExamples = codeExamples[framework];
  const fallbackExampleKey = examplesByFramework[framework][0]?.key;
  const files: ExampleConfig =
    frameworkExamples[exampleKey] ??
    (fallbackExampleKey ? frameworkExamples[fallbackExampleKey] : undefined) ??
    {};

  return {
    title: `Nexa-Calendar ${framework} - ${exampleKey}`,
    description: `Nexa-Calendar ${framework} framework example`,
    template: templateMap[framework],
    files,
  };
}

const embedExample = async (): Promise<void> => {
  if (!selectedExample.value) return;

  const options: EmbedOptions = {
    clickToLoad: false,
    hideExplorer: false,
    hideNavigation: false,
  };

  try {
    await embedProject(
      'embed-container',
      loadExample(selectedFramework.value, selectedExample.value),
      options
    );
  } catch (error: unknown) {
    console.error('Embed error:', error);
  }
};

const openInNewWindow = (): void => {
  if (!selectedExample.value) return;

  const options: OpenOptions = { newWindow: true };
  openProject(loadExample(selectedFramework.value, selectedExample.value), options);
};

// Reset to first example when framework changes
watch(selectedFramework, (framework): void => {
  selectedExample.value = examplesByFramework[framework][0]?.key ?? '';
});

watch([selectedFramework, selectedExample], (): void => {
  void embedExample();
});

onMounted((): void => {
  void embedExample();
});
</script>

<style scoped>
.demos2-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1a1f3a 100%);
  padding: 20px 0;
}

.stackblitz-wrapper {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 16px;
  overflow: hidden;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.3),
    0 8px 10px -6px rgba(0, 0, 0, 0.2);
  padding: 20px;
}

.stackblitz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.stackblitz-preview :deep(iframe) {
  display: block;
  width: 100%;
  height: 600px;
  border: none;
}
</style>
