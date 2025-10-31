// frontend/src/main.js

import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// 匯入 auth Store
import { useAuthStore } from './stores/auth'; 

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 【新增】應用程式啟動時，初始化 Auth Store
const authStore = useAuthStore();
authStore.initialize(); 

app.mount('#app')
