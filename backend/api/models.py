from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class College(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    contact = models.CharField(max_length=100)
    affiliation = models.CharField(max_length=255)
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(5)]
    )
    image = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Colleges"
        ordering = ['-rating']

    def __str__(self):
        return self.name

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