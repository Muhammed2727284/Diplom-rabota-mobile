from django.contrib import admin
from .models import Vacancy


@admin.register(Vacancy)
class VacancyAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner_org', 'city', 'employment_type', 'is_published', 'created_at')
    list_filter = ('employment_type', 'work_format', 'is_published')
    search_fields = ('title', 'position', 'city')
    ordering = ('-created_at',)
