from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.http import FileResponse
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny

User = get_user_model()

class BaseModelViewSet(viewsets.ModelViewSet):
    """
    Base viewset with common functionality for all models
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Filter queryset to only include active records if model has is_active field
        """
        queryset = super().get_queryset()
        if hasattr(self.queryset.model, 'is_active'):
            queryset = queryset.filter(is_active=True)
        return queryset
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """
        Download file associated with the instance
        """
        instance = self.get_object()
        if hasattr(instance, 'file') and instance.file:
            try:
                response = FileResponse(instance.file.open(), as_attachment=True)
                response['Content-Disposition'] = f'attachment; filename="{instance.file.name}"'
                return response
            except Exception as e:
                return Response(
                    {'error': f'File access failed: {str(e)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        return Response(
            {'error': 'No file available for download'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    def perform_create(self, serializer):
        """
        Set uploaded_by to current user during creation
        """
        serializer.save(uploaded_by=self.request.user)
    
    def perform_update(self, serializer):
        """
        Set updated_by to current user during update
        """
        serializer.save(updated_by=self.request.user)

class UserProfileView(APIView):
    """
    Retrieve the authenticated user's profile
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_verified': getattr(user, 'is_verified', False),  # Adjust based on your User model
        }
        return Response(data)

@api_view(['GET'])
def api_root(request):
    """
    API root endpoint showing available endpoints
    """
    return Response({
        'message': 'Welcome to BCA Study Nepal API',
        'endpoints': {
            'users': '/api/users/',
            'profile': '/api/users/profile/',
            'subjects': '/api/subjects/',
            'notes': '/api/notes/',
            'resources': '/api/resources/',
            'admin': '/admin/',
            'token': '/api/users/token/',
            'token_refresh': '/api/users/token/refresh/',
            'health_check': '/health-check/',
        }
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """
    A simple health check endpoint that returns a 200 OK response.
    This endpoint is public and does not require authentication.
    """
    return Response({'status': 'ok'})