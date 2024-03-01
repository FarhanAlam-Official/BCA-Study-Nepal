from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name', 
            'is_verified', 'phone_number', 'college', 'semester',
            'profile_picture', 'facebook_url', 'twitter_url', 
            'linkedin_url', 'github_url', 'bio', 'interests', 'skills'
        )
        read_only_fields = ('id', 'is_verified', 'email', 'username')

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'confirm_password', 'first_name', 'last_name')
        extra_kwargs = {
            'username': {
                'error_messages': {
                    'unique': 'User with that username already exists. Please choose a different username.'
                }
            },
            'email': {
                'error_messages': {
                    'unique': 'User with that email already exists. Please use a different email or try logging in.'
                }
            }
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data)
        return user

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()
    redirect_url = serializers.URLField(required=False)  # Make it optional to maintain backward compatibility

class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()
    uidb64 = serializers.CharField()
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        # Validate password strength
        validate_password(attrs['new_password'])
        
        return attrs 