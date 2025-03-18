from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.db.models import Q
from .models import College, CollegeFavorite
from .serializers import CollegeSerializer, CollegeFavoriteSerializer

class CollegeViewSet(viewsets.ModelViewSet):
    serializer_class = CollegeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'id'

    def get_queryset(self):
        queryset = College.objects.all()
        
        # Apply filters
        search = self.request.query_params.get('search', '')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(location__icontains=search) |
                Q(description__icontains=search)
            )

        location = self.request.query_params.get('location')
        if location:
            queryset = queryset.filter(location=location)

        programs = self.request.query_params.get('programs')
        if programs:
            program_list = programs.split(',')
            queryset = queryset.filter(programs__contains=program_list)

        admission_status = self.request.query_params.get('admission_status')
        if admission_status:
            queryset = queryset.filter(admission_status=admission_status)

        rating_min = self.request.query_params.get('rating_min')
        if rating_min:
            queryset = queryset.filter(rating__gte=float(rating_min))

        facilities = self.request.query_params.get('facilities')
        if facilities:
            facility_list = facilities.split(',')
            queryset = queryset.filter(facilities__contains=facility_list)

        featured = self.request.query_params.get('featured')
        if featured and featured.lower() == 'true':
            queryset = queryset.filter(is_featured=True)

        # Filter by favorites if requested
        favorites = self.request.query_params.get('favorites')
        if favorites and favorites.lower() == 'true' and self.request.user.is_authenticated:
            queryset = queryset.filter(
                favorites__user=self.request.user,
                favorites__is_deleted=False
            )

        # Apply sorting
        sort_by = self.request.query_params.get('sort_by', 'name')
        sort_order = self.request.query_params.get('sort_order', 'asc')
        
        if sort_by in ['name', 'rating', 'created_at', 'views_count']:
            ordering = f"{'-' if sort_order == 'desc' else ''}{sort_by}"
            queryset = queryset.order_by(ordering)

        return queryset.distinct()

    @action(detail=False, methods=['GET'])
    def locations(self, request):
        locations = College.objects.values_list('location', flat=True).distinct()
        return Response(list(locations))

    @action(detail=False, methods=['GET'])
    def programs(self, request):
        programs = set()
        for college_programs in College.objects.values_list('programs', flat=True):
            programs.update(college_programs)
        return Response(list(programs))

    @action(detail=False, methods=['GET'])
    def facilities(self, request):
        facilities = set()
        for college_facilities in College.objects.values_list('facilities', flat=True):
            facilities.update(college_facilities)
        return Response(list(facilities))

    @action(detail=False, methods=['GET'])
    def favorites(self, request):
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
        
        favorites = CollegeFavorite.objects.filter(
            user=request.user,
            is_deleted=False
        )
        serializer = CollegeFavoriteSerializer(favorites, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['POST'])
    def toggle_favorite(self, request, id=None):
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
        
        college = self.get_object()
        
        # Check for any existing favorite (including deleted ones)
        favorite = CollegeFavorite.objects.filter(
            college=college,
            user=request.user
        ).first()

        if favorite:
            if favorite.is_deleted:
                # If it was previously deleted, reactivate it
                favorite.is_deleted = False
                favorite.save()
                return Response({"status": "college favorited"})
            else:
                # If active, soft delete it
                favorite.is_deleted = True
                favorite.save()
                return Response({"status": "college unfavorited"})
        else:
            # Create new favorite
            CollegeFavorite.objects.create(user=request.user, college=college)
            return Response({"status": "college favorited"})

    @action(detail=True, methods=['POST'])
    def increment_view(self, request, id=None):
        college = self.get_object()
        college.views_count += 1
        college.save()
        return Response({"status": "success"}) 