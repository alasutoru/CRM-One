# customers/views.py

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Customer
from .serializers import CustomerSerializer

class CustomerViewSet(viewsets.ModelViewSet):
    """
    客戶資源的 API 視圖集，自動提供 CRUD 接口。
    """
    
    # 查詢集：定義這個視圖集處理哪些數據（所有客戶，按創建時間倒序）
    queryset = Customer.objects.all().order_by('-created_at')
    
    # 序列化器：指定使用哪個序列化器來處理數據轉換
    serializer_class = CustomerSerializer
    
    # 【安全性】權限：確保只有登入且經過驗證的使用者才能訪問此 API
    permission_classes = [IsAuthenticated] 

    def perform_create(self, serializer):
        """
        在創建客戶實例時，自動將當前登入的使用者設定為該客戶的負責人 (sales_rep)。
        """
        # 確保在儲存前，將負責人欄位設定為當前請求的使用者
        serializer.save(sales_rep=self.request.user)