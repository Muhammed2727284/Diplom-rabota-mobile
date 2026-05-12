from django.contrib import admin
from .models import Application, Invitation


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('applicant_user', 'vacancy', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('applicant_user__email', 'vacancy__title')
    ordering = ('-created_at',)


@admin.register(Invitation)
class InvitationAdmin(admin.ModelAdmin):
    list_display = ('invited_user', 'vacancy', 'resume', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('invited_user__email', 'vacancy__title')
    ordering = ('-created_at',)
