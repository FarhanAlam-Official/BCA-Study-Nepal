from django.db import models
from django.core.validators import FileExtensionValidator
from django.conf import settings
from api.apps.question_papers.models import Subject

class Syllabus(models.Model):
    # Core relationships
    subject = models.ForeignKey(
        'question_papers.Subject',
        on_delete=models.CASCADE,
        related_name='syllabi',
        help_text="The subject this syllabus is for"
    )
    
    # File and version management
    file = models.FileField(
        upload_to='syllabus/%Y/%m/',
        validators=[FileExtensionValidator(['pdf'])],
        help_text='Upload PDF files only'
    )
    version = models.CharField(
        max_length=20,
        help_text='Syllabus version (e.g., "2023v1")'
    )
    
    # Status and tracking
    is_current = models.BooleanField(
        default=True,
        help_text='Whether this is the current active syllabus'
    )
    is_active = models.BooleanField(
        default=True,
        help_text='Whether this syllabus is available for viewing'
    )
    
    # Metadata
    description = models.TextField(
        blank=True,
        help_text='Additional notes or summary about this syllabus version'
    )
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='uploaded_syllabi'
    )
    upload_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    
    # Analytics
    view_count = models.PositiveIntegerField(default=0)
    download_count = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name_plural = "Syllabus"
        ordering = ['subject__program', 'subject__semester', 'version']
        constraints = [
            models.UniqueConstraint(
                fields=['subject'],
                condition=models.Q(is_current=True),
                name='unique_current_syllabus_per_subject'
            )
        ]

    def __str__(self):
        return f"{self.subject.program.name} - {self.subject.name} (v{self.version})"

    def save(self, *args, **kwargs):
        # If this is marked as current, unmark other syllabi for this subject
        if self.is_current:
            Syllabus.objects.filter(
                subject=self.subject,
                is_current=True
            ).exclude(id=self.id).update(is_current=False)
        super().save(*args, **kwargs)

    def increment_view_count(self):
        self.view_count += 1
        self.save(update_fields=['view_count'])

    def increment_download_count(self):
        self.download_count += 1
        self.save(update_fields=['download_count'])

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.file and not self.file.name.endswith('.pdf'):
            raise ValidationError({
                'file': 'Only PDF files are allowed.'
            }) 