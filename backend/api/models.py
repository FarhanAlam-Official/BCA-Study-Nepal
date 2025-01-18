from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator, FileExtensionValidator
from django.utils.text import slugify
import uuid
from django.core.exceptions import ValidationError


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

class Program(models.Model):
    name = models.CharField(max_length=100)  # e.g., BCA, BIT, BSc.CSIT
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    duration_years = models.PositiveIntegerField(default=4)
    is_active = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Subject(models.Model):
    code = models.CharField(max_length=20, unique=True)  # e.g., CSC101
    name = models.CharField(max_length=255)
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='subjects')
    semester = models.IntegerField(
        choices=Note.SEMESTER_CHOICES,
        validators=[MinValueValidator(1), MaxValueValidator(8)]
    )
    credit_hours = models.PositiveIntegerField(default=3)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ['code', 'program', 'semester']

    def __str__(self):
        return f"{self.code} - {self.name}"

class QuestionPaper(models.Model):
    # Basic Information
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        max_length=36
    )
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name='question_papers'
    )
    year = models.IntegerField(
        validators=[MinValueValidator(2000)],
        help_text="Year of examination"
    )
    semester = models.IntegerField(
        choices=Note.SEMESTER_CHOICES,
        validators=[MinValueValidator(1), MaxValueValidator(8)]
    )

    # File Fields
    file = models.FileField(
        upload_to='question_papers/%Y/%m/',
        help_text='Upload PDF files only',
        validators=[FileExtensionValidator(['pdf'])]
    )

    # Meta Information
    uploaded_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='uploaded_papers'
    )
    verified_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='verified_papers'
    )
    status = models.CharField(
        max_length=20,
        choices=[
            ('PENDING', 'Pending Verification'),
            ('VERIFIED', 'Verified'),
            ('REJECTED', 'Rejected'),
        ],
        default='PENDING'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    verified_date = models.DateTimeField(null=True, blank=True)
    
    # Analytics
    view_count = models.PositiveIntegerField(default=0)
    download_count = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name_plural = "Question Papers"
        ordering = ['-year', 'semester']
        indexes = [
            models.Index(fields=['year', 'semester']),
            models.Index(fields=['status']),
        ]
        unique_together = ['subject', 'year', 'semester']

    def __str__(self):
        return f"{self.subject.name} - {self.year} - Semester {self.semester}"

    def clean(self):
        if hasattr(self, '_file_to_upload') or self.file:
            file_obj = getattr(self, '_file_to_upload', self.file)
            if not file_obj.name.endswith('.pdf'):
                raise ValidationError('Only PDF files are allowed.')

    def save(self, *args, **kwargs):
        if self.file:
            if not self.file.name.endswith('.pdf'):
                raise ValidationError('Only PDF files are allowed.')
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Delete local file
        if self.file:
            self.file.delete(save=False)
        super().delete(*args, **kwargs)

    @property
    def is_verified(self):
        return self.status == 'VERIFIED'

    def increment_view_count(self):
        self.view_count += 1
        self.save(update_fields=['view_count'])

    def increment_download_count(self):
        self.download_count += 1
        self.save(update_fields=['download_count'])

    def get_file_url(self):
        """Returns the URL for file access"""
        return self.file.url if self.file else None