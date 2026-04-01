from django.contrib import admin
from .models import Resume


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner_user', 'position', 'city', 'is_published', 'created_at')
    list_filter = ('employment_type', 'work_format', 'is_published')
    search_fields = ('title', 'position', 'city')
    ordering = ('-created_at',)
