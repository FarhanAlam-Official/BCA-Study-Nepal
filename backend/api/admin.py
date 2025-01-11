from django.contrib import admin
from .models import College, Note, Event, QuestionPaper

@admin.register(College)
class CollegeAdmin(admin.ModelAdmin):
    list_display = ['name', 'location', 'affiliation', 'rating', 'is_featured']
    list_filter = ['is_active', 'is_featured', 'institution_type', 'city', 'state']
    search_fields = ['name', 'description', 'location']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('title', 'subject', 'semester', 'uploaded_by', 'upload_date')
    list_filter = ('semester', 'subject', 'upload_date')
    search_fields = ('title', 'subject')
    date_hierarchy = 'upload_date'
    
    def save_model(self, request, obj, form, change):
        if not change:  # If creating new note
            obj.uploaded_by = request.user
        super().save_model(request, obj, form, change)

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'type', 'location', 'registration')
    list_filter = ('type', 'date', 'registration')
    search_fields = ('title', 'description')
    date_hierarchy = 'date'

@admin.register(QuestionPaper)
class QuestionPaperAdmin(admin.ModelAdmin):
    list_display = ['subject', 'year', 'semester', 'created_at', 'status']
    list_filter = ['year', 'semester', 'status']
    search_fields = ['subject__name', 'subject__code']
    date_hierarchy = 'created_at'
    readonly_fields = ['drive_file_id', 'drive_file_url', 'created_at', 'updated_at']