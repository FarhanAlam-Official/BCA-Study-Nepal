from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError
import os

def validate_image_file(value):
    ext = os.path.splitext(value.name)[1]
    valid_extensions = ['.jpg', '.jpeg', '.png', '.gif']
    if not ext.lower() in valid_extensions:
        raise ValidationError('Unsupported file extension. Please use: .jpg, .jpeg, .png, or .gif')
    if value.size > 5 * 1024 * 1024:  # 5MB limit
        raise ValidationError('File size too large. Size should not exceed 5MB.')

def profile_picture_path(instance, filename):
    # Get the file extension
    ext = os.path.splitext(filename)[1]
    # Return the new path
    return f'profile_pictures/{instance.id}/{instance.username}{ext}'

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