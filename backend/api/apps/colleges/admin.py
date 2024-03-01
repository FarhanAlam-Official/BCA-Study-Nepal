from django.contrib import admin
from .models import College

@admin.register(College)
class CollegeAdmin(admin.ModelAdmin):
    list_display = ('name', 'established_year', 'phone', 'email', 'created_at')
    list_filter = ('established_year', 'created_at')
    search_fields = ('name', 'address', 'description')
    readonly_fields = ('created_at', 'updated_at', 'created_by', 'updated_by') 