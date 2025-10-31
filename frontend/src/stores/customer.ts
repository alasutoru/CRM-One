// frontend/src/stores/customer.js

import { defineStore } from 'pinia';
import api from '@/services/api'; // 從 /api/ 根路徑導入 Axios 實例

export const useCustomerStore = defineStore('customer', {
  state: () => ({
    customers: [], // 儲存客戶列表數據
    isLoading: false,
    error: null,
  }),
  
  actions: {
    // 獲取客戶列表 (將來會包含搜索和分頁參數)
    async fetchCustomers(params = {}) {
      this.isLoading = true;
      this.error = null;
      
      try {
        // 調用 /api/v1/customers/ 接口
        // 這裡的路徑是相對於 api.js 中 baseURL (即 /api/) 的
        const response = await api.get('v1/customers/', { params }); 
        
        // 成功獲取數據
        this.customers = response.data; 
        
      } catch (error) {
        console.error('獲取客戶列表失敗:', error);
        this.error = '無法載入客戶數據，請檢查網路或登入狀態。';
        // 如果是 401 錯誤，可以觸發登出
        if (error.response && error.response.status === 401) {
            // 注意：這裡如果需要調用 authStore，需要先導入 useAuthStore()
        }
      } finally {
        this.isLoading = false;
      }
    },
    
    // 清除客戶數據
    clearCustomers() {
      this.customers = [];
    }
    
    // 將來可以在這裡添加 create, update, delete 的方法
  },
});