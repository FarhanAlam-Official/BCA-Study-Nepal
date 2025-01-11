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
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.contrib.auth.models import User

class CollegeViewSet(viewsets.ModelViewSet):
    queryset = College.objects.filter(is_active=True)
    serializer_class = CollegeSerializer
    permission_classes=[AllowAny]
    lookup_field = 'slug'  # Change from id to slug
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    filterset_fields = {
        'rating': ['gte', 'lte'],
        'institution_type': ['exact'],
        'city': ['exact'],
        'state': ['exact'],
        'is_featured': ['exact'],
        'affiliation': ['exact'],
    }
    
    search_fields = ['name', 'description', 'courses_offered']
    ordering_fields = ['rating', 'name', 'established_year']

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
    permission_classes = [permissions.AllowAny]
    parser_classes = (MultiPartParser, FormParser)

    def create(self, request, *args, **kwargs):
        try:
            print("Files:", request.FILES)  # Debug print
            print("Data:", request.data)    # Debug print
            return super().create(request, *args, **kwargs)
        except Exception as e:
            print("Error:", str(e))  # Debug print
            raise

    def perform_create(self, serializer):
        try:
            # Get or create a test user (for development only)
            user, created = User.objects.get_or_create(
                username='testuser',
                defaults={'email': 'test@example.com'}
            )
            if created:
                user.set_password('testpass123')
                user.save()

            file_obj = self.request.FILES.get('file')
            if file_obj:
                instance = serializer.save(
                    uploaded_by=user,  # Use the test user
                    status='PENDING'
                )
                instance.upload_file(file_obj)
                instance.save()
            else:
                serializer.save(
                    uploaded_by=user,  # Use the test user
                    status='PENDING'
                )
        except Exception as e:
            print("Error in perform_create:", str(e))
            raise

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        paper = self.get_object()
        paper.increment_download_count()
        return Response({
            'file_url': paper.file_url,
            'filename': f"{paper.subject.code}_{paper.year}_SEM{paper.semester}.pdf"
        })

    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        if not request.user.is_staff:
            return Response(
                {'error': 'Only staff can verify papers'}, 
                status=403
            )
            
        paper = self.get_object()
        paper.status = 'VERIFIED'
        paper.verified_by = request.user
        paper.verified_date = timezone.now()
        paper.save()
        
        return Response({'status': 'verified'})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        if not request.user.is_staff:
            return Response(
                {'error': 'Only staff can reject papers'}, 
                status=403
            )
            
        paper = self.get_object()
        paper.status = 'REJECTED'
        paper.verified_by = request.user
        paper.verified_date = timezone.now()
        paper.save()
        
        return Response({'status': 'rejected'})

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

        # Search Question Papers
        papers = QuestionPaper.objects.filter(
            Q(subject__name__icontains=query) |
            Q(subject__code__icontains=query) |
            Q(notes__icontains=query)
        ).select_related('subject')[:5]
        
        results.extend([{
            'title': f"{paper.subject.code} - {paper.year}",
            'type': 'question_paper',
            'url': f'/question-papers/{paper.id}',
            'description': f"Subject: {paper.subject.name}, Year: {paper.year}, Sem: {paper.semester}"
        } for paper in papers])

        return Response(results)
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return Response({"error": str(e)}, status=500)
