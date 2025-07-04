# Generated by Django 5.1.3 on 2025-04-12 16:15

import django.core.validators
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('question_papers', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Note',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('semester', models.IntegerField(choices=[(1, '1st Semester'), (2, '2nd Semester'), (3, '3rd Semester'), (4, '4th Semester'), (5, '5th Semester'), (6, '6th Semester'), (7, '7th Semester'), (8, '8th Semester')], validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(8)])),
                ('description', models.TextField(blank=True)),
                ('file', models.FileField(help_text='Upload PDF files only', upload_to='notes/%Y/%m/')),
                ('upload_date', models.DateTimeField(auto_now_add=True)),
                ('is_verified', models.BooleanField(default=False, help_text='Verify if the note content is appropriate')),
                ('subject', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notes', to='question_papers.subject')),
                ('uploaded_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='uploaded_notes', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': 'Notes',
                'ordering': ['-upload_date'],
            },
        ),
    ]
