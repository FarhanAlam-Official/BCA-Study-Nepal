from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Program, Subject, QuestionPaper
from .serializers import ProgramSerializer, SubjectSerializer, QuestionPaperSerializer

class ProgramViewSet(viewsets.ModelViewSet):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer

    @action(detail=True, methods=['get'])
    def subjects(self, request, pk=None):
        program = self.get_object()
        subjects = Subject.objects.filter(program=program).order_by('semester')
        
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
                'subjects': SubjectSerializer(subjects, many=True).data
            }
            for semester, subjects in sorted(semesters.items())
        ]
        
        return Response({
            'program': ProgramSerializer(program).data,
            'semesters': semester_data
        })

class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

class QuestionPaperViewSet(viewsets.ModelViewSet):
    queryset = QuestionPaper.objects.all()
    serializer_class = QuestionPaperSerializer

    @action(detail=False, methods=['get'], url_path='by-subject')
    def by_subject(self, request):
        subject_id = request.query_params.get('subject_id')
        year = request.query_params.get('year')
        
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
        
        # Check if subject exists
        if not Subject.objects.filter(id=subject_id).exists():
            return Response(
                {'error': f'Subject with id {subject_id} does not exist'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Build query
        query = {'subject_id': subject_id}
        if year:
            try:
                query['year'] = int(year)
            except ValueError:
                return Response(
                    {'error': 'year must be a valid integer'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        papers = self.queryset.filter(**query).order_by('-year', 'semester')
        serializer = self.get_serializer(papers, many=True)
        return Response(serializer.data) 