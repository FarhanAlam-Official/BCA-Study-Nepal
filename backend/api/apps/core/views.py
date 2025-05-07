from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.db.models import Q
from api.apps.notes.models import Note
from api.apps.colleges.models import College
from api.apps.question_papers.models import QuestionPaper
from api.apps.syllabus.models import Syllabus
from api.apps.resources.models import Event
from api.apps.resource_radar.models import Resource, Category
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
            Q(subject__name__icontains=query) |
            Q(subject__code__icontains=query) |
            Q(description__icontains=query)
        ).select_related('subject')[:5]
        
        results.extend([{
            'title': note.title,
            'type': 'note',
            'url': f'/notes/subject/{note.subject.id}/{note.subject.name}',
            'description': f"Subject: {note.subject.name}, Semester: {note.semester}"
        } for note in notes])

        # Search Colleges
        colleges = College.objects.filter(
            Q(name__icontains=query) |
            Q(location__icontains=query) |
            Q(description__icontains=query) |
            Q(programs__icontains=query)
        )[:5]
        
        results.extend([{
            'title': college.name,
            'type': 'college',
            'url': f'/colleges/{college.id}',
            'description': f"Location: {college.location}"
        } for college in colleges])

        # Search Question Papers
        papers = QuestionPaper.objects.filter(
            Q(subject__name__icontains=query) |
            Q(subject__code__icontains=query) |
            Q(year__icontains=query)
        ).select_related('subject')[:5]
        
        results.extend([{
            'title': f"{paper.subject.code} - {paper.year}",
            'type': 'question_paper',
            'url': f'/question-papers/{paper.subject.id}/{paper.subject.name}/papers',
            'description': f"Subject: {paper.subject.name}, Year: {paper.year}, Sem: {paper.semester}"
        } for paper in papers])

        # Search Syllabus
        syllabi = Syllabus.objects.filter(
            Q(subject__name__icontains=query) |
            Q(subject__code__icontains=query) |
            Q(description__icontains=query) |
            Q(version__icontains=query)
        ).select_related('subject')[:5]

        results.extend([{
            'title': f"Syllabus: {syllabus.subject.name}",
            'type': 'syllabus',
            'url': f'/syllabus/subject/{syllabus.subject.id}/{syllabus.subject.name}',
            'description': f"Version: {syllabus.version}, Subject: {syllabus.subject.name}"
        } for syllabus in syllabi])

        # Search Learning Resources
        resources = Resource.objects.filter(
            Q(title__icontains=query) |
            Q(description__icontains=query) |
            Q(category__name__icontains=query) |
            Q(tags__name__icontains=query)
        ).select_related('category').distinct()[:5]

        results.extend([{
            'title': resource.title,
            'type': 'resource',
            'url': f'/resource-radar?category={resource.category.slug}',
            'description': f"Category: {resource.category.name}, {resource.description[:100]}..."
        } for resource in resources])

        # Sort results by relevance (featured/priority items first)
        results.sort(key=lambda x: (
            x['type'] == 'college' and College.objects.get(name=x['title']).is_featured,
            x['type'] == 'resource' and Resource.objects.get(title=x['title']).featured
        ), reverse=True)

        return Response(results)
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return Response({"error": str(e)}, status=500) 