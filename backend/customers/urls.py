# customers/urls.py

from rest_framework.routers import DefaultRouter
from .views import CustomerViewSet # <--- 注意這裡：匯入了 views.py

router = DefaultRouter()
router.register(r'customers', CustomerViewSet, basename='customer')
urlpatterns = router.urls # <--- 這裡定義了 urlpatterns