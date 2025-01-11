from rest_framework import serializers
from django.contrib.auth.models import User
from .models import College, Note, Event, QuestionPaper

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class CollegeSerializer(serializers.ModelSerializer):
    full_address = serializers.CharField(read_only=True)
    
    class Meta:
        model = College
        fields = [
            # Basic Information
            'id', 'name', 'slug', 'established_year',
            
            # Contact & Location
            'location', 'address_line1', 'address_line2', 
            'city', 'state', 'postal_code', 
            'contact_primary', 'contact_secondary', 
            'email', 'website', 'full_address',
            
            # Academic Information
            'affiliation', 'accreditation', 'institution_type',
            
            # Metrics & Rankings
            'rating', 'total_students', 'student_teacher_ratio', 
            'placement_rate',
            
            # Features & Facilities
            'facilities', 'courses_offered', 'specializations',
            
            # Media
            'logo', 'image', 'gallery_images', 'virtual_tour_url',
            
            # Additional Information
            'description', 'achievements', 'notable_alumni',
            'scholarships_available',
            
            # Social Media
            'facebook_url', 'twitter_url', 'linkedin_url', 'instagram_url',
            
            # Meta Information
            'is_active', 'is_featured', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']

class NoteSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)

    class Meta:
        model = Note
        fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

class QuestionPaperSerializer(serializers.ModelSerializer):
    file = serializers.FileField(write_only=True, required=False)
    file_url = serializers.URLField(required=False)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    subject_code = serializers.CharField(source='subject.code', read_only=True)
    uploaded_by_name = serializers.CharField(source='uploaded_by.username', read_only=True)
    verified_by_name = serializers.CharField(source='verified_by.username', read_only=True)
    program_name = serializers.CharField(source='subject.program.name', read_only=True)

    class Meta:
        model = QuestionPaper
        fields = [
            'id', 'subject', 'subject_name', 'subject_code', 'program_name',
            'year', 'semester', 'exam_type', 'status', 'file', 'file_url',
            'storage_type',
            'full_marks', 'pass_marks', 'duration_hours',
            'uploaded_by_name', 'verified_by_name',
            'upload_date', 'verified_date',
            'view_count', 'download_count',
            'notes', 'tags'
        ]
        read_only_fields = [
            'status', 'uploaded_by_name', 'verified_by_name',
            'verified_date', 'view_count', 'download_count'
        ]

    def validate(self, data):
        if not self.instance:  # Only for creation
            if 'file' not in self.context['request'].FILES and 'file_url' not in data:
                raise serializers.ValidationError('Either file or file_url must be provided')
        return data

    def create(self, validated_data):
        file_obj = self.context['request'].FILES.get('file')
        if file_obj:
            instance = super().create(validated_data)
            instance.upload_file(file_obj, validated_data.get('storage_type', 'LOCAL'))
            instance.save()
            return instance
        return super().create(validated_data)