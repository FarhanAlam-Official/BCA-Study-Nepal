from django.urls import path, include
from rest_framework.routers import DefaultRouter
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from .views import (
    CollegeViewSet, NoteViewSet,
    EventViewSet, QuestionPaperViewSet
)

schema_view = get_schema_view(
    openapi.Info(
        title="PU Portal API",
        default_version='v1',
        description="API documentation for PU Portal",
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

router = DefaultRouter()
router.register(r'colleges', CollegeViewSet)
router.register(r'notes', NoteViewSet, basename='note')  # Add 'basename' here
router.register(r'events', EventViewSet)
router.register(r'question-papers', QuestionPaperViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0)),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0)),
]