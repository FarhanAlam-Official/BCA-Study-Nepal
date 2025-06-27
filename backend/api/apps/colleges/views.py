from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.db.models import Q
from .models import College, CollegeFavorite
from .serializers import CollegeSerializer, CollegeFavoriteSerializer
import logging
import operator
from functools import reduce
from django.db import connection

logger = logging.getLogger(__name__)

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
            program_list = [p.strip() for p in programs.split(',')]
            logger.debug(f"Filtering by programs: {program_list}")
            
            # Use raw SQL for JSON array containment check
            if connection.vendor == 'sqlite':
                # SQLite approach: Use JSON_EACH to unnest the array and check values
                program_conditions = []
                for program in program_list:
                    program_conditions.append(
                        Q(programs__regex=f'.*"{program}".*')  # Match exact program name in JSON array
                    )
                queryset = queryset.filter(reduce(operator.or_, program_conditions))
            else:
                # PostgreSQL approach: Use native JSON containment
                queryset = queryset.filter(programs__contains=program_list)
            
            logger.debug(f"Filtered queryset count: {queryset.count()}")

        admission_status = self.request.query_params.get('admission_status')
        if admission_status:
            queryset = queryset.filter(admission_status=admission_status)

        rating_min = self.request.query_params.get('rating_min')
        if rating_min:
            queryset = queryset.filter(rating__gte=float(rating_min))

        facilities = self.request.query_params.get('facilities')
        if facilities:
            facility_list = [f.strip() for f in facilities.split(',')]
            logger.debug(f"Filtering by facilities: {facility_list}")
            
            if connection.vendor == 'sqlite':
                # SQLite approach: Use JSON_EACH to unnest the array and check values
                facility_conditions = []
                for facility in facility_list:
                    facility_conditions.append(
                        Q(facilities__regex=f'.*"{facility}".*')  # Match exact facility name in JSON array
                    )
                queryset = queryset.filter(reduce(operator.or_, facility_conditions))
            else:
                # PostgreSQL approach: Use native JSON containment
                queryset = queryset.filter(facilities__contains=facility_list)
            
            logger.debug(f"Filtered queryset count: {queryset.count()}")

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
        
        valid_sort_fields = {
            'name': 'name',
            'rating': 'rating',
            'created_at': 'created_at',
            'views_count': 'views_count',
            'established_year': 'established_year'
        }
        
        if sort_by in valid_sort_fields:
            ordering = f"{'-' if sort_order == 'desc' else ''}{valid_sort_fields[sort_by]}"
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
        college.increment_view_count()
        return Response({"status": "success"}) 