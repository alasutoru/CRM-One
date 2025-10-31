# crm_project/urls.py

from django.contrib import admin
from django.urls import path, include 
# 注意：這裡我們不需要使用 as customer_urls 這種方式匯入整個檔案

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # 【修正後的標準寫法】: 使用字串 'customers.urls'
    # Django 會自行找到 customers app 裡的 urls.py 檔案
    path('api/v1/', include('customers.urls')), 
]