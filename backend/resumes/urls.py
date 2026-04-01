from django.urls import path
from .views import (
    ResumeListView, ResumeDetailView, ResumeCreateView,
    ResumeUpdateView, ResumeDeleteView, MyResumesView,
)

urlpatterns = [
    path('resumes/', ResumeListView.as_view(), name='resume-list'),
    path('resumes/create/', ResumeCreateView.as_view(), name='resume-create'),
    path('resumes/<uuid:pk>/', ResumeDetailView.as_view(), name='resume-detail'),
    path('resumes/<uuid:pk>/edit/', ResumeUpdateView.as_view(), name='resume-update'),
    path('resumes/<uuid:pk>/delete/', ResumeDeleteView.as_view(), name='resume-delete'),
    path('my/resumes/', MyResumesView.as_view(), name='my-resumes'),
]
