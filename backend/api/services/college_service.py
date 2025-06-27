from typing import List
from django.db.models import Q
from api.apps.colleges.models import College
from .base_service import BaseService

class CollegeService(BaseService[College]):
    model_class = College

    @classmethod
    def get_colleges_with_ratings(cls) -> List[College]:
        """Get all colleges ordered by rating."""
        return cls.model_class.objects.all().order_by('-rating')
    
    @classmethod
    def search_colleges(cls, query: str) -> List[College]:
        """Search colleges by name or location."""
        return cls.model_class.objects.filter(
            Q(name__icontains=query) |
            Q(location__icontains=query)
        )
    
    @classmethod
    def get_featured_colleges(cls) -> List[College]:
        """Get featured colleges."""
        return cls.model_class.objects.filter(is_featured=True)
    
    @classmethod
    def get_by_location(cls, location: str) -> List[College]:
        """Get colleges by location."""
        return cls.model_class.objects.filter(location__icontains=location)