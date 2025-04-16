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
    shared_with = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=User.objects.all(),
        required=False
    )
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
            'owner', 'shared_with', 'subtasks', 'comments'
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
        shared_with = validated_data.pop('shared_with', [])
        todo = Todo.objects.create(**validated_data)
        todo.shared_with.set(shared_with)
        return todo

    # Handle shared_with separately
    def update(self, instance, validated_data):
        shared_with = validated_data.pop('shared_with', None)
        
        # Update all fields using validated_data directly
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Save the instance
        instance.save()
        
        # Update shared_with after saving if provided
        if shared_with is not None:
            instance.shared_with.set(shared_with)
        
        return instance