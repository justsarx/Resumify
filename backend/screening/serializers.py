from rest_framework import serializers
from django.contrib.auth.models import User

from .models import Resume, JobPost

class ResumeSerializer(serializers.ModelSerializer):
    keywords_list = serializers.SerializerMethodField()
    matching_score = serializers.FloatField(read_only=True)

    class Meta:
        model = Resume
        fields = '__all__'
        read_only_fields = ['upload_date', 'score', 'review', 'keywords', 'matching_score']

    def get_keywords_list(self, obj):
        return obj.get_keywords_list()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


class JobPostSerializer(serializers.ModelSerializer):
    employer_username = serializers.ReadOnlyField(source='employer.username')
    skills_list = serializers.SerializerMethodField()

    class Meta:
        model = JobPost
        fields = '__all__'
        read_only_fields = ['employer', 'created_at', 'employer_username', 'skills_list']

    def get_skills_list(self, obj):
        return obj.get_skills_list()

    def validate_skills_required(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Skills required cannot be empty.")
        return value

    def create(self, validated_data):
        # Attach the current user (request.user) as employer
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            validated_data["employer"] = request.user
        return super().create(validated_data)
