// frontend/src/stores/customer.ts (完整內容，加入 updateCustomer)

import { defineStore } from 'pinia';
import api from '@/services/api'; 

export const useCustomerStore = defineStore('customer', {
  state: () => ({
    customers: [], 
    isLoading: false,
    error: null,
  }),
  
  actions: {
    // 獲取客戶列表
    async fetchCustomers(params = {}) {
      this.isLoading = true;
      this.error = null;
      // ... (fetchCustomers 邏輯保持不變)
      try {
        const response = await api.get('v1/customers/', { params }); 
        this.customers = response.data; 
      } catch (error) {
        console.error('獲取客戶列表失敗:', error);
        this.error = '無法載入客戶數據，請檢查網路或登入狀態。';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    // 處理客戶新增邏輯
    async createCustomer(customerData) {
      this.isLoading = true; 
      this.error = null;
      // ... (createCustomer 邏輯保持不變)
      try {
        const response = await api.post('v1/customers/', customerData); 
        return response.data;
      } catch (error) {
        console.error('創建客戶失敗:', error);
        this.error = '新增客戶失敗，請檢查輸入。';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // 【新增】處理客戶更新邏輯
    async updateCustomer(id, customerData) {
        this.isLoading = true;
        this.error = null;
        try {
            // 使用 PUT/PATCH 請求更新指定 ID 的客戶
            const response = await api.put(`v1/customers/${id}/`, customerData);
            const updatedCustomer = response.data;

            // 【關鍵修正點】：在本地狀態中找到並替換該客戶，實現即時更新
            const index = this.customers.findIndex(c => c.id === id);
            if (index !== -1) {
                // 使用 Vue 的 set 方法確保響應性（儘管 Vue 3 中直接替換也通常可行，但這是最保險的做法）
                this.customers[index] = updatedCustomer;
            }

            return updatedCustomer;
        } catch (error) {
            console.error('更新客戶失敗:', error);
            this.error = '更新客戶失敗，請檢查輸入。';
            throw error;
        } finally {
            this.isLoading = false;
        }
    },

    // 處理客戶刪除邏輯
    async deleteCustomer(id) {
      this.error = null;
      // ... (deleteCustomer 邏輯保持不變)
      try {
        await api.delete(`v1/customers/${id}/`); 
        this.customers = this.customers.filter(customer => customer.id !== id);
      } catch (error) {
        console.error('刪除客戶失敗:', error);
        this.error = '刪除客戶失敗，請稍後再試。';
        throw error;
      }
    },

    clearCustomers() {
      this.customers = [];
    }
  },
});