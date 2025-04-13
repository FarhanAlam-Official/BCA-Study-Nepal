from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'programs', views.ProgramViewSet)
router.register(r'subjects', views.SubjectViewSet)
router.register(r'papers', views.QuestionPaperViewSet, basename='papers')

# The base path in core/urls.py should include this under 'question-papers/'
urlpatterns = [
    path('', include(router.urls)),
] 