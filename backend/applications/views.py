from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from users.permissions import IsUser, IsOrg
from vacancies.models import Vacancy
from resumes.models import Resume
from .models import Application
from .serializers import ApplicationSerializer, ApplicationCreateSerializer, ApplicationStatusSerializer


class ApplyToVacancyView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsUser]

    def post(self, request, vacancy_id):
        vacancy = get_object_or_404(Vacancy, pk=vacancy_id, is_published=True)
        serializer = ApplicationCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if Application.objects.filter(vacancy=vacancy, applicant_user=request.user).exists():
            return Response(
                {'detail': 'You have already applied to this vacancy.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        resume = None
        resume_id = serializer.validated_data.get('resume_id')
        if resume_id:
            resume = get_object_or_404(Resume, pk=resume_id, owner_user=request.user)

        application = Application.objects.create(
            vacancy=vacancy,
            applicant_user=request.user,
            resume=resume,
            message=serializer.validated_data.get('message', ''),
        )
        return Response(ApplicationSerializer(application).data, status=status.HTTP_201_CREATED)


class MyApplicationsView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, IsUser]
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        return Application.objects.filter(
            applicant_user=self.request.user
        ).select_related('vacancy__owner_org', 'resume')


class VacancyApplicationsView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, IsOrg]
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        vacancy_id = self.kwargs['vacancy_id']
        vacancy = get_object_or_404(
            Vacancy, pk=vacancy_id, owner_org__owner_user=self.request.user
        )
        return Application.objects.filter(vacancy=vacancy).select_related(
            'applicant_user', 'resume', 'vacancy__owner_org'
        )


class ApplicationStatusUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsOrg]

    def patch(self, request, pk):
        application = get_object_or_404(Application, pk=pk)
        if application.vacancy.owner_org.owner_user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        serializer = ApplicationStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        application.status = serializer.validated_data['status']
        application.save(update_fields=['status'])
        return Response(ApplicationSerializer(application).data)
