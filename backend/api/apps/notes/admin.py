from django.contrib import admin
from .models import Note

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('title', 'subject', 'semester', 'uploaded_by', 'upload_date', 'is_verified')
    list_filter = ('semester', 'is_verified', 'subject__program')
    search_fields = ('title', 'description', 'subject__name', 'uploaded_by__username')
    readonly_fields = ('upload_date',)
    ordering = ('-upload_date',) 