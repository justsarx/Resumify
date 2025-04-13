from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ResumeViewSet, JobPostViewSet, RegisterView, LoginView

router = DefaultRouter()
router.register(r'resumes', ResumeViewSet)
router.register(r'jobs', JobPostViewSet, basename='jobpost')  # Added basename

urlpatterns = [
    path('api/', include(router.urls)),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    # Add direct job routes for frontend compatibility
    path('jobs/', JobPostViewSet.as_view({
        'get': 'list',
        'post': 'create'
    }), name='jobs-list'),
    path('jobs/<int:pk>/', JobPostViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy'
    }), name='jobs-detail'),
]
