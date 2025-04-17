from django.contrib import admin
from .models import Todo, SubTask, Comment

@admin.register(Todo)
class TodoAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'priority', 'category', 'is_completed', 'created_at')
    list_filter = ('priority', 'is_completed', 'category', 'created_at')
    search_fields = ('title', 'description', 'owner__username')
    readonly_fields = ('created_at', 'last_modified')
    date_hierarchy = 'created_at'

@admin.register(SubTask)
class SubTaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'todo', 'is_completed', 'created_at')
    list_filter = ('is_completed', 'created_at')
    search_fields = ('title', 'todo__title')
    readonly_fields = ('created_at',)

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('content', 'todo', 'user', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('content', 'todo__title', 'user__username')
    readonly_fields = ('created_at', 'user_name') 