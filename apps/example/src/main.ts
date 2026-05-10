import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import './style.css';
import { i18n } from './i18n';

// Import pages
import HomePage from './pages/HomePage.vue';
import DemoPage from './pages/DemoPage.vue';
import Demos2Page from './pages/Demos2Page.vue';
import DocsPage from './pages/DocsPage.vue';
import FeaturesPage from './pages/FeaturesPage.vue';
import SupportPage from './pages/SupportPage.vue';

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/demo', name: 'demo', component: DemoPage },
    { path: '/demos2', name: 'demos2', component: Demos2Page },
    { path: '/docs', name: 'docs', component: DocsPage },
    { path: '/features', name: 'features', component: FeaturesPage },
    { path: '/support', name: 'support', component: SupportPage },
  ],
});

// Create and mount app
const app = createApp(App);
app.use(router);
app.use(i18n);
app.mount('#app');
