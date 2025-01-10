from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.text import slugify


class College(models.Model):
    # Basic Information
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True, null=True)
    established_year = models.PositiveIntegerField(null=True, blank=True)
    
    # Contact & Location
    location = models.CharField(max_length=255)
    address_line1 = models.CharField(max_length=255, blank=True, default='')
    address_line2 = models.CharField(max_length=255, blank=True, default='')
    city = models.CharField(max_length=100, blank=True, default='')
    state = models.CharField(max_length=100, blank=True, default='')
    postal_code = models.CharField(max_length=10, blank=True, default='')
    contact_primary = models.CharField(max_length=100,blank=True, default='')
    contact_secondary = models.CharField(max_length=100, blank=True, default='')
    email = models.EmailField(blank=True, default='')
    website = models.URLField(blank=True)
    
    # Academic Information
    affiliation = models.CharField(max_length=255)
    accreditation = models.CharField(max_length=255, blank=True, default='')
    institution_type = models.CharField(
        max_length=50,
        choices=[
            ('public', 'Public'),
            ('private', 'Private'),
            ('community', 'Community')
        ],
        default='private'
    )
    
    # Metrics & Rankings
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(5)]
    )
    total_students = models.PositiveIntegerField(null=True, blank=True)
    student_teacher_ratio = models.CharField(max_length=20, blank=True, default='')
    placement_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    
    # Facilities & Features
    facilities = models.JSONField(default=list, blank=True)  # ["Library", "Labs", "Sports"]
    courses_offered = models.JSONField(default=list, blank=True)  # ["BCA", "BIT"]
    specializations = models.JSONField(default=list, blank=True)  # ["AI", "Networking"]
    
    # Media
    logo = models.URLField(blank=True)
    image = models.URLField()
    gallery_images = models.JSONField(default=list, blank=True)  # List of image URLs
    virtual_tour_url = models.URLField(blank=True)
    
    # Additional Information
    description = models.TextField(blank=True, default='')
    achievements = models.JSONField(default=list, blank=True)
    notable_alumni = models.JSONField(default=list, blank=True)
    scholarships_available = models.BooleanField(default=False)
    
    # Social Media
    facebook_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    
    # Meta Information
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Colleges"
        ordering = ['-rating', 'name']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['is_featured']),
            models.Index(fields=['rating']),
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    @property
    def full_address(self):
        parts = [self.address_line1]
        if self.address_line2:
            parts.append(self.address_line2)
        parts.extend([self.city, self.state, self.postal_code])
        return ', '.join(filter(None, parts))

class Note(models.Model):
    SEMESTER_CHOICES = [
        (1, '1st Semester'),
        (2, '2nd Semester'),
        (3, '3rd Semester'),
        (4, '4th Semester'),
        (5, '5th Semester'),
        (6, '6th Semester'),
        (7, '7th Semester'),
        (8, '8th Semester'),
    ]

    title = models.CharField(max_length=255)
    subject = models.CharField(max_length=255)
    semester = models.IntegerField(
        choices=SEMESTER_CHOICES,
        validators=[MinValueValidator(1), MaxValueValidator(8)]
    )
    description = models.TextField(blank=True)
    file = models.FileField(
        upload_to='notes/%Y/%m/',
        help_text='Upload PDF files only'
    )
    upload_date = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='uploaded_notes'
    )
    is_verified = models.BooleanField(
        default=False,
        help_text='Verify if the note content is appropriate'
    )

    class Meta:
        verbose_name_plural = "Notes"
        ordering = ['-upload_date']

    def __str__(self):
        return f"{self.title} - Semester {self.semester}"

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.file:
            if not self.file.name.endswith('.pdf'):
                raise ValidationError('Only PDF files are allowed.')

class Event(models.Model):
    EVENT_TYPES = [
        ('SEMINAR', 'Seminar'),
        ('WORKSHOP', 'Workshop'),
        ('COMPETITION', 'Competition'),
        ('WEBINAR', 'Webinar'),
    ]

    title = models.CharField(max_length=255)
    date = models.DateField()
    time = models.CharField(max_length=50)
    location = models.CharField(max_length=255)
    type = models.CharField(max_length=50, choices=EVENT_TYPES)
    description = models.TextField()
    speaker = models.CharField(max_length=255, blank=True, null=True)
    registration = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Events"
        ordering = ['date']

    def __str__(self):
        return self.title

class QuestionPaper(models.Model):
    year = models.IntegerField(
        validators=[MinValueValidator(2000)]
    )
    semester = models.IntegerField(
        choices=Note.SEMESTER_CHOICES,
        validators=[MinValueValidator(1), MaxValueValidator(8)]
    )
    subject = models.CharField(max_length=255)
    file = models.FileField(
        upload_to='question_papers/%Y/',
        help_text='Upload PDF files only'
    )
    upload_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Question Papers"
        ordering = ['-year', 'semester']

    def __str__(self):
        return f"{self.subject} - {self.year} - Semester {self.semester}"

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.file:
            if not self.file.name.endswith('.pdf'):
                raise ValidationError('Only PDF files are allowed.')