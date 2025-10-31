<template>
  <div class="customer-list-container">
    <div class="header-bar">
      <h1>我的客戶列表</h1>
      <button @click="showAddModal = true" class="add-button">
        + 新增客戶
      </button>
    </div>
    
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
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="customer in customerStore.customers" :key="customer.id">
            <td>{{ customer.name }}</td>
            <td>{{ customer.email }}</td>
            <td>{{ customer.phone }}</td>
            <td>{{ customer.status }}</td>
            <td>{{ new Date(customer.created_at).toLocaleDateString() }}</td>
            <td>
              <button @click="startEdit(customer)" class="action-button edit-button">編輯</button>
              <button @click="confirmDelete(customer.id, customer.name)" class="action-button delete-button">刪除</button>
            </td>
          </tr>
          <tr v-if="customerStore.customers.length === 0">
              <td colspan="6" class="no-data">目前沒有任何客戶數據。</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <AddCustomerForm 
      v-if="showAddModal" 
      @close="showAddModal = false"
      @success="handleCustomerAdded"
    />

    <EditCustomerForm
      v-if="showEditModal && currentEditCustomer"
      :customer="currentEditCustomer"
      @close="showEditModal = false; currentEditCustomer = null"
      @success="handleCustomerEdited"
    />

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCustomerStore } from '@/stores/customer';
import AddCustomerForm from '@/components/AddCustomerForm.vue'; 
// 【新增】匯入編輯組件
import EditCustomerForm from '@/components/EditCustomerForm.vue'; 

const customerStore = useCustomerStore();
const showAddModal = ref(false);

// 【新增】編輯狀態管理
const showEditModal = ref(false);
const currentEditCustomer = ref(null); // 儲存當前要編輯的客戶對象

onMounted(() => {
  customerStore.fetchCustomers();
});

const handleCustomerAdded = () => {
    showAddModal.value = false;
    customerStore.fetchCustomers(); // 重新載入列表
}

// 【新增】處理編輯成功後的邏輯
const handleCustomerEdited = () => {
    showEditModal.value = false;
    currentEditCustomer.value = null;
    // 由於 updateCustomer 在 Store 中實現了本地替換，這裡無需重新 fetch。
    alert('客戶資料已成功更新！');
}

// 【新增】啟動編輯流程
const startEdit = (customer) => {
    currentEditCustomer.value = customer; // 設置要編輯的客戶數據
    showEditModal.value = true;
}

const confirmDelete = async (id, name) => {
    if (confirm(`確定要刪除客戶 "${name}" 嗎？此操作無法恢復。`)) {
        try {
            await customerStore.deleteCustomer(id);
            alert(`客戶 "${name}" 已成功刪除。`);
        } catch (error) {
            alert('刪除失敗：' + (customerStore.error || '請檢查連線。'));
        }
    }
}
</script>

<style scoped>
/* (樣式部分保持不變) */
.customer-list-container {
  max-width: 1000px;
  margin: 30px auto;
  padding: 20px;
}
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.add-button {
  padding: 10px 20px;
  background-color: #42b883; /* Vue 綠 */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}
.add-button:hover {
  background-color: #368261;
}
.action-button {
    padding: 5px 10px;
    margin-right: 5px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 0.85em;
}
.edit-button {
    background-color: #ffc107;
    color: #333;
}
.delete-button {
    background-color: #dc3545;
    color: white;
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