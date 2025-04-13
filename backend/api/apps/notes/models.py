from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from api.apps.question_papers.models import Subject

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
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='notes')
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
        settings.AUTH_USER_MODEL,
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