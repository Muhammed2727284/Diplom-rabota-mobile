from django.urls import path
from .views import (
    ApplyToVacancyView, MyApplicationsView,
    VacancyApplicationsView, ApplicationStatusUpdateView,
    InviteToResumeView, MyInvitationsView,
    VacancyInvitationsView, InvitationStatusUpdateView,
)

urlpatterns = [
    path('vacancies/<uuid:vacancy_id>/apply/', ApplyToVacancyView.as_view(), name='apply-to-vacancy'),
    path('my/applications/', MyApplicationsView.as_view(), name='my-applications'),
    path('my/vacancies/<uuid:vacancy_id>/applications/', VacancyApplicationsView.as_view(), name='vacancy-applications'),
    path('applications/<uuid:pk>/status/', ApplicationStatusUpdateView.as_view(), name='application-status'),
    path('resumes/<uuid:resume_id>/invite/', InviteToResumeView.as_view(), name='invite-to-resume'),
    path('my/invitations/', MyInvitationsView.as_view(), name='my-invitations'),
    path('my/vacancies/<uuid:vacancy_id>/invitations/', VacancyInvitationsView.as_view(), name='vacancy-invitations'),
    path('invitations/<uuid:pk>/status/', InvitationStatusUpdateView.as_view(), name='invitation-status'),
]
