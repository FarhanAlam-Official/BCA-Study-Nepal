from django.db import models
from django.contrib.auth.models import User

class College(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    contact = models.CharField(max_length=100)
    affiliation = models.CharField(max_length=255)
    rating = models.DecimalField(max_digits=3, decimal_places=2)
    image = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Note(models.Model):
    title = models.CharField(max_length=255)
    subject = models.CharField(max_length=255)
    semester = models.IntegerField()
    file = models.FileField(upload_to='notes/')
    upload_date = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.title} - Semester {self.semester}"

class Event(models.Model):
    title = models.CharField(max_length=255)
    date = models.DateField()
    time = models.CharField(max_length=50)
    location = models.CharField(max_length=255)
    type = models.CharField(max_length=50)
    description = models.TextField()
    speaker = models.CharField(max_length=255, blank=True, null=True)
    registration = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class QuestionPaper(models.Model):
    year = models.IntegerField()
    semester = models.IntegerField()
    subject = models.CharField(max_length=255)
    file = models.FileField(upload_to='question_papers/')
    upload_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.subject} - {self.year} - Semester {self.semester}"