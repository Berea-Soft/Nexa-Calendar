<template>
  <div class="features-page">
    <div class="max-w-4xl mx-auto px-4 py-12">
      <h1 class="text-4xl font-bold text-white mb-4">{{ t('features.title') }}</h1>
      <p class="text-slate-400 mb-12">{{ t('features.subtitle') }}</p>

      <!-- Current Features -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
          <span class="w-3 h-3 bg-emerald-400 rounded-full"></span>
          {{ t('features.current') }}
        </h2>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="feature-item">
            <span class="text-xl">📅</span>
            <div>
              <div class="font-semibold text-white">{{ t('features.list.views') }}</div>
              <div class="text-sm text-slate-400">{{ t('features.list.views_desc') }}</div>
            </div>
          </div>
          <div class="feature-item">
            <span class="text-xl">✋</span>
            <div>
              <div class="font-semibold text-white">{{ t('features.list.dnd') }}</div>
              <div class="text-sm text-slate-400">{{ t('features.list.dnd_desc') }}</div>
            </div>
          </div>
          <div class="feature-item">
            <span class="text-xl">🌍</span>
            <div>
              <div class="font-semibold text-white">{{ t('features.list.locales') }}</div>
              <div class="text-sm text-slate-400">{{ t('features.list.locales_desc') }}</div>
            </div>
          </div>
          <div class="feature-item">
            <span class="text-xl">🌐</span>
            <div>
              <div class="font-semibold text-white">{{ t('features.list.tz') }}</div>
              <div class="text-sm text-slate-400">{{ t('features.list.tz_desc') }}</div>
            </div>
          </div>
          <div class="feature-item">
            <span class="text-xl">⚛️</span>
            <div>
              <div class="font-semibold text-white">{{ t('features.list.frameworks') }}</div>
              <div class="text-sm text-slate-400">{{ t('features.list.frameworks_desc') }}</div>
            </div>
          </div>
          <div class="feature-item">
            <span class="text-xl">🎨</span>
            <div>
              <div class="font-semibold text-white">{{ t('features.list.themes') }}</div>
              <div class="text-sm text-slate-400">{{ t('features.list.themes_desc') }}</div>
            </div>
          </div>
          <div class="feature-item">
            <span class="text-xl">🏢</span>
            <div>
              <div class="font-semibold text-white">{{ t('features.list.biz') }}</div>
              <div class="text-sm text-slate-400">{{ t('features.list.biz_desc') }}</div>
            </div>
          </div>
          <div class="feature-item">
            <span class="text-xl">🎯</span>
            <div>
              <div class="font-semibold text-white">{{ t('features.list.custom') }}</div>
              <div class="text-sm text-slate-400">{{ t('features.list.custom_desc') }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Upcoming -->
      <section>
        <h2 class="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
          <span class="w-3 h-3 bg-yellow-400 rounded-full"></span>
          {{ t('features.upcoming') }}
        </h2>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="upcoming-item">
            <span class="text-xl">📧</span>
            <div>
              <div class="font-semibold text-white">{{ t('features.roadmap.email') }}</div>
              <div class="text-sm text-slate-400">{{ t('features.roadmap.email_desc') }}</div>
            </div>
          </div>
          <div class="upcoming-item">
            <span class="text-xl">🔄</span>
            <div>
              <div class="font-semibold text-white">{{ t('features.roadmap.sync') }}</div>
              <div class="text-sm text-slate-400">{{ t('features.roadmap.sync_desc') }}</div>
            </div>
          </div>
          <div class="upcoming-item">
            <span class="text-xl">📱</span>
            <div>
              <div class="font-semibold text-white">{{ t('features.roadmap.mobile') }}</div>
              <div class="text-sm text-slate-400">{{ t('features.roadmap.mobile_desc') }}</div>
            </div>
          </div>
          <div class="upcoming-item">
            <span class="text-xl">🤖</span>
            <div>
              <div class="font-semibold text-white">{{ t('features.roadmap.ai') }}</div>
              <div class="text-sm text-slate-400">{{ t('features.roadmap.ai_desc') }}</div>
            </div>
          </div>
          <div class="upcoming-item">
            <span class="text-xl">📊</span>
            <div>
              <div class="font-semibold text-white">{{ t('features.roadmap.stats') }}</div>
              <div class="text-sm text-slate-400">{{ t('features.roadmap.stats_desc') }}</div>
            </div>
          </div>
          <div class="upcoming-item">
            <span class="text-xl">🔗</span>
            <div>
              <div class="font-semibold text-white">{{ t('features.roadmap.ical') }}</div>
              <div class="text-sm text-slate-400">{{ t('features.roadmap.ical_desc') }}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<style scoped>
.features-page {
  min-height: 100vh;
  background: #020617;
}
.feature-item,
.upcoming-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 12px;
}
.upcoming-item {
  opacity: 0.8;
  border-style: dashed;
}
</style>
