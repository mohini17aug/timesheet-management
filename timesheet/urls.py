from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmployeeViewSet, TimesheetEntryViewSet, ProjectViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'employees', EmployeeViewSet)
router.register(r'timesheets', TimesheetEntryViewSet)
router.register(r'projects', ProjectViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

