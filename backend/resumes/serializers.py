from rest_framework import serializers
from .models import Resume


class ResumeListSerializer(serializers.ModelSerializer):
    owner_name = serializers.SerializerMethodField()

    class Meta:
        model = Resume
        fields = [
            'id', 'title', 'position', 'city', 'salary_from', 'salary_to',
            'employment_type', 'work_format', 'owner_name',
            'is_published', 'created_at',
        ]

    def get_owner_name(self, obj):
        profile = getattr(obj.owner_user, 'profile', None)
        if profile and (profile.first_name or profile.last_name):
            return f'{profile.first_name} {profile.last_name}'.strip()
        return obj.owner_user.email


class ResumeDetailSerializer(serializers.ModelSerializer):
    owner_name = serializers.SerializerMethodField()
    owner_email = serializers.EmailField(source='owner_user.email', read_only=True)

    class Meta:
        model = Resume
        fields = [
            'id', 'title', 'position', 'city', 'salary_from', 'salary_to',
            'employment_type', 'work_format', 'about', 'skills',
            'experience', 'education', 'is_published',
            'owner_name', 'owner_email',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_owner_name(self, obj):
        profile = getattr(obj.owner_user, 'profile', None)
        if profile and (profile.first_name or profile.last_name):
            return f'{profile.first_name} {profile.last_name}'.strip()
        return obj.owner_user.email


class ResumeCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = [
            'id', 'title', 'position', 'city', 'salary_from', 'salary_to',
            'employment_type', 'work_format', 'about', 'skills',
            'experience', 'education', 'is_published',
        ]
        read_only_fields = ['id']
