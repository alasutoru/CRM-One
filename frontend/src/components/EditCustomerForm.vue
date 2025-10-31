<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h2>編輯客戶：{{ customerEdit.name }}</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="name">客戶名稱</label>
          <input type="text" id="name" v-model="customerEdit.name" required>
        </div>
        
        <div class="form-group">
          <label for="email">電子郵件</label>
          <input type="email" id="email" v-model="customerEdit.email" required>
        </div>

        <div class="form-group">
          <label for="phone">電話</label>
          <input type="tel" id="phone" v-model="customerEdit.phone">
        </div>

        <div class="form-group">
          <label for="status">狀態</label>
          <select id="status" v-model="customerEdit.status">
            <option value="lead">潛在客戶 (Lead)</option>
            <option value="active">活躍客戶 (Active)</option>
            <option value="inactive">非活躍客戶 (Inactive)</option>
          </select>
        </div>

        <button type="submit" :disabled="isLoading">
          {{ isLoading ? '儲存中...' : '儲存變更' }}
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
import { reactive, ref, defineProps } from 'vue'; 
import { useCustomerStore } from '@/stores/customer';

// 1. 【新增】定義 Props，接收要編輯的客戶數據
const props = defineProps({
  customer: {
    type: Object,
    required: true
  }
});

// 定義事件
const emit = defineEmits(['close', 'success']);

const customerStore = useCustomerStore();

// 2. 【新增】使用 reactive 包裹 Props 數據，以便在表單中修改
// 使用淺拷貝 (Object.assign) 來避免直接修改 Pinia Store 中的原始對象
const customerEdit = reactive(Object.assign({}, props.customer));

const isLoading = ref(false);
const error = ref(null);

const submitForm = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    // 【TODO】：調用 Pinia Store 中的 updateCustomer action
    await customerStore.updateCustomer(customerEdit.id, customerEdit); 

    emit('success');
    
  } catch (err) {
    if (err.response && err.response.data) {
        error.value = '更新失敗：' + Object.values(err.response.data).flat().join(', ');
    } else {
        error.value = '更新失敗，請檢查網路或伺服器狀態。';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* 樣式與 AddCustomerForm.vue 相同，確保外觀一致 */
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
  background-color: #007bff; /* 變更按鈕顏色區分編輯 */
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