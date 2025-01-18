from rest_framework import serializers
from django.contrib.auth.models import User
from .models import College, Note, Event, QuestionPaper, Subject, Program
from django.utils import timezone

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

class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = ['id', 'name', 'description', 'duration_years', 'is_active']

class SubjectSerializer(serializers.ModelSerializer):
    program_name = serializers.CharField(source='program.name', read_only=True)
    
    class Meta:
        model = Subject
        fields = [
            'id', 'code', 'name', 'program', 'program_name',
            'semester', 'credit_hours', 'is_active'
        ]

class QuestionPaperSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = QuestionPaper
        fields = [
            'id', 'subject', 'subject_name', 'year', 'semester', 
            'status', 'file', 'file_url', 'view_count', 'download_count',
            'created_at', 'updated_at'
        ]

    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
        return None
    
    def get_program(self, obj):
        return {
            'id': obj.subject.program.id,
            'name': obj.subject.program.name
        }