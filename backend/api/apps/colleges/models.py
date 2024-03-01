from django.db import models
from django.conf import settings

class College(models.Model):
    name = models.CharField(max_length=200)
    address = models.TextField()
    website = models.URLField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    description = models.TextField(blank=True)
    established_year = models.IntegerField(null=True, blank=True)
    logo = models.ImageField(upload_to='colleges/logos/', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='created_colleges')
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='updated_colleges')

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name 