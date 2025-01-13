from rest_framework import serializers
from django.contrib.auth.models import User
from .models import College, Note, Event, QuestionPaper, Subject
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

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name', 'code']

class QuestionPaperSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)
    uploaded_by = serializers.SerializerMethodField()
    verified_by = serializers.SerializerMethodField()
    status_display = serializers.SerializerMethodField()
    download_url = serializers.SerializerMethodField()
    created_at_formatted = serializers.SerializerMethodField()
    verified_date_formatted = serializers.SerializerMethodField()

    class Meta:
        model = QuestionPaper
        fields = [
            # Basic Information
            'id',
            'subject',
            'year',
            'semester',
            
            # Status Information
            'status',
            'status_display',
            'notes',
            
            # File & Download Information
            'download_count',
            'file_url',
            'download_url',
            
            # User Information
            'uploaded_by',
            'verified_by',
            
            # Timestamps
            'created_at',
            'created_at_formatted',
            'verified_date',
            'verified_date_formatted',
        ]
        
        read_only_fields = [
            # System-managed fields
            'download_count', 
            'verified_by', 
            'verified_date', 
            'status',
            'file_url'
        ]

    def get_uploaded_by(self, obj):
        if obj.uploaded_by:
            return {
                'id': obj.uploaded_by.id,
                'username': obj.uploaded_by.username,
                'email': obj.uploaded_by.email if self.context['request'].user.is_staff else None
            }
        return None

    def get_verified_by(self, obj):
        if obj.verified_by:
            return {
                'id': obj.verified_by.id,
                'username': obj.verified_by.username
            }
        return None

    def get_status_display(self, obj):
        return {
            'PENDING': 'Pending Verification',
            'VERIFIED': 'Verified',
            'REJECTED': 'Rejected'
        }.get(obj.status, obj.status)

    def get_download_url(self, obj):
        request = self.context.get('request')
        if request and obj.status == 'VERIFIED':
            return request.build_absolute_uri(
                f'/api/question-papers/{obj.id}/download/'
            )
        return None

    def get_created_at_formatted(self, obj):
        return obj.created_at.strftime("%B %d, %Y")

    def get_verified_date_formatted(self, obj):
        if obj.verified_date:
            return obj.verified_date.strftime("%B %d, %Y")
        return None

    def validate(self, data):
        """
        Custom validation for the question paper.
        """
        # Validate year
        current_year = timezone.now().year
        if data.get('year') and (data['year'] < 1900 or data['year'] > current_year):
            raise serializers.ValidationError({
                'year': f'Year must be between 1900 and {current_year}'
            })

        # Validate semester
        if data.get('semester') and (data['semester'] < 1 or data['semester'] > 8):
            raise serializers.ValidationError({
                'semester': 'Semester must be between 1 and 8'
            })

        return data

    def to_representation(self, instance):
        """
        Customize the output representation based on user permissions
        """
        data = super().to_representation(instance)
        request = self.context.get('request')
        
        # Remove sensitive information for non-staff users
        if not request or not request.user.is_staff:
            if data.get('uploaded_by'):
                data['uploaded_by'].pop('email', None)
            data.pop('notes', None)

        return data