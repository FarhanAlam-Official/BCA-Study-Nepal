from ..models import Note

class NoteService:
    @staticmethod
    def get_notes_by_semester(semester):
        return Note.objects.filter(semester=semester)
    
    @staticmethod
    def get_notes_by_subject(subject):
        return Note.objects.filter(subject__icontains=subject)