# customers/views.py

from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from .models import Customer
from .serializers import CustomerSerializer

class CustomerViewSet(viewsets.ModelViewSet):
    """
    客戶資源的 API 視圖集，自動提供 CRUD 接口。
    """
    

    
    # 序列化器：指定使用哪個序列化器來處理數據轉換
    serializer_class = CustomerSerializer
    
    # 【安全性】權限：確保只有登入且經過驗證的使用者才能訪問此 API
    permission_classes = [IsAuthenticated] 

    # 【新增 1】：啟用過濾和搜索後端
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    
    # 【新增 2】：設定可搜索的欄位
    # 前端可以使用 ?search=關鍵字 來搜索 name 或 email
    search_fields = ['name', 'email', 'phone'] 
    
    # 【新增 3】：設定可排序的欄位
    # 前端可以使用 ?ordering=-created_at 來排序
    ordering_fields = ['name', 'created_at', 'status'] 
    
    # 【新增 4】：設置默認排序
    ordering = ['-created_at']

# 【新增或修改此函數】：實現數據隔離
    def get_queryset(self):
        # 檢查用戶是否已登入 (IsAuthenticated 已經確保了這一點)
        user = self.request.user
        
        # 允許超級用戶 (is_superuser) 查看所有數據 (方便管理員使用)
        if user.is_superuser:
            return Customer.objects.all().order_by('-created_at')
        
        # 一般業務員：只顯示其 sales_rep (負責人) 是自己的客戶
        return Customer.objects.filter(sales_rep=user).order_by('-created_at')

    def perform_create(self, serializer):
        """
        在創建客戶實例時，自動將當前登入的使用者設定為該客戶的負責人 (sales_rep)。
        """
        # 確保在儲存前，將負責人欄位設定為當前請求的使用者
        serializer.save(sales_rep=self.request.user)