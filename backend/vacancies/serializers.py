from rest_framework import serializers
from .models import Vacancy
from organizations.serializers import OrganizationSerializer


class VacancyListSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='owner_org.name', read_only=True)

    class Meta:
        model = Vacancy
        fields = [
            'id', 'title', 'position', 'city', 'salary_from', 'salary_to',
            'employment_type', 'work_format', 'company_name',
            'is_published', 'created_at',
        ]


class VacancyDetailSerializer(serializers.ModelSerializer):
    organization = OrganizationSerializer(source='owner_org', read_only=True)

    class Meta:
        model = Vacancy
        fields = [
            'id', 'title', 'position', 'city', 'salary_from', 'salary_to',
            'employment_type', 'work_format', 'description', 'requirements',
            'conditions', 'is_published', 'organization',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class VacancyCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vacancy
        fields = [
            'id', 'title', 'position', 'city', 'salary_from', 'salary_to',
            'employment_type', 'work_format', 'description', 'requirements',
            'conditions', 'is_published',
        ]
        read_only_fields = ['id']
