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
          @click="selectedFramework = fw.key"
          :class="[
            'px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2',
            selectedFramework === fw.key
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
              : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white border border-slate-700/50',
          ]"
        >
          <span class="text-xl">{{ fw.emoji }}</span>
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
              @click="openInStackblitz"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all"
            >
              Open in StackBlitz
            </button>
            <button
              @click="copyCode"
              class="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-all"
            >
              {{ copied ? 'Copied!' : 'Copy Code' }}
            </button>
          </div>
        </div>
        <div class="mt-4 p-6 bg-slate-800/50 rounded-lg border border-slate-700 overflow-x-auto">
          <pre class="text-sm text-slate-300"><code>{{ currentCode }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import stackblitz from '@stackblitz/sdk';
import { codeExamples, examplesByFramework, frameworks, templateMap } from '../data/codeExamples';

type FrameworkKey = keyof typeof codeExamples;

const selectedFramework = ref<FrameworkKey>('vue');
const selectedExample = ref('basic');
const copied = ref(false);

const currentFramework = computed(() => frameworks.find(f => f.key === selectedFramework.value));
const currentExamples = computed(() => examplesByFramework[selectedFramework.value]);
const currentExample = computed(
  () => currentExamples.value.find(e => e.key === selectedExample.value) || currentExamples.value[0]
);

const currentCode = computed(() => {
  return codeExamples[selectedFramework.value]?.[selectedExample.value] || '';
});

const copyCode = async () => {
  await navigator.clipboard.writeText(currentCode.value);
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 2000);
};

const openInStackblitz = () => {
  const fw = selectedFramework.value;
  const code = currentCode.value;
  const files: Record<string, string> = {};
  
  if (fw === 'vue' || fw === 'vanilla') {
    files['index.html'] = code;
  } else if (fw === 'react') {
    files['App.jsx'] = code;
    files['index.jsx'] = "import React from 'react'\nimport ReactDOM from 'react-dom/client'\nimport App from './App'\nimport '@nexa-calendar/ui/dist/styles.css'\nReactDOM.createRoot(document.getElementById('root')).render(<App />)";
    files['index.html'] = '<div id="root"></div>';
  } else if (fw === 'svelte') {
    files['App.svelte'] = code;
    files['main.js'] = "import App from './App.svelte'\nnew App({target: document.body})";
  } else if (fw === 'angular') {
    files['src/main.ts'] = code;
  }
  
  stackblitz.createProject({
    template: templateMap[fw],
    files,
    title: `Nexa-Calendar ${fw} - ${selectedExample.value}`,
    description: `Nexa-Calendar ${fw} framework example`,
  });
};
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
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2);
  padding: 20px;
}

.stackblitz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

pre {
  margin: 0;
  padding: 16px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow-x: auto;
}

code {
  font-family: 'Fira Code', 'Consolas', monospace;
}
</style>