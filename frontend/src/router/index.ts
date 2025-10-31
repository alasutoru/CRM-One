// frontend/src/router/index.ts

import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue'; 
import { useAuthStore } from '@/stores/auth'; // 確保這行存在

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'customers',
      component: () => import('../views/CustomersView.vue'),
      meta: { requiresAuth: true }
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('../views/HomeView.vue'),
        meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'), 
    },
  ],
});

// 【核心修正】：導航守衛 (Navigation Guard)
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' });
  } else if (to.name === 'login' && authStore.isAuthenticated) {
    next({ name: 'home' }); // 登入後重定向到 /home，然後路由守衛會再重定向到 /
  } else {
    next();
  }
});

export default router;