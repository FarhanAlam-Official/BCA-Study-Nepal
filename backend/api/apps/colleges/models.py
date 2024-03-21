from django.db import models
from django.conf import settings
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
from urllib.parse import urlparse
import json
from django.utils import timezone
from .utils import extract_college_favicon
import logging

logger = logging.getLogger(__name__)

def default_list():
    """
    Default function for JSONField to initialize an empty list.
    Used by programs and facilities fields.
    """
    return list()

def validate_json_list(value):
    """
    Validates that a value is a list for JSONField validation.
    Used by programs and facilities fields to ensure they contain valid lists.
    
    Args:
        value: The value to validate, should be a list
        
    Raises:
        ValidationError: If the value is not a list
        
    Returns:
        list: The validated list value
    """
    if not isinstance(value, list):
        raise ValidationError('Value must be a list')
    return value

class College(models.Model):
    ADMISSION_STATUS_CHOICES = [
        ('OPEN', 'Open'),
        ('CLOSED', 'Closed'),
        ('COMING_SOON', 'Coming Soon'),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=255, default='Nepal')
    website = models.URLField()
    email = models.EmailField()
    
    # Contact fields
    primary_contact = models.CharField(max_length=20, blank=True, null=True)
    secondary_contact = models.CharField(max_length=20, blank=True, null=True)
    tertiary_contact = models.CharField(max_length=20, blank=True, null=True)
    
    established_year = models.IntegerField(null=True, blank=True)
    programs = models.JSONField(default=list)
    facilities = models.JSONField(default=list)
    is_featured = models.BooleanField(default=False)
    rating = models.FloatField(default=0.0)
    views_count = models.IntegerField(default=0)
    admission_status = models.CharField(
        max_length=20,
        choices=[
            ('OPEN', 'Open'),
            ('CLOSED', 'Closed'),
            ('COMING_SOON', 'Coming Soon')
        ],
        default='OPEN'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Logo handling - supports both file upload and URL
    logo = models.ImageField(upload_to='college_logos/', blank=True, null=True)
    logo_url = models.URLField(blank=True, default='')  # For external logos/favicons
    extracted_favicon = models.URLField(blank=True, default='')  # For automatically extracted favicons
    
    # Cover image for background
    cover_image = models.ImageField(upload_to='college_covers/', blank=True, null=True)
    cover_image_url = models.URLField(blank=True, default='')  # For external cover images
    
    # Additional fields for filtering and features
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0.0
    )
    views_count = models.IntegerField(default=0)
    
    # Timestamps and user tracking
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_colleges'
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='updated_colleges'
    )

    def __str__(self):
        return self.name

    def clean(self):
        """Validate the model data"""
        super().clean()
        # Ensure programs is a valid list
        if self.programs and not isinstance(self.programs, list):
            raise ValidationError({'programs': 'Programs must be a valid list'})
        # Ensure facilities is a valid list
        if self.facilities and not isinstance(self.facilities, list):
            raise ValidationError({'facilities': 'Facilities must be a valid list'})

    def save(self, *args, **kwargs):
        # Ensure programs and facilities are lists
        if self.programs is None:
            self.programs = []
        if self.facilities is None:
            self.facilities = []
        
        # Extract favicon from website URL if available and no other logo sources exist
        if self.website and not (self.logo or self.logo_url or self.extracted_favicon):
            try:
                favicon_url = extract_college_favicon(self.website)
                if favicon_url:
                    self.extracted_favicon = favicon_url
                    logger.info(f"Successfully extracted favicon for college: {self.name}")
                else:
                    logger.warning(f"No favicon found for college: {self.name}")
            except Exception as e:
                logger.error(f"Failed to extract favicon for college {self.name}: {str(e)}")
                
        super().save(*args, **kwargs)

    @property
    def display_logo(self):
        """Return the most appropriate logo URL in order of preference:
        1. Uploaded logo file
        2. External logo URL
        3. Extracted favicon
        4. None
        """
        if self.logo:
            return self.logo.url
        if self.logo_url:
            return self.logo_url
        if self.extracted_favicon:
            return self.extracted_favicon
        return None

    @property
    def display_cover(self):
        """Return the most appropriate cover image URL:
        1. Uploaded cover image file
        2. External cover image URL
        3. None
        """
        if self.cover_image:
            return self.cover_image.url
        if self.cover_image_url:
            return self.cover_image_url
        return None

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'College'
        verbose_name_plural = 'Colleges'

class CollegeFavorite(models.Model):
    college = models.ForeignKey(College, on_delete=models.CASCADE, related_name='favorites')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorite_colleges')
    created_at = models.DateTimeField(auto_now_add=True)
    is_deleted = models.BooleanField(default=False)

    class Meta:
        unique_together = ('college', 'user')
        ordering = ['-created_at']
        verbose_name = 'College Favorite'
        verbose_name_plural = 'College Favorites'

    def __str__(self):
        return f"{self.user.username} - {self.college.name}" 