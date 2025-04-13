from django.core.management.base import BaseCommand
import json
from django.db import connection
from datetime import datetime

class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

class Command(BaseCommand):
    help = 'Backup data from subjects app before migration'

    def handle(self, *args, **kwargs):
        with connection.cursor() as cursor:
            # Backup programs
            cursor.execute("SELECT * FROM subjects_program")
            programs = []
            for row in cursor.fetchall():
                programs.append({
                    'id': row[0],
                    'name': row[1],
                    'short_name': row[2],
                    'description': row[3],
                    'duration_years': row[4]
                })

            # Backup subjects
            cursor.execute("SELECT * FROM subjects_subject")
            subjects = []
            for row in cursor.fetchall():
                subjects.append({
                    'id': row[0],
                    'name': row[1],
                    'code': row[2],
                    'description': row[3],
                    'credit_hours': row[4],
                    'semester': row[5],
                    'program_id': row[6]
                })

            # Backup question papers
            cursor.execute("SELECT * FROM subjects_questionpaper")
            papers = []
            for row in cursor.fetchall():
                papers.append({
                    'id': row[0],
                    'year': row[1],
                    'semester': row[2],
                    'file_url': row[3],
                    'status': row[4],
                    'subject_id': row[5],
                    'uploaded_by_id': row[6]
                })

            # Save to JSON file
            with open('data_backup.json', 'w') as f:
                json.dump({
                    'programs': programs,
                    'subjects': subjects,
                    'papers': papers
                }, f, indent=2, cls=DateTimeEncoder)

            self.stdout.write(self.style.SUCCESS('Successfully backed up data')) 