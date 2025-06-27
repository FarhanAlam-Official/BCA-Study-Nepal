from typing import List
from api.apps.notes.models import Note
from .base_service import BaseService

class NoteService(BaseService[Note]):
    model_class = Note

    @staticmethod
    def get_notes_by_semester(semester: int) -> List[Note]:
        return Note.objects.filter(semester=semester)
    
    @staticmethod
    def get_notes_by_subject(subject: str) -> List[Note]:
        return Note.objects.filter(subject__icontains=subject)
    
    @classmethod
    def get_verified_notes(cls) -> List[Note]:
        """Get all verified notes."""
        return cls.model_class.objects.filter(is_verified=True)
    
    @classmethod
    def increment_download_count(cls, note_id: int) -> None:
        """Increment the download count for a note."""
        note = cls.get_by_id(note_id)
        if note:
            note.download_count = (note.download_count or 0) + 1
            cls.update(note)
    
    @classmethod
    def get_notes_by_user(cls, user_id: int) -> List[Note]:
        """Get all notes uploaded by a specific user."""
        return cls.model_class.objects.filter(uploaded_by_id=user_id)
    
    @classmethod
    def verify_note(cls, note_id: int, verified_by_user_id: int) -> bool:
        """Mark a note as verified."""
        note = cls.get_by_id(note_id)
        if note:
            note.is_verified = True
            note.verified_by_id = verified_by_user_id
            cls.update(note)
            return True
        return False