from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CollegeViewSet, NoteViewSet, EventViewSet, QuestionPaperViewSet

router = DefaultRouter()
router.register(r'colleges', CollegeViewSet)
router.register(r'notes', NoteViewSet)
router.register(r'events', EventViewSet)
router.register(r'question-papers', QuestionPaperViewSet)

urlpatterns = [
    path('', include(router.urls)),
]