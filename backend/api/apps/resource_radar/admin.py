from django.contrib import admin
from .models import Category, Tag, Resource, ResourceSubmission, Favorite

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'order', 'created_at')
    search_fields = ('name', 'description')
    ordering = ('order', 'name')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_at')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'featured', 'priority', 'view_count', 'is_active', 'created_at')
    list_filter = ('category', 'featured', 'is_active', 'is_deleted')
    search_fields = ('title', 'description', 'url')
    filter_horizontal = ('tags',)
    ordering = ('-featured', 'priority', '-created_at')
    readonly_fields = ('view_count',)
    prepopulated_fields = {'slug': ('title',)}
    list_per_page = 20

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('category')

@admin.register(ResourceSubmission)
class ResourceSubmissionAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'submitted_by', 'status', 'created_at')
    list_filter = ('status', 'category')
    search_fields = ('title', 'description', 'submitted_by__username', 'submitter_email')
    readonly_fields = ('submitted_by', 'reviewed_by', 'reviewed_at')
    ordering = ('-created_at',)
    list_per_page = 20

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('category', 'submitted_by', 'reviewed_by')

@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'resource', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'resource__title')
    ordering = ('-created_at',)

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'resource') 