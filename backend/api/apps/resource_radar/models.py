from django.db import models
from django.contrib.auth import get_user_model
from django.db.models.signals import pre_save
from django.dispatch import receiver
import uuid
from .utils import extract_favicon

User = get_user_model()

class BaseModel(models.Model):
    """Base model with common fields"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)

    class Meta:
        abstract = True

class Category(BaseModel):
    """Model for resource categories"""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    icon = models.CharField(max_length=50, blank=True)  # Store icon name/class
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['order', 'name']

    def __str__(self):
        return self.name

class Tag(BaseModel):
    """Model for resource tags"""
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, unique=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

class Resource(BaseModel):
    """Model for learning resources"""
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    description = models.TextField(max_length=500)  # Limit description to 500 characters
    url = models.URLField()
    _favicon_url = models.URLField(blank=True, null=True, db_column='favicon_url')  # Internal storage for favicon
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='resources')
    tags = models.ManyToManyField(Tag, related_name='resources', blank=True)
    featured = models.BooleanField(default=False)
    priority = models.IntegerField(default=0)
    view_count = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-featured', 'priority', '-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['featured', 'priority']),
        ]

    def __str__(self):
        return self.title

    @property
    def icon_url(self):
        """
        Get the favicon URL if it exists, otherwise return None.
        This property maintains compatibility with existing code.
        """
        return self._favicon_url if self._favicon_url else None

    def save(self, *args, **kwargs):
        # Truncate description if it exceeds max length
        if len(self.description) > 500:
            self.description = self.description[:497] + "..."
        
        # Extract favicon if not already set
        if not self._favicon_url and self.url:
            self._favicon_url = extract_favicon(self.url)
            
        super().save(*args, **kwargs)

class ResourceSubmission(BaseModel):
    """Model for user-submitted resources pending review"""
    STATUS_CHOICES = [
        ('PENDING', 'Pending Review'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    url = models.URLField()
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='submissions')
    submitted_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='resource_submissions'
    )
    submitter_email = models.EmailField(blank=True)  # For non-authenticated submissions
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    review_notes = models.TextField(blank=True)
    reviewed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='reviewed_submissions'
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"{self.title} ({self.get_status_display()})"

class Favorite(BaseModel):
    """Model for user favorites/bookmarks"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resource_favorites')
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name='favorites')

    class Meta:
        unique_together = ['user', 'resource']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.resource.title}" 