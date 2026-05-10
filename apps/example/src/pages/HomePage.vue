<template>
  <div class="home-page">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div class="text-center">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <span class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span class="text-sm text-slate-400">v1.0.0 · 6 Frameworks · 40+ Locales</span>
          </div>

          <h1 class="text-5xl md:text-7xl font-bold text-white mb-6">
            Build Beautiful<br>
            <span class="code-gradient">Calendars Faster</span>
          </h1>

          <p class="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            {{ t('home.subtitle') }}
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <router-link to="/demo" class="px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white rounded-xl font-semibold transition shadow-lg shadow-indigo-500/25">
              {{ t('home.cta') }} →
            </router-link>
            <a href="https://github.com/nexa-calendar/nexa-calendar" class="px-8 py-4 bg-white/5 text-white rounded-xl font-semibold transition border border-white/10 flex items-center gap-2">
              <IconGithub className="w-5 h-5" />
              {{ t('home.github') }}
            </a>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-3xl mx-auto">
          <div class="text-center p-4">
            <div class="text-3xl font-bold text-white">6</div>
            <div class="text-sm text-slate-500">{{ t('home.stats.frameworks') }}</div>
          </div>
          <div class="text-center p-4">
            <div class="text-3xl font-bold text-white">8+</div>
            <div class="text-sm text-slate-500">{{ t('home.stats.views') }}</div>
          </div>
          <div class="text-center p-4">
            <div class="text-3xl font-bold text-white">40+</div>
            <div class="text-sm text-slate-500">{{ t('home.stats.locales') }}</div>
          </div>
          <div class="text-center p-4">
            <div class="text-3xl font-bold text-white">100%</div>
            <div class="text-sm text-slate-500">{{ t('home.stats.typescript') }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-white mb-4">{{ t('home.features_title') }}</h2>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="feature-card">
            <div class="feature-icon indi">📅</div>
            <h3>{{ t('home.features.views.title') }}</h3>
            <p>{{ t('home.features.views.desc') }}</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon purp">✋</div>
            <h3>{{ t('home.features.dnd.title') }}</h3>
            <p>{{ t('home.features.dnd.desc') }}</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon green">🌍</div>
            <h3>{{ t('home.features.locales.title') }}</h3>
            <p>{{ t('home.features.locales.desc') }}</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon yell">🌐</div>
            <h3>{{ t('home.features.timezones.title') }}</h3>
            <p>{{ t('home.features.timezones.desc') }}</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon pink">⚛️</div>
            <h3>{{ t('home.features.frameworks.title') }}</h3>
            <p>{{ t('home.features.frameworks.desc') }}</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon cyan">🎨</div>
            <h3>{{ t('home.features.themes.title') }}</h3>
            <p>{{ t('home.features.themes.desc') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Frameworks -->
    <section class="py-16 bg-slate-900/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-10">
          <h2 class="text-2xl font-bold text-white">{{ t('home.frameworks_title') }}</h2>
        </div>
        <div class="flex flex-wrap justify-center gap-4">
          <div class="framework-badge">
            <IconReact className="w-8 h-8" />
            <span>React</span>
          </div>
          <div class="framework-badge">
            <IconVue className="w-8 h-8" />
            <span>Vue</span>
          </div>
          <div class="framework-badge">
            <IconAngular className="w-8 h-8" />
            <span>Angular</span>
          </div>
          <div class="framework-badge">
            <IconSvelte className="w-8 h-8" />
            <span>Svelte</span>
          </div>
          <div class="framework-badge">
            <span class="text-2xl">🌐</span>
            <span>Web Components</span>
          </div>
          <div class="framework-badge">
            <IconJS className="w-8 h-8" />
            <span>Vanilla JS</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Install -->
    <section class="py-16">
      <div class="max-w-3xl mx-auto px-4">
        <div class="install-box">
          <h3>{{ t('home.install_title') }}</h3>
          <code>npm i @nexa-calendar/ui @nexa-calendar/core</code>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { IconGithub, IconAngular, IconVue, IconReact, IconSvelte, IconJS } from '../components/common/icons'
const { t } = useI18n()
</script>

<style scoped>
.hero { position: relative; }
.hero-bg {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.15), transparent),
              radial-gradient(ellipse 60% 40% at 80% 60%, rgba(139, 92, 246, 0.1), transparent);
  z-index: -1;
}
.code-gradient {
  background: linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.feature-card {
  background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255,255,255,0.05);
  border-radius: 16px; padding: 24px; transition: all 0.3s;
}
.feature-card:hover { transform: translateY(-4px); border-color: rgba(99, 102, 241, 0.3); }
.feature-card h3 { color: white; font-weight: 600; margin-bottom: 8px; }
.feature-card p { color: #94a3b8; font-size: 14px; }
.feature-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 16px; }
.feature-icon.indi { background: rgba(99, 102, 241, 0.2); }
.feature-icon.purp { background: rgba(139, 92, 246, 0.2); }
.feature-icon.green { background: rgba(16, 185, 129, 0.2); }
.feature-icon.yell { background: rgba(234, 179, 8, 0.2); }
.feature-icon.pink { background: rgba(236, 72, 153, 0.2); }
.feature-icon.cyan { background: rgba(6, 182, 212, 0.2); }
.framework-badge {
  display: flex; align-items: center; gap: 8px;
  background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255,255,255,0.05);
  padding: 12px 20px; border-radius: 12px; color: white; font-weight: 500;
}
.install-box {
  background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px; padding: 24px;
}
.install-box h3 { color: white; font-weight: 600; margin-bottom: 16px; }
.install-box code {
  display: block; background: #020617; color: #34d399; padding: 16px;
  border-radius: 8px; font-size: 14px;
}
</style>
