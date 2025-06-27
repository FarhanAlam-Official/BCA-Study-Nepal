from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .models import Todo, SubTask, Comment
from .serializers import TodoSerializer, SubTaskSerializer, CommentSerializer
from rest_framework.exceptions import PermissionDenied, NotFound

class TodoViewSet(viewsets.ModelViewSet):
    serializer_class = TodoSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['priority', 'is_completed', 'category']
    search_fields = ['title', 'description']
    ordering_fields = ['due_date', 'priority', 'created_at', 'last_modified']
    ordering = ['-created_at']
    pagination_class = None  # Disable pagination for this viewset

    def get_queryset(self):
        """Get todos owned by the current user."""
        return Todo.objects.filter(
            owner=self.request.user
        ).select_related('owner').prefetch_related('subtasks', 'comments')

    def perform_create(self, serializer):
        """Create a new todo with the current user as owner."""
        print("Received data for todo creation:", self.request.data)
        serializer.save(owner=self.request.user)

    def check_object_permissions(self, request, obj):
        """Check if user has permission to modify the todo."""
        super().check_object_permissions(request, obj)
        if obj.owner != request.user:
            raise PermissionDenied("Only the owner can access this todo.")

    @action(detail=True, methods=['post'])
    def add_subtask(self, request, pk=None):
        """Add a subtask to the todo."""
        todo = self.get_object()
        serializer = SubTaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(todo=todo)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def toggle_subtask(self, request, pk=None):
        """Toggle the completion status of a subtask."""
        todo = self.get_object()
        subtask_id = request.data.get('subtask_id')
        if not subtask_id:
            return Response(
                {'error': 'subtask_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            subtask = todo.subtasks.get(id=subtask_id)
            subtask.is_completed = not subtask.is_completed
            subtask.save()
            return Response(SubTaskSerializer(subtask).data)
        except SubTask.DoesNotExist:
            raise NotFound('Subtask not found')

    @action(detail=True, methods=['post'])
    def add_comment(self, request, pk=None):
        """Add a comment to the todo."""
        todo = self.get_object()
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(todo=todo, user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'], url_path='subtasks/(?P<subtask_id>[^/.]+)')
    def delete_subtask(self, request, pk=None, subtask_id=None):
        """Delete a subtask from the todo."""
        todo = self.get_object()
        try:
            subtask = todo.subtasks.get(id=subtask_id)
            subtask.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except SubTask.DoesNotExist:
            raise NotFound('Subtask not found')

    @action(detail=True, methods=['delete'], url_path='comments/(?P<comment_id>[^/.]+)')
    def delete_comment(self, request, pk=None, comment_id=None):
        """Delete a comment from the todo."""
        todo = self.get_object()
        try:
            comment = todo.comments.get(id=comment_id)
            if comment.user != request.user and todo.owner != request.user:
                raise PermissionDenied('Only the comment author or todo owner can delete comments')
            comment.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Comment.DoesNotExist:
            raise NotFound('Comment not found') 