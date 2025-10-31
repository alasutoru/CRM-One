from django.test import TestCase
from django.contrib.auth import get_user_model
from customers.models import Customer
from django.core.exceptions import ValidationError

# 獲取 Django 的使用者模型 (User Model)，以便在測試中創建負責人
User = get_user_model()

class CustomerModelTest(TestCase):
    """
    測試 Customer Model 的基本功能和約束
    """

    @classmethod
    def setUpTestData(cls):
        """
        在所有測試運行前，設置一次性數據 (例如：一個測試使用者)
        """
        cls.test_user = User.objects.create_user(
            username='testsales',
            email='test@example.com',
            password='testpassword123'
        )

    def test_customer_creation(self):
        """
        測試是否能成功創建一個有效的客戶實例
        """
        customer = Customer.objects.create(
            name='測試客戶名稱',
            phone='0987654321',
            email='testcustomer@company.com',
            sales_rep=self.test_user,
            status='active'
        )
        # 斷言 (Assert)：檢查數據庫中是否確實存在一筆記錄
        self.assertEqual(Customer.objects.count(), 1)
        # 斷言：檢查客戶的名稱是否正確
        self.assertEqual(customer.name, '測試客戶名稱')
        # 斷言：檢查負責人是否正確連結
        self.assertEqual(customer.sales_rep, self.test_user)

    def test_name_max_length(self):
        """
        測試客戶名稱是否遵守 max_length=100 的限制
        """
        # 創建一個長度超過 100 的名稱
        long_name = 'a' * 101
        
        # 嘗試創建這個實例
        customer = Customer(
            name=long_name, 
            sales_rep=self.test_user
        )
        
        # 檢查：如果名稱過長，應該會拋出 ValidationError
        with self.assertRaises(ValidationError):
            customer.full_clean() # full_clean 會執行所有 Model 的驗證