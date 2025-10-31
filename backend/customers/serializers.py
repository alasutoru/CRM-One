# customers/serializers.py

from rest_framework import serializers
from .models import Customer

class CustomerSerializer(serializers.ModelSerializer):
    """
    序列化器：用於將 Customer Model 數據轉換為 JSON 格式，反之亦然。
    """
    # 這裡可以自定義欄位的顯示方式，但 ModelSerializer 會自動處理大部分欄位。
    
    class Meta:
        model = Customer
        # fields 中列出所有要通過 API 讀取和寫入的欄位。
        fields = [
            'id', 
            'name', 
            'phone', 
            'email', 
            'sales_rep', 
            'status',
            'created_at',
            'updated_at'
        ]
        # 設定只讀欄位，確保用戶不能通過 API 更改 ID 或時間戳記
        read_only_fields = ['id', 'created_at', 'updated_at'] 
        
        # 額外約束：確保 sales_rep 不會意外地在創建時被外部傳入
        extra_kwargs = {
            'sales_rep': {'required': False} 
        }