from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import College, Note, Event, QuestionPaper
from .serializers import (
    CollegeSerializer, NoteSerializer, EventSerializer,
    QuestionPaperSerializer, UserSerializer
)
from .throttling import DownloadRateThrottle, CustomAnonRateThrottle
from rest_framework.permissions import AllowAny

class CollegeViewSet(viewsets.ModelViewSet):
    queryset = College.objects.all()
    serializer_class = CollegeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    throttle_classes = [CustomAnonRateThrottle]

class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    throttle_classes = [CustomAnonRateThrottle]

    def get_queryset(self):
        queryset = Note.objects.all()

        # Filter by semester if provided in query params
        semester = self.request.query_params.get('semester', None)
        if semester is not None:
            queryset = queryset.filter(semester=semester)

        # Filter by verification status if provided
        is_verified = self.request.query_params.get('is_verified', None)
        if is_verified is not None:
            queryset = queryset.filter(is_verified=is_verified.lower() == 'true')

        return queryset

    def perform_create(self, serializer):
        # Ensure that the uploaded note is associated with the current user
        serializer.save(uploaded_by=self.request.user)

    @action(detail=True, methods=['get'], throttle_classes=[DownloadRateThrottle])
    def download(self, request, pk=None):
        # Download action for the note
        note = self.get_object()
        return Response({'file_url': note.file.url})

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    throttle_classes = [CustomAnonRateThrottle]

    @action(detail=True, methods=['post'])
    def register(self, request, pk=None):
        event = self.get_object()
        # Add registration logic here
        return Response({'status': 'registered for event'})

class QuestionPaperViewSet(viewsets.ModelViewSet):
    queryset = QuestionPaper.objects.all()
    serializer_class = QuestionPaperSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    throttle_classes = [CustomAnonRateThrottle]

    @action(detail=True, methods=['get'], throttle_classes=[DownloadRateThrottle])
    def download(self, request, pk=None):
        paper = self.get_object()
        return Response({'file_url': paper.file.url})

@api_view(['GET'])
@permission_classes([AllowAny])
def search(request):
    query = request.GET.get('q', '')
    print(f"Searching for: {query}")
    
    if len(query) < 2:
        return Response([])

    results = []
    
    try:
        # Search Notes
        notes = Note.objects.filter(
            Q(title__icontains=query) |
            Q(subject__icontains=query)
        )[:5]
        
        print(f"Found notes: {notes}")
        
        results.extend([{
            'title': note.title,
            'type': 'note',
            'url': f'/notes/{note.id}',
            'description': f"Subject: {note.subject}, Semester: {note.semester}"
        } for note in notes])

        # Search Colleges
        colleges = College.objects.filter(
            Q(name__icontains=query) |
            Q(location__icontains=query) |
            Q(affiliation__icontains=query)
        )[:5]
        
        print(f"Found colleges: {colleges}")
        
        results.extend([{
            'title': college.name,
            'type': 'college',
            'url': f'/colleges/{college.id}',
            'description': f"Location: {college.location}, Affiliation: {college.affiliation}"
        } for college in colleges])

        return Response(results)
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return Response({"error": str(e)}, status=500)
