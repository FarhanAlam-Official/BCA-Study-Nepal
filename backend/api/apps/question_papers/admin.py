from django.contrib import admin
from .models import Program, Subject, QuestionPaper

@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'duration_years', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'program', 'semester', 'credit_hours', 'is_active')
    list_filter = ('program', 'semester', 'is_active')
    search_fields = ('code', 'name', 'program__name')
    ordering = ('program', 'semester', 'code')

@admin.register(QuestionPaper)
class QuestionPaperAdmin(admin.ModelAdmin):
    list_display = ('subject', 'year', 'semester', 'status', 'uploaded_by', 'created_at')
    list_filter = ('status', 'semester', 'year', 'subject__program')
    search_fields = ('subject__code', 'subject__name', 'uploaded_by__username')
    readonly_fields = ('view_count', 'download_count', 'created_at', 'updated_at', 'verified_date')
    ordering = ('-year', 'semester', 'subject') 