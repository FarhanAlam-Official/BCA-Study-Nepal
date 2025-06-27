from rest_framework import serializers
from django.utils.text import slugify
from .models import Category, Tag, Resource, ResourceSubmission, Favorite

class CategorySerializer(serializers.ModelSerializer):
    """Serializer for resource categories"""
    resource_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon', 'description', 'order', 'resource_count']
        read_only_fields = ['id', 'slug']

    def create(self, validated_data):
        validated_data['slug'] = slugify(validated_data['name'])
        return super().create(validated_data)

class TagSerializer(serializers.ModelSerializer):
    """Serializer for resource tags"""
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']
        read_only_fields = ['id', 'slug']

    def create(self, validated_data):
        validated_data['slug'] = slugify(validated_data['name'])
        return super().create(validated_data)

class ResourceSerializer(serializers.ModelSerializer):
    """Serializer for resources with nested category and tags"""
    category = CategorySerializer(read_only=True)
    category_id = serializers.UUIDField(write_only=True)
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.ListField(
        child=serializers.UUIDField(),
        write_only=True,
        required=False
    )
    is_favorited = serializers.SerializerMethodField()
    favorite_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Resource
        fields = [
            'id', 'title', 'slug', 'description', 'url', 'icon_url',
            'category', 'category_id', 'tags', 'tag_ids', 'featured',
            'priority', 'view_count', 'is_active', 'created_at',
            'updated_at', 'is_favorited', 'favorite_count'
        ]
        read_only_fields = ['id', 'slug', 'view_count', 'created_at', 'updated_at']

    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.favorites.filter(user=request.user).exists()
        return False

    def create(self, validated_data):
        tag_ids = validated_data.pop('tag_ids', [])
        validated_data['slug'] = slugify(validated_data['title'])
        instance = super().create(validated_data)
        instance.tags.set(tag_ids)
        return instance

    def update(self, instance, validated_data):
        tag_ids = validated_data.pop('tag_ids', None)
        if tag_ids is not None:
            instance.tags.set(tag_ids)
        return super().update(instance, validated_data)

class ResourceSubmissionSerializer(serializers.ModelSerializer):
    """Serializer for user-submitted resources"""
    submitted_by = serializers.StringRelatedField(read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = ResourceSubmission
        fields = [
            'id', 'title', 'description', 'url', 'category', 'category_id',
            'submitted_by', 'submitter_email', 'status', 'review_notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'submitted_by', 'status', 'review_notes',
            'created_at', 'updated_at'
        ]

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['submitted_by'] = request.user
        return super().create(validated_data)

class FavoriteSerializer(serializers.ModelSerializer):
    """Serializer for user favorites"""
    resource = ResourceSerializer(read_only=True)
    resource_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'resource', 'resource_id', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

    def validate(self, attrs):
        # Check if favorite already exists
        user = self.context['request'].user
        resource_id = attrs['resource_id']
        if Favorite.objects.filter(user=user, resource_id=resource_id).exists():
            raise serializers.ValidationError("Resource already favorited.") 