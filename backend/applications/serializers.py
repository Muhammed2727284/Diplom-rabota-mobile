from rest_framework import serializers
from .models import Application, Invitation
from vacancies.serializers import VacancyListSerializer
from resumes.serializers import ResumeListSerializer


class ApplicationSerializer(serializers.ModelSerializer):
    vacancy_detail = VacancyListSerializer(source='vacancy', read_only=True)
    resume_detail = ResumeListSerializer(source='resume', read_only=True)
    applicant_email = serializers.EmailField(source='applicant_user.email', read_only=True)

    class Meta:
        model = Application
        fields = [
            'id', 'vacancy', 'vacancy_detail', 'applicant_email',
            'resume', 'resume_detail', 'message', 'status', 'created_at',
        ]
        read_only_fields = ['id', 'status', 'created_at']


class ApplicationCreateSerializer(serializers.Serializer):
    resume_id = serializers.UUIDField(required=False, allow_null=True)
    message = serializers.CharField(required=False, allow_blank=True, default='')


class ApplicationStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=['VIEWED', 'ACCEPTED', 'REJECTED'])


class InvitationSerializer(serializers.ModelSerializer):
    vacancy_detail = VacancyListSerializer(source='vacancy', read_only=True)
    resume_detail = ResumeListSerializer(source='resume', read_only=True)
    invited_email = serializers.EmailField(source='invited_user.email', read_only=True)

    class Meta:
        model = Invitation
        fields = [
            'id', 'vacancy', 'vacancy_detail', 'invited_email',
            'resume', 'resume_detail', 'message', 'status', 'created_at',
        ]
        read_only_fields = ['id', 'status', 'created_at']


class InvitationCreateSerializer(serializers.Serializer):
    vacancy_id = serializers.UUIDField()
    message = serializers.CharField(required=False, allow_blank=True, default='')


class InvitationStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=['VIEWED', 'ACCEPTED', 'REJECTED'])
