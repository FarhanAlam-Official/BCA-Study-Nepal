# Generated by Django 5.1.3 on 2025-05-04 14:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('syllabus', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='syllabus',
            options={'ordering': ['subject__program', 'subject__semester', 'version'], 'verbose_name_plural': 'Syllabus'},
        ),
    ]
