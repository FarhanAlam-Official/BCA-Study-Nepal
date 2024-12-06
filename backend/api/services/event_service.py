from django.utils import timezone
from ..models import Event

class EventService:
    @staticmethod
    def get_upcoming_events():
        return Event.objects.filter(
            date__gte=timezone.now()
        ).order_by('date')
    
    @staticmethod
    def get_events_by_type(event_type):
        return Event.objects.filter(type=event_type)