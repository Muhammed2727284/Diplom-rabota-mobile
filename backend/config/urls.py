from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls_auth')),
    path('api/me/', include('users.urls_me')),
    path('api/', include('vacancies.urls')),
    path('api/', include('resumes.urls')),
    path('api/', include('favorites.urls')),
    path('api/', include('applications.urls')),
]
