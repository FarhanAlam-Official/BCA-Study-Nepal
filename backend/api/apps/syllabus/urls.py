from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.SyllabusViewSet, basename='syllabus')

# The base path in core/urls.py should include this under 'syllabus/'
urlpatterns = [
    path('', include(router.urls)),
] 