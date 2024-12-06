from rest_framework import serializers
from django.contrib.auth.models import User
from .models import College, Note, Event, QuestionPaper

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class CollegeSerializer(serializers.ModelSerializer):
    class Meta:
        model = College
        fields = '__all__'

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