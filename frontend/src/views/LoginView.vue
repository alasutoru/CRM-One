<template>
  <div class="login-container">
    <h2>CRM 系統登入</h2>
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label for="username">用戶名 (Username):</label>
        <input type="text" id="username" v-model="username" required />
      </div>

      <div class="form-group">
        <label for="password">密碼 (Password):</label>
        <input type="password" id="password" v-model="password" required />
      </div>

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? '登入中...' : '登入' }}
      </button>

      <p v-if="error" class="error-message">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const username = ref('');
const password = ref('');
const isLoading = ref(false);
const error = ref(null);

const handleLogin = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    // 呼叫 Pinia Store 中的登入 action
    await authStore.login({
      username: username.value,
      password: password.value,
    });

    // 登入成功後，導航到系統主頁
    router.push('/');
  } catch (err) {
    console.error('登入失敗:', err);
    // 處理常見的 401 錯誤訊息
    if (err.response && err.response.status === 401) {
      error.value = '用戶名或密碼錯誤，請重試。';
    } else {
      error.value = '登入失敗，請檢查網路連接或伺服器狀態。';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* 簡單樣式，讓登入表單看起來像樣 */
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.login-form {
  display: flex;
  flex-direction: column;
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
button {
  padding: 10px;
  background-color: #42b883; /* Vue 綠 */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}
button:disabled {
  background-color: #a5d8b8;
  cursor: not-allowed;
}
.error-message {
  color: red;
  margin-top: 10px;
}
</style>