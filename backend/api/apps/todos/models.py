from django.db import models
from django.conf import settings

class Todo(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES)
    due_date = models.DateTimeField(null=True, blank=True)
    category = models.CharField(max_length=100, blank=True)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='owned_todos'
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class SubTask(models.Model):
    todo = models.ForeignKey(
        Todo,
        on_delete=models.CASCADE,
        related_name='subtasks'
    )
    title = models.CharField(max_length=255)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.todo.title} - {self.title}"

class Comment(models.Model):
    todo = models.ForeignKey(
        Todo,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='todo_comments'
    )
    user_name = models.CharField(max_length=150, blank=True)  # Cache the username

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.todo.title} - {self.user.username}"

    def save(self, *args, **kwargs):
        if not self.user_name and self.user:
            self.user_name = self.user.username
        super().save(*args, **kwargs) 