from django.contrib import admin
from .models import Favorite


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'target_type', 'vacancy', 'resume', 'created_at')
    list_filter = ('target_type',)
