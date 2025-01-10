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
    class Meta:
        model = QuestionPaper
        fields = '__all__'