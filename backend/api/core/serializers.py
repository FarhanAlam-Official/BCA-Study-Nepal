from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'phone_number',
                 'college', 'semester', 'profile_picture', 'bio', 'interests', 'skills',
                 'facebook_url', 'twitter_url', 'linkedin_url', 'github_url')
        read_only_fields = ('id',)

class BaseModelSerializer(serializers.ModelSerializer):
    """
    Base serializer with common functionality for all models
    """
    created_by = UserSerializer(read_only=True)
    updated_by = UserSerializer(read_only=True)
    
    class Meta:
        abstract = True
        fields = ('id', 'created_at', 'updated_at', 'created_by', 'updated_by')
        read_only_fields = ('id', 'created_at', 'updated_at', 'created_by', 'updated_by') 