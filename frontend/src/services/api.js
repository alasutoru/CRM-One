// frontend/src/services/api.js

import axios from 'axios';

// 創建一個 Axios 實例
const api = axios.create({
  // 設定後端 API 的基礎 URL
  // 由於前端運行在 5173，後端運行在 8000，這裡需要指向後端
  baseURL: 'http://127.0.0.1:8000/api/', 
  timeout: 5000, // 請求超時時間
  headers: {
    'Content-Type': 'application/json',
  },
});

// 攔截器：用於處理全局錯誤
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 這裡可以處理全局錯誤，例如：
    // 如果返回 401 (未經授權)，強制用戶登出
    if (error.response.status === 401) {
      console.error('未經授權，Token 可能已過期。');
      // 未來在這裡加入 Pinia 登出邏輯
    }
    return Promise.reject(error);
  }
);

export default api;