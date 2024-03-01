from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Note
from .serializers import NoteSerializer

class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['semester', 'is_verified']
    search_fields = ['title', 'subject__name', 'description']
    ordering_fields = ['upload_date', 'title', 'semester']
    ordering = ['-upload_date']

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context 