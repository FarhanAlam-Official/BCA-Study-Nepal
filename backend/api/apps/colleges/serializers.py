from rest_framework import serializers
from .models import College, CollegeFavorite

class CollegeSerializer(serializers.ModelSerializer):
    contact_numbers = serializers.SerializerMethodField()
    is_favorite = serializers.SerializerMethodField()
    display_logo = serializers.SerializerMethodField()
    display_cover = serializers.SerializerMethodField()

    class Meta:
        model = College
        fields = [
            'id', 'name', 'description', 'location', 'website',
            'logo', 'logo_url', 'extracted_favicon', 'display_logo',
            'cover_image', 'cover_image_url', 'display_cover',
            'email', 'contact_numbers', 'established_year',
            'programs', 'facilities', 'is_featured',
            'rating', 'views_count', 'admission_status',
            'created_at', 'updated_at', 'is_favorite'
        ]

    def get_contact_numbers(self, obj):
        return {
            'primary': obj.primary_contact,
            'secondary': obj.secondary_contact,
            'tertiary': obj.tertiary_contact
        }

    def get_is_favorite(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return CollegeFavorite.objects.filter(
                college=obj,
                user=request.user
            ).exists()
        return False

    def get_display_logo(self, obj):
        if obj.logo and hasattr(obj.logo, 'url'):
            return obj.logo.url
        if obj.logo_url:
            return obj.logo_url
        if obj.extracted_favicon:
            return obj.extracted_favicon
        return None

    def get_display_cover(self, obj):
        if obj.cover_image and hasattr(obj.cover_image, 'url'):
            return obj.cover_image.url
        if obj.cover_image_url:
            return obj.cover_image_url
        return None

class CollegeFavoriteSerializer(serializers.ModelSerializer):
    college = CollegeSerializer()

    class Meta:
        model = CollegeFavorite
        fields = ['id', 'user', 'college', 'created_at'] 