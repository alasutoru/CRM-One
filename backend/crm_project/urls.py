# crm_project/urls.py

from django.contrib import admin
from django.urls import path, include 
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # 【修正後的標準寫法】: 使用字串 'customers.urls'
    # Django 會自行找到 customers app 裡的 urls.py 檔案
    path('api/v1/', include('customers.urls')), 

    # 【新增 JWT 身份驗證接口】
    # 登入接口: 獲取 Access 和 Refresh Token
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # 刷新接口: 用 Refresh Token 換取新的 Access Token
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]