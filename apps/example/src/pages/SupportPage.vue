<template>
  <div class="support-page">
    <div class="max-w-4xl mx-auto px-4 py-12">
      <h1 class="text-4xl font-bold text-white mb-4">{{ t('support.title') }}</h1>
      <p class="text-slate-400 mb-12">{{ t('support.subtitle') }}</p>

      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
          <span class="text-xl">💝</span> {{ t('support.donate') }}
        </h2>
        <div class="grid md:grid-cols-3 gap-4">
          <div class="donate-card">
            <div class="text-3xl mb-3">☕</div>
            <div class="font-semibold text-white">{{ t('support.buyCoffee') }}</div>
            <div class="text-2xl font-bold text-emerald-400">$5</div>
          </div>
          <div class="donate-card">
            <div class="text-3xl mb-3">💻</div>
            <div class="font-semibold text-white">{{ t('support.ghSponsors') }}</div>
            <div class="text-2xl font-bold text-emerald-400">$10/mo</div>
          </div>
          <div class="donate-card">
            <div class="text-3xl mb-3">❤️</div>
            <div class="font-semibold text-white">{{ t('support.patreon') }}</div>
            <div class="text-2xl font-bold text-emerald-400">$15/mo</div>
          </div>
        </div>
      </section>

      <section>
        <h2 class="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
          <span class="text-xl">🔧</span> {{ t('support.contribute') }}
        </h2>
        <div class="grid grid-cols-2 gap-4">
          <a href="https://github.com/nexa-calendar/nexa-calendar/fork" class="contribute-card"
            >🍴 Fork</a
          >
          <a href="https://github.com/nexa-calendar/nexa-calendar/issues" class="contribute-card"
            >🐛 Issues</a
          >
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
.support-page {
  min-height: 100vh;
  background: #020617;
}
.donate-card {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 24px;
  border-radius: 16px;
  text-align: center;
}
.contribute-card {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 12px;
  color: white;
  font-weight: 500;
  text-decoration: none;
}
</style>
