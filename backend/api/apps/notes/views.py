from rest_framework import viewsets, permissions, filters, status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from api.utils.throttling import CustomAnonRateThrottle, DownloadRateThrottle
from api.apps.question_papers.models import Program, Subject
from api.apps.question_papers.serializers import ProgramSerializer
from .models import Note
from .serializers import NoteSerializer

class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    throttle_classes = [CustomAnonRateThrottle]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['semester', 'is_verified', 'subject__program']
    search_fields = ['title', 'subject__name', 'description', 'subject__program__name']
    ordering_fields = ['upload_date', 'title', 'semester']
    ordering = ['-upload_date']

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=True, methods=['get'], throttle_classes=[DownloadRateThrottle])
    def download(self, request, pk=None):
        note = self.get_object()
        return Response({'url': note.file.url})

    @action(detail=False, methods=['get'])
    def programs(self, request):
        """Get all active programs with their notes count"""
        programs = Program.objects.filter(is_active=True).annotate(
            notes_count=Count('subjects__notes', distinct=True)
        ).order_by('name')
        
        serializer = ProgramSerializer(programs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_program(self, request):
        """Get notes for a specific program"""
        program_id = request.query_params.get('program_id')
        semester = request.query_params.get('semester')

        if not program_id:
            return Response(
                {'error': 'program_id is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        queryset = self.get_queryset().filter(subject__program_id=program_id)
        
        if semester:
            try:
                semester = int(semester)
                queryset = queryset.filter(semester=semester)
            except ValueError:
                return Response(
                    {'error': 'semester must be a valid integer'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def subjects_by_program(self, request):
        """Get subjects with notes for a specific program"""
        program_id = request.query_params.get('program_id')
        semester = request.query_params.get('semester')

        if not program_id:
            return Response(
                {'error': 'program_id is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        subjects = Subject.objects.filter(
            program_id=program_id,
            notes__isnull=False
        ).distinct()

        if semester:
            try:
                semester = int(semester)
                subjects = subjects.filter(semester=semester)
            except ValueError:
                return Response(
                    {'error': 'semester must be a valid integer'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Group subjects by semester
        semesters = {}
        for subject in subjects:
            if subject.semester not in semesters:
                semesters[subject.semester] = []
            semesters[subject.semester].append(subject)

        # Format response
        semester_data = [
            {
                'semester': semester,
                'subjects': [
                    {
                        'id': subject.id,
                        'code': subject.code,
                        'name': subject.name,
                        'notes_count': subject.notes.count()
                    }
                    for subject in sorted(subjects, key=lambda x: x.code)
                ]
            }
            for semester, subjects in sorted(semesters.items())
        ]

        return Response(semester_data)

    @action(detail=False, methods=['get'], url_path='by-subject')
    def by_subject(self, request):
        """Get notes for a specific subject"""
        subject_id = request.query_params.get('subject_id')
        
        if not subject_id:
            return Response(
                {'error': 'subject_id is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            subject_id = int(subject_id)
        except ValueError:
            return Response(
                {'error': 'subject_id must be a valid integer'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        notes = self.get_queryset().filter(subject_id=subject_id).order_by('-upload_date')
        serializer = self.get_serializer(notes, many=True)
        return Response(serializer.data) 