<template>
  <div class="docs-page">
    <div class="max-w-4xl mx-auto px-4 py-12">
      <h1 class="text-4xl font-bold text-white mb-8">{{ t('docs.title') }}</h1>
      
      <!-- CodeSandbox Links -->
      <div class="mb-12">
        <h2 class="text-2xl font-semibold text-white mb-4">{{ t('docs.interactive') }}</h2>
        <div class="grid md:grid-cols-2 gap-4">
          <a href="https://codesandbox.io/s/nexa-calendar-react" target="_blank" class="doc-card">
            <IconReact className="w-8 h-8" />
            <div>
              <div class="font-semibold text-white">React Example</div>
              <div class="text-sm text-slate-400">{{ t('docs.sandbox') }}</div>
            </div>
          </a>
          <a href="https://codesandbox.io/s/nexa-calendar-vue" target="_blank" class="doc-card">
            <IconVue className="w-8 h-8" />
            <div>
              <div class="font-semibold text-white">Vue Example</div>
              <div class="text-sm text-slate-400">{{ t('docs.sandbox') }}</div>
            </div>
          </a>
          <a href="https://codesandbox.io/s/nexa-calendar-svelte" target="_blank" class="doc-card">
            <IconSvelte className="w-8 h-8" />
            <div>
              <div class="font-semibold text-white">Svelte Example</div>
              <div class="text-sm text-slate-400">{{ t('docs.sandbox') }}</div>
            </div>
          </a>
          <a href="https://codesandbox.io/s/nexa-calendar-vanilla" target="_blank" class="doc-card">
            <IconJS className="w-8 h-8" />
            <div>
              <div class="font-semibold text-white">Vanilla JS Example</div>
              <div class="text-sm text-slate-400">{{ t('docs.sandbox') }}</div>
            </div>
          </a>
        </div>
      </div>

      <!-- Getting Started -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-white mb-4">{{ t('docs.gettingStarted') }}</h2>
        <div class="code-block">
          <h3 class="text-white font-semibold mb-3">{{ t('docs.installation') }}</h3>
          <pre><code><span class="text-purple-400">npm</span> install @nexa-calendar/ui @nexa-calendar/core</code></pre>
        </div>
      </section>

      <!-- API Reference -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-white mb-4">{{ t('docs.api') }}</h2>
        <div class="space-y-4">
          <div class="api-item">
            <code class="text-cyan-400">view</code>
            <span class="text-slate-400">- {{ t('docs.api_desc.view') }}</span>
          </div>
          <div class="api-item">
            <code class="text-cyan-400">events</code>
            <span class="text-slate-400">- {{ t('docs.api_desc.events') }}</span>
          </div>
          <div class="api-item">
            <code class="text-cyan-400">locale</code>
            <span class="text-slate-400">- {{ t('docs.api_desc.locale') }}</span>
          </div>
          <div class="api-item">
            <code class="text-cyan-400">theme</code>
            <span class="text-slate-400">- {{ t('docs.api_desc.theme') }}</span>
          </div>
          <div class="api-item">
            <code class="text-cyan-400">businessHours</code>
            <span class="text-slate-400">- {{ t('docs.api_desc.biz') }}</span>
          </div>
          <div class="api-item">
            <code class="text-cyan-400">editable</code>
            <span class="text-slate-400">- {{ t('docs.api_desc.editable') }}</span>
          </div>
        </div>
      </section>

      <!-- View Types -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-white mb-4">{{ t('docs.viewTypes') }}</h2>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="view-type-card">📅 <strong>month</strong> - 7×N grid</div>
          <div class="view-type-card">📅 <strong>week</strong> - 7 days × 24h</div>
          <div class="view-type-card">📅 <strong>workWeek</strong> - Mon-Fri</div>
          <div class="view-type-card">📅 <strong>day</strong> - 1 day × 24h</div>
          <div class="view-type-card">📋 <strong>list</strong> - Chronological list</div>
          <div class="view-type-card">📈 <strong>timeline</strong> - Horizontal timeline</div>
          <div class="view-type-card">👥 <strong>timelineDay/Week/Month</strong> - Resource timeline</div>
          <div class="view-type-card">🗓️ <strong>year</strong> - 12 mini-months</div>
        </div>
      </section>

      <!-- Events -->
      <section>
        <h2 class="text-2xl font-semibold text-white mb-4">{{ t('docs.eventObject') }}</h2>
        <div class="code-block">
<pre><code>{
  <span class="text-cyan-400">id</span>: <span class="text-orange-400">string</span>,
  <span class="text-cyan-400">title</span>: <span class="text-orange-400">string</span>,
  <span class="text-cyan-400">start</span>: <span class="text-orange-400">string</span>, <span class="text-slate-500">// ISO date</span>
  <span class="text-cyan-400">end</span>?: <span class="text-orange-400">string</span>,
  <span class="text-cyan-400">allDay</span>?: <span class="text-orange-400">boolean</span>,
  <span class="text-cyan-400">backgroundColor</span>?: <span class="text-orange-400">string</span>,
  <span class="text-cyan-400">textColor</span>?: <span class="text-orange-400">string</span>,
  <span class="text-cyan-400">display</span>?: <span class="text-orange-400">'auto' | 'background'</span>
}</code></pre>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { IconReact, IconVue, IconSvelte, IconJS } from '../components/common/icons'
const { t } = useI18n()
</script>

<style scoped>
.docs-page { min-height: 100vh; background: #020617; }
.doc-card {
  display: flex; align-items: center; gap: 16px;
  background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255,255,255,0.05);
  padding: 20px; border-radius: 12px; transition: all 0.3s;
  text-decoration: none;
}
.doc-card:hover { border-color: rgba(99, 102, 241, 0.3); transform: translateY(-2px); }
.code-block {
  background: #0f172a; border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px; padding: 20px; overflow-x: auto;
}
.code-block code { color: #34d399; font-size: 14px; }
.api-item {
  background: rgba(15, 23, 42, 0.3); padding: 12px 16px;
  border-radius: 8px; border-left: 3px solid #6366f1;
}
.view-type-card {
  background: rgba(15, 23, 42, 0.3); padding: 16px;
  border-radius: 8px; color: #e2e8f0;
}
</style>
