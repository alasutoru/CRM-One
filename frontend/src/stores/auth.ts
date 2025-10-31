// frontend/src/stores/auth.ts

import { defineStore } from 'pinia';
import api from '@/services/api'; 
// 注意：由於你將檔案改為 .ts，這裡可能需要 TypeScript 類型，但目前保持這樣可以運行。

// 從 LocalStorage 獲取初始 Token
const getInitialAccessToken = () => localStorage.getItem('access_token') || null;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: getInitialAccessToken(),
    refreshToken: null, 
    user: null, 
    isAuthenticated: !!getInitialAccessToken(),
  }),

  actions: {
    async login(credentials) {
      try {
        const response = await api.post('token/', credentials); 

        const { access, refresh } = response.data;
        
        this.accessToken = access;
        this.refreshToken = refresh;
        this.isAuthenticated = true;

        localStorage.setItem('access_token', access);
        
        // 核心邏輯：在登入成功時設置 Header
        this.setAuthHeader(access);

        return response.data;
      } catch (error) {
        this.logout(); 
        throw error;
      }
    },

    logout() {
      this.accessToken = null;
      this.refreshToken = null;
      this.isAuthenticated = false;
      localStorage.removeItem('access_token');
      // 移除 Axios 請求頭
      this.setAuthHeader(null);
    },
    
    // 核心邏輯：設置或移除 Authorization Header
    setAuthHeader(token) {
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        delete api.defaults.headers.common['Authorization'];
      }
    },

    // 應用啟動時的初始化邏輯：從 LocalStorage 恢復 Token
    initialize() {
      const token = getInitialAccessToken();
      if (token) {
        this.setAuthHeader(token);
      }
    }
  },
});