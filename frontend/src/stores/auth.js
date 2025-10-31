// frontend/src/stores/auth.js

import { defineStore } from 'pinia';
import api from '@/services/api'; // 導入我們剛配置的 Axios 實例

// 從 LocalStorage 獲取初始 Token
const getInitialAccessToken = () => localStorage.getItem('access_token') || null;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // 儲存 JWT Access Token
    accessToken: getInitialAccessToken(),
    // 儲存 Refresh Token (用於換取新 Access Token，暫時不需要 LocalStorage 儲存)
    refreshToken: null, 
    // 用戶資訊
    user: null, 
    isAuthenticated: !!getInitialAccessToken(),
  }),

  actions: {
    // 處理登入邏輯
    async login(credentials) {
      try {
        // 調用後端 JWT 登入接口 (注意 URL 路徑是 /api/token/ 而不是 /api/v1/token/)
        const response = await api.post('token/', credentials); 

        const { access, refresh } = response.data;
        
        // 1. 更新狀態
        this.accessToken = access;
        this.refreshToken = refresh;
        this.isAuthenticated = true;

        // 2. 儲存到 LocalStorage (讓使用者在關閉瀏覽器後仍保持登入)
        localStorage.setItem('access_token', access);
        // 通常 refresh token 不儲存在 LocalStorage，以防 XSS 攻擊，但為了方便先儲存
        // localStorage.setItem('refresh_token', refresh); 

        // 3. 配置所有後續 API 請求的頭部 (Header)
        this.setAuthHeader(access);

        // TODO: 這裡可以加入獲取用戶詳情 (user) 的邏輯

        return response.data;
      } catch (error) {
        this.logout(); // 登入失敗時清除所有 Token
        throw error;
      }
    },

    // 處理登出邏輯
    logout() {
      this.accessToken = null;
      this.refreshToken = null;
      this.isAuthenticated = false;
      localStorage.removeItem('access_token');
      // 移除 Axios 請求頭
      this.setAuthHeader(null);
    },
    
    // 設定所有 API 請求的 Authorization Header
    setAuthHeader(token) {
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        delete api.defaults.headers.common['Authorization'];
      }
    },

    // 應用啟動時的初始化邏輯
    initialize() {
      const token = getInitialAccessToken();
      if (token) {
        this.setAuthHeader(token);
        // TODO: 這裡可以加入檢查 Token 是否過期的邏輯
      }
    }
  },
});