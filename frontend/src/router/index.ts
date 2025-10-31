// frontend/src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import { useAuthStore } from '@/stores/auth'; // 匯入 auth store

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true } // 【新增】要求這個頁面必須登入
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'), // 懶加載登入組件
    },
    // ... 其他路由 (如 /customers)
  ],
});

// 【新增】導航守衛 (Navigation Guard)
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // 如果需要登入但用戶未認證，則導航到登入頁
    next({ name: 'login' });
  } else if (to.name === 'login' && authStore.isAuthenticated) {
    // 如果已登入，嘗試訪問登入頁，則導航到主頁
    next({ name: 'home' });
  } else {
    // 其他情況正常導航
    next();
  }
});

export default router;