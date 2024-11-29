from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import College, Note, Event, QuestionPaper
from .serializers import (
    CollegeSerializer, NoteSerializer, EventSerializer,
    QuestionPaperSerializer, UserSerializer
)

class CollegeViewSet(viewsets.ModelViewSet):
    queryset = College.objects.all()
    serializer_class = CollegeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=['post'])
    def rate_college(self, request, pk=None):
        college = self.get_object()
        # Add rating logic here
        return Response({'status': 'rating updated'})

class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

    @action(detail=False, methods=['get'])
    def by_semester(self, request):
        semester = request.query_params.get('semester', None)
        notes = self.queryset.filter(semester=semester) if semester else self.queryset
        serializer = self.get_serializer(notes, many=True)
        return Response(serializer.data)

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=['post'])
    def register(self, request, pk=None):
        event = self.get_object()
        # Add registration logic here
        return Response({'status': 'registered for event'})

class QuestionPaperViewSet(viewsets.ModelViewSet):
    queryset = QuestionPaper.objects.all()
    serializer_class = QuestionPaperSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=False, methods=['get'])
    def by_year(self, request):
        year = request.query_params.get('year', None)
        papers = self.queryset.filter(year=year) if year else self.queryset
        serializer = self.get_serializer(papers, many=True)
        return Response(serializer.data)