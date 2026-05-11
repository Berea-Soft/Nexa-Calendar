import { createRouter as createVueRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/HomePage.vue'),
  },
  {
    path: '/demo',
    name: 'demo',
    component: () => import('../pages/DemoPage.vue'),
  },
  {
    path: '/docs',
    name: 'docs',
    component: () => import('../pages/DocsPage.vue'),
  },
  {
    path: '/features',
    name: 'features',
    component: () => import('../pages/FeaturesPage.vue'),
  },
  {
    path: '/demo2',
    name: 'demo2',
    component: () => import('../pages/Demos2Page.vue'),
  },
  {
    path: '/support',
    name: 'support',
    component: () => import('../pages/SupportPage.vue'),
  },
];

export const router = createVueRouter({
  history: createWebHistory(),
  routes,
});
