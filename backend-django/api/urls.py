from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MemberViewSet, BookViewSet, LoanViewSet, RegisterView

router = DefaultRouter()
router.register(r'members', MemberViewSet)
router.register(r'books', BookViewSet)
router.register(r'loans', LoanViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
]