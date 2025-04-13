from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator, FileExtensionValidator
from django.utils.text import slugify
import uuid
import os
from django.utils import timezone

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

    code = models.CharField(max_length=20, unique=True)  # e.g., CSC101
    name = models.CharField(max_length=255)
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='subjects')
    semester = models.IntegerField(
        choices=SEMESTER_CHOICES,
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
        choices=Subject.SEMESTER_CHOICES,
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
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='uploaded_papers'
    )
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
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
        return f"{self.subject.code} - {self.year} - Semester {self.semester}"

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.file:
            if not self.file.name.endswith('.pdf'):
                raise ValidationError('Only PDF files are allowed.')

    def save(self, *args, **kwargs):
        if self.status == 'VERIFIED' and not self.verified_by:
            self.verified_by = self.uploaded_by
            self.verified_date = timezone.now()
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Delete local file
        if self.file:
            if os.path.isfile(self.file.path):
                os.remove(self.file.path)
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
        return self.file.url if self.file else None 