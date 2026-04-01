from rest_framework import serializers
from .models import Favorite
from vacancies.serializers import VacancyListSerializer
from resumes.serializers import ResumeListSerializer


class FavoriteSerializer(serializers.ModelSerializer):
    vacancy_detail = VacancyListSerializer(source='vacancy', read_only=True)
    resume_detail = ResumeListSerializer(source='resume', read_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'target_type', 'vacancy', 'resume', 'vacancy_detail', 'resume_detail', 'created_at']
        read_only_fields = ['id', 'created_at']


class FavoriteCreateSerializer(serializers.Serializer):
    target_type = serializers.ChoiceField(choices=['VACANCY', 'RESUME'])
    vacancy_id = serializers.UUIDField(required=False, allow_null=True)
    resume_id = serializers.UUIDField(required=False, allow_null=True)

    def validate(self, data):
        target_type = data['target_type']
        if target_type == 'VACANCY' and not data.get('vacancy_id'):
            raise serializers.ValidationError({'vacancy_id': 'Required for VACANCY type.'})
        if target_type == 'RESUME' and not data.get('resume_id'):
            raise serializers.ValidationError({'resume_id': 'Required for RESUME type.'})
        return data


class FavoriteToggleSerializer(serializers.Serializer):
    target_type = serializers.ChoiceField(choices=['VACANCY', 'RESUME'])
    target_id = serializers.UUIDField()
