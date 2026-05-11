<template>
  <div id="app">
    <!-- Navigation -->
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-brand">
          <span class="nav-icon">📅</span>
          <span class="nav-logo">Nexa-Calendar</span>
        </router-link>

        <div class="nav-links">
          <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">
            {{ t('nav.home') }}
          </router-link>
          <router-link to="/demo" class="nav-link" :class="{ active: $route.path === '/demo' }">
            {{ t('nav.demo') }}
          </router-link>
          <router-link to="/demos2" class="nav-link" :class="{ active: $route.path === '/demos2' }">
            {{ t('nav.demos2') }}
          </router-link>
          <router-link to="/docs" class="nav-link" :class="{ active: $route.path === '/docs' }">
            {{ t('nav.docs') }}
          </router-link>
          <router-link
            to="/features"
            class="nav-link"
            :class="{ active: $route.path === '/features' }"
          >
            {{ t('nav.features') }}
          </router-link>
          <router-link
            to="/support"
            class="nav-link"
            :class="{ active: $route.path === '/support' }"
          >
            {{ t('nav.support') }}
          </router-link>
        </div>

        <div class="nav-right">
          <!-- Language Picker -->
          <LangPicker v-model="locale" />

          <a
            href="https://github.com/nexa-calendar/nexa-calendar"
            target="_blank"
            class="nav-github"
          >
            <IconGithub className="w-5 h-5" />
          </a>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { injectSpeedInsights } from '@vercel/speed-insights';

injectSpeedInsights();
import { IconGithub } from './components/common/icons';
import LangPicker from './components/LangPicker.vue';

const { t, locale } = useI18n();

watch(locale, newLocale => {
  localStorage.setItem('nx-locale', newLocale);
});
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(2, 6, 23, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}
.nav-icon {
  font-size: 24px;
}
.nav-logo {
  font-size: 18px;
  font-weight: 700;
  color: white;
}

.nav-links {
  display: flex;
  gap: 8px;
}
.nav-link {
  padding: 8px 16px;
  border-radius: 8px;
  color: #94a3b8;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s;
}
.nav-link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.05);
}
.nav-link.active {
  color: white;
  background: rgba(99, 102, 241, 0.2);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-github {
  color: #64748b;
  transition: color 0.2s;
}
.nav-github:hover {
  color: white;
}

.main-content {
  flex: 1;
  margin-top: 64px;
}

/* Page transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
