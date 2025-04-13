from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Clean up old subjects tables'

    def handle(self, *args, **kwargs):
        with connection.cursor() as cursor:
            # Drop old tables
            cursor.execute("DROP TABLE IF EXISTS subjects_program")
            cursor.execute("DROP TABLE IF EXISTS subjects_subject")
            cursor.execute("DROP TABLE IF EXISTS subjects_questionpaper")
            
            # Remove migration history
            cursor.execute("DELETE FROM django_migrations WHERE app = 'subjects'")
            
            self.stdout.write(self.style.SUCCESS('Successfully cleaned up old tables')) 