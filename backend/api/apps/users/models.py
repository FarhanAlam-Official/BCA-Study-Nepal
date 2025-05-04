from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import FileExtensionValidator
from .utils import profile_picture_path, validate_image_file

class User(AbstractUser):
    email = models.EmailField(unique=True)
    is_verified = models.BooleanField(default=False)
    verification_token = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    # Additional fields for user profile
    phone_number = models.CharField(max_length=15, blank=True)
    college = models.CharField(max_length=255, blank=True)
    semester = models.IntegerField(null=True, blank=True)
    program = models.ForeignKey(
        'question_papers.Program',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='students'
    )
    profile_picture = models.ImageField(
        upload_to=profile_picture_path,
        validators=[validate_image_file],
        blank=True,
        null=True,
        help_text='Profile picture (max 5MB, formats: jpg, jpeg, png, gif)'
    )
    
    # Social media links
    facebook_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    
    # Additional meta information
    bio = models.TextField(blank=True)
    interests = models.JSONField(default=list, blank=True)
    skills = models.JSONField(default=list, blank=True)
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        
    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        # If this is a new user (no ID yet), save first to get the ID
        if not self.id and not self.profile_picture:
            super().save(*args, **kwargs)
        # For existing users, just save normally
        super().save(*args, **kwargs) 