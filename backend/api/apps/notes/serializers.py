from rest_framework import serializers
from .models import Note

class NoteSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    uploaded_by_name = serializers.CharField(source='uploaded_by.username', read_only=True)
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Note
        fields = [
            'id', 'title', 'subject', 'subject_name', 'semester',
            'description', 'file', 'file_url', 'upload_date',
            'uploaded_by', 'uploaded_by_name', 'is_verified'
        ]
        read_only_fields = ['uploaded_by', 'upload_date']

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and hasattr(obj.file, 'url'):
            return request.build_absolute_uri(obj.file.url)
        return None 