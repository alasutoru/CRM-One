from django.db import models
from django.conf import settings # 用於引用 Django 的使用者模型

class Customer(models.Model):
    """
    客戶實體模型 (CRM 系統的核心數據)
    """
    
    # 基礎資訊
    name = models.CharField(max_length=100, verbose_name="客戶名稱")
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="聯絡電話")
    email = models.EmailField(blank=True, null=True, verbose_name="電子郵件", unique=True) # 確保 Email 唯一性
    
    # 關係：負責人（將客戶與系統使用者連結）
    sales_rep = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL, # 負責人被刪除時，客戶資料保留，此欄位設為 NULL
        null=True,
        verbose_name="負責業務員",
        help_text="負責跟進此客戶的系統使用者"
    )
    
    # 客戶狀態和來源
    STATUS_CHOICES = (
        ('lead', '潛在客戶'),
        ('active', '活躍客戶'),
        ('inactive', '非活躍客戶'),
        ('archived', '已歸檔'),
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='lead', verbose_name="客戶狀態")
    
    # 時間戳記 (重要審計追蹤)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="創建時間")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="最後更新")

    class Meta:
        verbose_name = "客戶"
        verbose_name_plural = "客戶"
        ordering = ['name'] # 默認按名稱排序

    def __str__(self):
        return self.name