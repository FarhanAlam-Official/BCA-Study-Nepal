from rest_framework import serializers
from .models import Program, Subject, QuestionPaper

class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = '__all__'

class QuestionPaperSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionPaper
        fields = ['id', 'year', 'semester', 'file', 'status', 'view_count', 'download_count']

class SubjectSerializer(serializers.ModelSerializer):
    question_papers = QuestionPaperSerializer(many=True, read_only=True)
    
    class Meta:
        model = Subject
        fields = ['id', 'code', 'name', 'program', 'semester', 'credit_hours', 'is_active', 'question_papers'] 