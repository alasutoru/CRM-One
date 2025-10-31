<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h2>新增客戶</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="name">客戶名稱</label>
          <input type="text" id="name" v-model="customer.name" required>
        </div>
        
        <div class="form-group">
          <label for="email">電子郵件</label>
          <input type="email" id="email" v-model="customer.email" required>
        </div>

        <div class="form-group">
          <label for="phone">電話</label>
          <input type="tel" id="phone" v-model="customer.phone">
        </div>

        <div class="form-group">
          <label for="status">狀態</label>
          <select id="status" v-model="customer.status">
            <option value="lead">潛在客戶 (Lead)</option>
            <option value="active">活躍客戶 (Active)</option>
            <option value="inactive">非活躍客戶 (Inactive)</option>
          </select>
        </div>

        <button type="submit" :disabled="isLoading">
          {{ isLoading ? '提交中...' : '儲存客戶' }}
        </button>
        <button type="button" @click="$emit('close')" class="cancel-button">
          取消
        </button>

        <p v-if="error" class="error-message">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'; // 修正：移除了 defineEmits
import { useCustomerStore } from '@/stores/customer';

// 定義組件發出的事件 (defineEmits 會被自動匯入)
const emit = defineEmits(['close', 'success']);

const customerStore = useCustomerStore();

// 表單數據狀態
const customer = reactive({
  name: '',
  email: '',
  phone: '',
  status: 'lead', 
});

const isLoading = ref(false);
const error = ref(null);

const submitForm = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    // 【核心修正】：調用 Pinia Store 中的 createCustomer action
    await customerStore.createCustomer(customer); 

    // 成功後，發出 success 事件 (讓父組件重新載入列表)
    emit('success');
    
  } catch (err) {
    // 處理後端返回的表單驗證錯誤 (例如 400 Bad Request)
    if (err.response && err.response.data) {
        // 嘗試從後端錯誤中提取具體訊息
        error.value = '新增失敗：' + Object.values(err.response.data).flat().join(', ');
    } else {
        error.value = '創建失敗，請檢查網路或伺服器狀態。';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* (樣式部分與之前相同，這裡省略) */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
input, select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
button {
  padding: 10px 15px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  transition: background-color 0.2s;
}
.cancel-button {
  background-color: #ccc;
  color: #333;
}
.error-message {
  color: red;
  margin-top: 10px;
}
</style>