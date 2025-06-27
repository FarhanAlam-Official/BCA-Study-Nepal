from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'first_name', 'last_name', 'get_college', 'semester', 'is_staff', 'is_active', 'is_verified')
    list_filter = ('is_staff', 'is_active', 'is_verified', 'college', 'semester')
    search_fields = ('email', 'username', 'first_name', 'last_name', 'college')
    ordering = ('email',)
    
    def get_college(self, obj):
        if obj.college:
            return format_html(
                '<div style="min-width: 200px; max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block;">{}</div>',
                obj.college if len(obj.college) <= 30 else f"{obj.college[:30]}..."
            )
        return "-"
    get_college.short_description = "College"
    get_college.admin_order_field = 'college'
    
    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Personal info', {
            'fields': (
                'first_name', 
                'last_name', 
                'phone_number',
                'college',
                'semester',
                'bio',
                'profile_picture'
            )
        }),
        ('Social Links', {
            'fields': (
                'facebook_url',
                'twitter_url',
                'linkedin_url',
                'github_url'
            )
        }),
        ('Skills & Interests', {
            'fields': (
                'skills',
                'interests'
            )
        }),
        ('Permissions', {
            'fields': (
                'is_active',
                'is_staff',
                'is_superuser',
                'is_verified',
                'groups',
                'user_permissions'
            )
        }),
        ('Important dates', {
            'fields': (
                'last_login',
                'date_joined',
                'created_at',
                'updated_at'
            )
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at')
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2'),
        }),
    ) 