from ..models import College

class CollegeService:
    @staticmethod
    def get_colleges_with_ratings():
        return College.objects.all().order_by('-rating')
    
    @staticmethod
    def search_colleges(query):
        return College.objects.filter(
            name__icontains=query
        ) | College.objects.filter(
            location__icontains=query
        )