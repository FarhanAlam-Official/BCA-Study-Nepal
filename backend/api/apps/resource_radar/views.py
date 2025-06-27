from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q, F
from django.utils import timezone
from django.utils.text import slugify
from django_filters import rest_framework as django_filters
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import Category, Tag, Resource, ResourceSubmission, Favorite
from .serializers import (
    CategorySerializer, TagSerializer, ResourceSerializer,
    ResourceSubmissionSerializer, FavoriteSerializer
)

class IsAdminOrReadOnly(permissions.BasePermission):
    """Custom permission to only allow admin users to edit"""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoints for managing resource categories.
    
    list:
    Return a list of all categories with their resource counts.
    
    create:
    Create a new category (admin only).
    
    retrieve:
    Return the details of a specific category.
    
    update:
    Update all fields of a specific category (admin only).
    
    partial_update:
    Update specific fields of a category (admin only).
    
    destroy:
    Delete a specific category (admin only).
    """
    queryset = Category.objects.annotate(
        resource_count=Count('resources', filter=Q(resources__is_deleted=False))
    )
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'order', 'resource_count']
    ordering = ['order', 'name']

    def perform_create(self, serializer):
        """Auto-generate slug on creation"""
        serializer.save(slug=slugify(serializer.validated_data['name']))

class TagViewSet(viewsets.ModelViewSet):
    """
    API endpoints for managing resource tags.
    
    list:
    Return a list of all tags.
    
    create:
    Create a new tag (admin only).
    
    retrieve:
    Return the details of a specific tag.
    
    update:
    Update all fields of a specific tag (admin only).
    
    partial_update:
    Update specific fields of a tag (admin only).
    
    destroy:
    Delete a specific tag (admin only).
    """
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

    def perform_create(self, serializer):
        """Auto-generate slug on creation"""
        serializer.save(slug=slugify(serializer.validated_data['name']))

class ResourceFilter(django_filters.FilterSet):
    """Filter set for resources"""
    category = django_filters.CharFilter(field_name='category__slug')
    tag = django_filters.CharFilter(field_name='tags__slug')
    featured = django_filters.BooleanFilter()
    created_after = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    search = django_filters.CharFilter(method='search_resources')
    
    class Meta:
        model = Resource
        fields = ['category', 'tag', 'featured']

    def search_resources(self, queryset, name, value):
        """Custom search method for resources"""
        if not value:
            return queryset

        # Clean and normalize the search value
        search_value = value.strip().lower()
        if not search_value:
            return queryset

        # Create a complex Q object for searching
        query = Q()
        
        # Search in title with different matching patterns
        query |= Q(title__iexact=search_value)  # Exact match (case-insensitive)
        query |= Q(title__icontains=search_value)  # Contains match
        query |= Q(title__istartswith=search_value)  # Starts with match
        
        # Search in description
        query |= Q(description__icontains=search_value)
        
        # Search in category name
        query |= Q(category__name__icontains=search_value)
        
        # Search in tags
        query |= Q(tags__name__icontains=search_value)

        # If the search term has spaces, also search for individual words
        if ' ' in search_value:
            words = search_value.split()
            word_query = Q()
            for word in words:
                word_query |= Q(title__icontains=word)
                word_query |= Q(description__icontains=word)
                word_query |= Q(category__name__icontains=word)
                word_query |= Q(tags__name__icontains=word)
            query |= word_query

        return queryset.filter(query).distinct()

class ResourceViewSet(viewsets.ModelViewSet):
    """
    API endpoints for managing learning resources.
    
    list:
    Return a paginated list of all active resources.
    Query Parameters:
    - category: Filter by category slug
    - tag: Filter by tag slug
    - featured: Filter featured resources (true/false)
    - search: Search in title, description, and tags
    - ordering: Order by created_at, title, favorite_count, or view_count
    
    create:
    Create a new resource (admin only).
    
    retrieve:
    Return the details of a specific resource.
    
    update:
    Update all fields of a specific resource (admin only).
    
    partial_update:
    Update specific fields of a resource (admin only).
    
    destroy:
    Soft delete a specific resource (admin only).
    """
    queryset = Resource.objects.filter(is_deleted=False).annotate(
        favorite_count=Count('favorites', filter=Q(favorites__is_deleted=False))
    )
    serializer_class = ResourceSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [
        django_filters.DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    filterset_class = ResourceFilter
    search_fields = ['title', 'description', 'tags__name']
    ordering_fields = ['created_at', 'title', 'favorite_count', 'view_count']
    ordering = ['-featured', 'priority', '-created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action == 'list':
            queryset = queryset.select_related('category').prefetch_related('tags')
        return queryset

    def perform_create(self, serializer):
        """Auto-generate slug on creation"""
        serializer.save(slug=slugify(serializer.validated_data['title']))

    @swagger_auto_schema(
        operation_description="Increment the view count for a resource",
        responses={200: openapi.Response('View count incremented successfully')}
    )
    @action(detail=True, methods=['post'])
    def increment_view(self, request, pk=None):
        """Increment the view count for a resource"""
        resource = self.get_object()
        resource.view_count = F('view_count') + 1
        resource.save(update_fields=['view_count'])
        return Response({'status': 'view count incremented'})

    @swagger_auto_schema(
        operation_description="Toggle favorite status for a resource",
        responses={
            200: openapi.Response(
                'Favorite status toggled successfully',
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'status': openapi.Schema(type=openapi.TYPE_STRING)
                    }
                )
            )
        }
    )
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def toggle_favorite(self, request, pk=None):
        """Toggle favorite status for a resource"""
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=401)

        resource = self.get_object()
        
        # Check for any existing favorite (including deleted ones)
        favorite = Favorite.objects.filter(
            user=request.user,
            resource=resource
        ).first()

        if favorite:
            if favorite.is_deleted:
                # If it was previously deleted, reactivate it
                favorite.is_deleted = False
                favorite.save()
                return Response({'status': 'resource favorited'})
            else:
                # If active, soft delete it
                favorite.is_deleted = True
                favorite.save()
                return Response({'status': 'resource unfavorited'})
        else:
            # Create new favorite
            Favorite.objects.create(user=request.user, resource=resource)
            return Response({'status': 'resource favorited'})

    def perform_destroy(self, instance):
        """Soft delete instead of hard delete"""
        instance.is_deleted = True
        instance.save()

class ResourceSubmissionViewSet(viewsets.ModelViewSet):
    """
    API endpoints for managing resource submissions.
    
    list:
    Return a list of resource submissions (admin sees all, users see their own).
    
    create:
    Submit a new resource for review (authenticated users only).
    
    retrieve:
    Return the details of a specific submission.
    
    update:
    Update a submission (admin only).
    
    partial_update:
    Update specific fields of a submission (admin only).
    
    destroy:
    Delete a submission (admin only).
    """
    queryset = ResourceSubmission.objects.all()
    serializer_class = ResourceSubmissionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [django_filters.DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status']
    ordering = ['-created_at']

    def get_queryset(self):
        if self.request.user.is_staff:
            return self.queryset.select_related('category', 'submitted_by', 'reviewed_by')
        return self.queryset.filter(submitted_by=self.request.user).select_related('category')

    @swagger_auto_schema(
        operation_description="Review a resource submission",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['status'],
            properties={
                'status': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    enum=['APPROVED', 'REJECTED']
                ),
                'review_notes': openapi.Schema(type=openapi.TYPE_STRING)
            }
        ),
        responses={
            200: openapi.Response('Submission reviewed successfully'),
            400: openapi.Response('Invalid status')
        }
    )
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def review(self, request, pk=None):
        """Review a resource submission"""
        submission = self.get_object()
        status = request.data.get('status')
        review_notes = request.data.get('review_notes', '')

        if status not in ['APPROVED', 'REJECTED']:
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )

        submission.status = status
        submission.review_notes = review_notes
        submission.reviewed_by = request.user
        submission.reviewed_at = timezone.now()
        submission.save()

        if status == 'APPROVED':
            # Create a new resource from the submission
            Resource.objects.create(
                title=submission.title,
                description=submission.description,
                url=submission.url,
                category=submission.category,
                slug=slugify(submission.title)
            )

        return Response({'status': 'submission reviewed'})

class FavoriteViewSet(viewsets.ModelViewSet):
    """
    API endpoints for managing user favorites.
    
    list:
    Return a list of the authenticated user's favorited resources.
    
    create:
    Add a resource to user's favorites.
    
    retrieve:
    Return the details of a specific favorite.
    
    destroy:
    Remove a resource from user's favorites (soft delete).
    """
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'delete']  # Only allow these methods

    def get_queryset(self):
        return Favorite.objects.filter(
            user=self.request.user,
            is_deleted=False
        ).select_related('resource', 'resource__category')

    def perform_destroy(self, instance):
        """Soft delete instead of hard delete"""
        instance.is_deleted = True
        instance.save() 