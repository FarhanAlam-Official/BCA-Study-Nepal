from django.core.management.base import BaseCommand
import json
from api.apps.question_papers.models import Program, Subject, QuestionPaper
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = 'Restore data to question_papers app after migration'

    def handle(self, *args, **kwargs):
        try:
            with open('data_backup.json', 'r') as f:
                data = json.load(f)

            # Restore programs
            for program_data in data['programs']:
                Program.objects.create(
                    id=program_data['id'],
                    name=program_data['name'],
                    short_name=program_data['short_name'],
                    description=program_data['description'],
                    duration_years=program_data['duration_years']
                )

            # Restore subjects
            for subject_data in data['subjects']:
                Subject.objects.create(
                    id=subject_data['id'],
                    name=subject_data['name'],
                    code=subject_data['code'],
                    description=subject_data['description'],
                    credit_hours=subject_data['credit_hours'],
                    semester=subject_data['semester'],
                    program_id=subject_data['program_id']
                )

            # Restore question papers
            User = get_user_model()
            for paper_data in data['papers']:
                QuestionPaper.objects.create(
                    id=paper_data['id'],
                    year=paper_data['year'],
                    semester=paper_data['semester'],
                    file_url=paper_data['file_url'],
                    status=paper_data['status'],
                    subject_id=paper_data['subject_id'],
                    uploaded_by_id=paper_data['uploaded_by_id']
                )

            self.stdout.write(self.style.SUCCESS('Successfully restored data'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error restoring data: {str(e)}')) 