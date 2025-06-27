from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Todo, SubTask, Comment
from django.utils import timezone
import pytz

User = get_user_model()

class SubTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubTask
        fields = ['id', 'title', 'is_completed', 'created_at']
        read_only_fields = ['id', 'created_at']

class CommentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'content', 'created_at', 'user', 'user_name']
        read_only_fields = ['id', 'created_at', 'user', 'user_name']

class TodoSerializer(serializers.ModelSerializer):
    subtasks = SubTaskSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    dueDate = serializers.DateTimeField(
        source='due_date',
        required=False,
        allow_null=True,
        format='iso-8601'
    )
    isCompleted = serializers.BooleanField(source='is_completed')
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    lastModified = serializers.DateTimeField(source='last_modified', read_only=True)

    class Meta:
        model = Todo
        fields = [
            'id', 'title', 'description', 'priority', 'dueDate',
            'category', 'isCompleted', 'createdAt', 'lastModified',
            'owner', 'subtasks', 'comments'
        ]
        read_only_fields = ['id', 'createdAt', 'lastModified', 'owner']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.due_date:
            if timezone.is_naive(instance.due_date):
                aware_date = timezone.make_aware(instance.due_date, pytz.UTC)
            else:
                aware_date = instance.due_date.astimezone(pytz.UTC)
            data['dueDate'] = aware_date.isoformat()
        else:
            data['dueDate'] = None
        return data

    def create(self, validated_data):
        return Todo.objects.create(**validated_data)

    def update(self, instance, validated_data):        
        # Update all fields using validated_data directly
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance