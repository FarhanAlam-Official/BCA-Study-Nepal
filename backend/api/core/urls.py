from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views import api_root, health_check
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    return Response({'status': 'ok'})

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    
    # SimpleJWT authentication endpoints
    path('api/users/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/users/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # App-specific routes
    path('api/users/', include('api.apps.users.urls')),
    path('api/subjects/', include('api.apps.subjects.urls')),
    path('api/notes/', include('api.apps.notes.urls')),
    path('api/resources/', include('api.apps.resources.urls')),
    path('api/colleges/', include('api.apps.colleges.urls')),
    
    # Additional Google OAuth callback route (both with and without trailing slash)
    path('api/auth/google/callback', include('api.apps.users.oauth_urls')),
    path('api/auth/google/callback/', include('api.apps.users.oauth_urls')),
    
    # Health check
    path('health-check/', health_check, name='health_check'),
]

# Serve static and media files in debug mode
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)