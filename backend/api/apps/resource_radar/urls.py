from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'resource_radar'

# Create a router for v1
v1_router = DefaultRouter()
v1_router.register(r'categories', views.CategoryViewSet)
v1_router.register(r'tags', views.TagViewSet)
v1_router.register(r'resources', views.ResourceViewSet)
v1_router.register(r'submissions', views.ResourceSubmissionViewSet)
v1_router.register(r'favorites', views.FavoriteViewSet, basename='favorite')

# URL patterns with versioning
urlpatterns = [
    # v1 endpoints
    path('v1/', include((v1_router.urls, 'v1'), namespace='v1')),
] 