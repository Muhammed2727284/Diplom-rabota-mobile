from django.urls import path
from .views import (
    VacancyListView, VacancyDetailView, VacancyCreateView,
    VacancyUpdateView, VacancyDeleteView, MyVacanciesView,
)

urlpatterns = [
    path('vacancies/', VacancyListView.as_view(), name='vacancy-list'),
    path('vacancies/create/', VacancyCreateView.as_view(), name='vacancy-create'),
    path('vacancies/<uuid:pk>/', VacancyDetailView.as_view(), name='vacancy-detail'),
    path('vacancies/<uuid:pk>/edit/', VacancyUpdateView.as_view(), name='vacancy-update'),
    path('vacancies/<uuid:pk>/delete/', VacancyDeleteView.as_view(), name='vacancy-delete'),
    path('my/vacancies/', MyVacanciesView.as_view(), name='my-vacancies'),
]
