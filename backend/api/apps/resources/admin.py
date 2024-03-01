from django.contrib import admin
from .models import College, Event

@admin.register(College)
class CollegeAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'institution_type', 'rating', 'is_active', 'is_featured')
    list_filter = ('institution_type', 'is_active', 'is_featured')
    search_fields = ('name', 'location', 'city', 'state')
    readonly_fields = ('created_at', 'updated_at')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('-rating', 'name')

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'date', 'time', 'location', 'registration')
    list_filter = ('type', 'registration', 'date')
    search_fields = ('title', 'description', 'location', 'speaker')
    readonly_fields = ('created_at',)
    ordering = ('date', 'time') 