from rest_framework import serializers
from .models import Syllabus
from api.apps.question_papers.serializers import SubjectSerializer
from api.apps.question_papers.models import Subject

class SyllabusSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    program_name = serializers.CharField(source='subject.program.name', read_only=True)
    uploaded_by_name = serializers.CharField(source='uploaded_by.username', read_only=True)
    file_url = serializers.SerializerMethodField()
    available_subjects = serializers.SerializerMethodField()

    class Meta:
        model = Syllabus
        fields = [
            'id', 'subject', 'subject_name', 'program_name',
            'file', 'file_url', 'version', 'is_current', 'is_active',
            'description', 'uploaded_by', 'uploaded_by_name',
            'upload_date', 'last_updated', 'view_count', 'download_count',
            'available_subjects'
        ]
        read_only_fields = [
            'uploaded_by', 'upload_date', 'last_updated',
            'view_count', 'download_count', 'available_subjects'
        ]

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and hasattr(obj.file, 'url'):
            return request.build_absolute_uri(obj.file.url)
        return None

    def get_available_subjects(self, obj):
        program_id = self.context.get('program_id')
        semester = self.context.get('semester')
        
        if program_id and semester:
            subjects = Subject.objects.filter(
                program_id=program_id,
                semester=semester
            ).order_by('name')
            return SubjectSerializer(subjects, many=True).data
        return []

class SyllabusDetailSerializer(SyllabusSerializer):
    subject = SubjectSerializer(read_only=True) 