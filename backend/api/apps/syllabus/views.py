from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from api.utils.throttling import CustomAnonRateThrottle, DownloadRateThrottle
from .models import Syllabus
from .serializers import SyllabusSerializer, SyllabusDetailSerializer
from api.apps.question_papers.models import Program, Subject
from api.apps.question_papers.serializers import ProgramSerializer, SubjectSerializer

class SyllabusViewSet(viewsets.ModelViewSet):
    queryset = Syllabus.objects.all()
    serializer_class = SyllabusSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    throttle_classes = [CustomAnonRateThrottle]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['subject__program', 'subject__semester', 'is_current', 'is_active']
    search_fields = ['subject__name', 'subject__code', 'description', 'version']
    ordering_fields = ['upload_date', 'version', 'subject__semester']
    ordering = ['-upload_date']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return SyllabusDetailSerializer
        return SyllabusSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        context['program_id'] = self.request.query_params.get('program_id')
        context['semester'] = self.request.query_params.get('semester')
        return context

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

    @action(detail=False, methods=['get'])
    def programs(self, request):
        """
        Get all available programs
        """
        programs = Program.objects.all()
        serializer = ProgramSerializer(programs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def programs_subjects(self, request, program_id=None):
        """
        Get all subjects with syllabi for a specific program
        """
        program_id = request.query_params.get('program_id')
        if not program_id:
            return Response(
                {'error': 'program_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            program = Program.objects.get(id=program_id)
        except Program.DoesNotExist:
            return Response(
                {'error': 'Program not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        subjects = Subject.objects.filter(
            program=program,
            syllabi__isnull=False
        ).distinct()

        # Group subjects by semester
        semesters = {}
        for subject in subjects:
            if subject.semester not in semesters:
                semesters[subject.semester] = []
            semesters[subject.semester].append(subject)

        # Format response
        response_data = {
            'program': ProgramSerializer(program).data,
            'semesters': [
                {
                    'semester': semester,
                    'subjects': SubjectSerializer(subjects, many=True).data
                }
                for semester, subjects in sorted(semesters.items())
            ]
        }

        return Response(response_data)

    @action(detail=True, methods=['post'])
    def increment_view(self, request, pk=None):
        syllabus = self.get_object()
        syllabus.increment_view_count()
        return Response({'status': 'view counted'})

    @action(detail=True, methods=['post'])
    def increment_download(self, request, pk=None):
        """
        Increment the download count for a syllabus
        """
        syllabus = self.get_object()
        syllabus.increment_download_count()
        return Response({'status': 'download counted'})

    @action(detail=True, methods=['get'], throttle_classes=[DownloadRateThrottle])
    def download(self, request, pk=None):
        syllabus = self.get_object()
        if not syllabus.file:
            return Response(
                {'error': 'No file available'},
                status=status.HTTP_404_NOT_FOUND
            )
        return Response({'url': syllabus.file.url})

    @action(detail=False, methods=['get'])
    def by_subject(self, request):
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

        try:
            subject = Subject.objects.get(id=subject_id)
        except Subject.DoesNotExist:
            return Response(
                {'error': f'Subject with id {subject_id} does not exist'},
                status=status.HTTP_404_NOT_FOUND
            )

        syllabi = self.queryset.filter(subject=subject, is_active=True).order_by('-is_current', '-upload_date')
        if not syllabi.exists():
            return Response(
                {'error': 'No syllabi available for this subject'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(syllabi, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def subjects_by_program_semester(self, request):
        """
        Get all subjects for a specific program and semester
        """
        program_id = request.query_params.get('program_id')
        semester = request.query_params.get('semester')

        if not program_id or not semester:
            return Response(
                {'error': 'program_id and semester are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            subjects = Subject.objects.filter(
                program_id=program_id,
                semester=semester
            ).order_by('name')
            serializer = SubjectSerializer(subjects, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            ) 