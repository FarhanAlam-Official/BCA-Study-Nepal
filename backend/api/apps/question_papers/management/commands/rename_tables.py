from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Rename subjects tables to question_papers'

    def handle(self, *args, **kwargs):
        with connection.cursor() as cursor:
            # Rename tables
            cursor.execute("ALTER TABLE subjects_program RENAME TO question_papers_program")
            cursor.execute("ALTER TABLE subjects_subject RENAME TO question_papers_subject")
            cursor.execute("ALTER TABLE subjects_questionpaper RENAME TO question_papers_questionpaper")
            
            # Update migration history
            cursor.execute("UPDATE django_migrations SET app = 'question_papers' WHERE app = 'subjects'")
            
            self.stdout.write(self.style.SUCCESS('Successfully renamed tables')) 