from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.db.models import Q
from api.apps.notes.models import Note
from api.apps.colleges.models import College
from api.apps.question_papers.models import QuestionPaper
from rest_framework.reverse import reverse

@api_view(['GET'])
def api_root(request, format=None):
    """
    API root endpoint showing available endpoints
    """
    return Response({
        'users': reverse('user-list', request=request, format=format),
        'question_papers': reverse('question-papers-list', request=request, format=format),
        'notes': reverse('note-list', request=request, format=format),
        'subjects': reverse('subject-list', request=request, format=format),
        'resources': reverse('resource-list', request=request, format=format),
        'admin': reverse('admin:index', request=request, format=format)
    })

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