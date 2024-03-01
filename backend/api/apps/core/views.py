from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def api_root(request):
    """
    API root endpoint showing available endpoints
    """
    return Response({
        'message': 'Welcome to BCA Study Nepal API',
        'endpoints': {
            'users': '/api/users/',
            'subjects': '/api/subjects/',
            'notes': '/api/notes/',
            'resources': '/api/resources/',
            'admin': '/admin/'
        }
    }) 