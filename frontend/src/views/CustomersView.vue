<template>
  <div class="customer-list-container">
    <h1>我的客戶列表</h1>
    
    <p v-if="customerStore.isLoading" class="loading-message">
      <i class="spinner"></i> 載入客戶數據中...
    </p>

    <p v-else-if="customerStore.error" class="error-message">
      {{ customerStore.error }}
    </p>

    <div v-else class="customer-table-wrapper">
      <table class="customer-table">
        <thead>
          <tr>
            <th>名稱</th>
            <th>電子郵件</th>
            <th>電話</th>
            <th>狀態</th>
            <th>創建時間</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="customer in customerStore.customers" :key="customer.id">
            <td>{{ customer.name }}</td>
            <td>{{ customer.email }}</td>
            <td>{{ customer.phone }}</td>
            <td>{{ customer.status }}</td>
            <td>{{ new Date(customer.created_at).toLocaleDateString() }}</td>
          </tr>
          <tr v-if="customerStore.customers.length === 0">
              <td colspan="5" class="no-data">目前沒有任何客戶數據。</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useCustomerStore } from '@/stores/customer';

const customerStore = useCustomerStore();

onMounted(() => {
  // 組件載入時，立即調用 action 獲取數據
  customerStore.fetchCustomers();
});
</script>

<style scoped>
.customer-list-container {
  max-width: 1000px;
  margin: 30px auto;
  padding: 20px;
}
.customer-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
.customer-table th, .customer-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}
.customer-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}
.error-message {
  color: red;
  padding: 15px;
  border: 1px solid red;
  background-color: #ffeaea;
}
.no-data {
    text-align: center;
    color: #888;
    font-style: italic;
}
</style>