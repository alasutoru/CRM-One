<template>
  <div class="home-container">
    <h1>歡迎來到 CRM 儀表板 (需登入)</h1>
    <p>這裡是應用程式的主頁面，只有成功登入後才能看到。</p>
    
    <button @click="handleLogout">登出</button> 
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  // 登出後導航到登入頁
  router.push({ name: 'login' });
};
</script>

<style scoped>
.home-container {
  padding: 40px;
  text-align: center;
}
.home-container h1 {
  color: #42b883;
  margin-bottom: 20px;
}
</style>