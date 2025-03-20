from django.contrib import admin
from .models import College, CollegeFavorite

@admin.register(College)
class CollegeAdmin(admin.ModelAdmin):
    list_display = ('name', 'established_year', 'primary_contact', 'email', 'created_at', 'views_count')
    list_filter = ('established_year', 'created_at', 'admission_status', 'is_featured')
    search_fields = ('name', 'description', 'location', 'primary_contact', 'email')
    readonly_fields = ('created_at', 'updated_at', 'created_by', 'updated_by', 'views_count')
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'established_year', 'admission_status', 'is_featured')
        }),
        ('Contact Information', {
            'fields': ('location', 'primary_contact', 'secondary_contact', 'tertiary_contact', 'email', 'website')
        }),
        ('Media', {
            'fields': (
                ('logo', 'logo_url'),
                ('cover_image', 'cover_image_url'),
                'extracted_favicon'
            )
        }),
        ('Additional Information', {
            'fields': ('programs', 'facilities', 'rating')
        }),
        ('Statistics', {
            'fields': ('views_count',),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at', 'created_by', 'updated_by'),
            'classes': ('collapse',)
        })
    )

@admin.register(CollegeFavorite)
class CollegeFavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'college', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'college__name') 