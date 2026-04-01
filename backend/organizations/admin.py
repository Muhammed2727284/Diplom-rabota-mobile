from django.contrib import admin
from .models import Organization


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner_user', 'city', 'phone')
    search_fields = ('name', 'owner_user__email', 'city')
