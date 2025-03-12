from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views import api_root, health_check
from api.apps.core.views import search
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="BCA Study Nepal API",
        default_version='v1',
        description="API documentation for BCA Study Nepal",
    ),
    public=True,
    permission_classes=[AllowAny],
)

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    return Response({'status': 'ok'})

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    
    # API Documentation
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    # SimpleJWT authentication endpoints
    path('api/users/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/users/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # App-specific routes
    path('api/users/', include('api.apps.users.urls')),
    path('api/subjects/', include('api.apps.subjects.urls')),
    path('api/notes/', include('api.apps.notes.urls')),
    path('api/resources/', include('api.apps.resources.urls')),
    path('api/colleges/', include('api.apps.colleges.urls')),
    
    # Search endpoint
    path('api/search/', search, name='search'),
    
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