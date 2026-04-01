import django_filters
from django.db import models
from .models import Vacancy


class VacancyFilter(django_filters.FilterSet):
    q = django_filters.CharFilter(method='search_filter')
    city = django_filters.CharFilter(lookup_expr='iexact')
    employment_type = django_filters.CharFilter(lookup_expr='exact')
    work_format = django_filters.CharFilter(lookup_expr='exact')
    salary_from = django_filters.NumberFilter(field_name='salary_from', lookup_expr='gte')

    class Meta:
        model = Vacancy
        fields = ['city', 'employment_type', 'work_format', 'salary_from']

    def search_filter(self, queryset, name, value):
        return queryset.filter(
            models.Q(title__icontains=value) |
            models.Q(position__icontains=value) |
            models.Q(description__icontains=value)
        )
