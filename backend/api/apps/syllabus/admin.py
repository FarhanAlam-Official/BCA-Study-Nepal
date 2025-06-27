from django.contrib import admin
from .models import Syllabus

@admin.register(Syllabus)
class SyllabusAdmin(admin.ModelAdmin):
    list_display = (
        'subject', 'version', 'is_current', 'is_active',
        'uploaded_by', 'upload_date', 'view_count', 'download_count'
    )
    list_filter = (
        'is_current', 'is_active',
        'subject__program', 'subject__semester',
        'upload_date'
    )
    search_fields = (
        'subject__name', 'subject__code',
        'version', 'description'
    )
    readonly_fields = (
        'upload_date', 'last_updated',
        'view_count', 'download_count',
        'uploaded_by'
    )
    ordering = ('-upload_date',)
    exclude = ('uploaded_by',)

    def save_model(self, request, obj, form, change):
        if not change:  # Only set uploaded_by when creating new object
            obj.uploaded_by = request.user
        super().save_model(request, obj, form, change) 