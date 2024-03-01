from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'programs', views.ProgramViewSet)
router.register(r'subjects', views.SubjectViewSet)
router.register(r'question-papers', views.QuestionPaperViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 