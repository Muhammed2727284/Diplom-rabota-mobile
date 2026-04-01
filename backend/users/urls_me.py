from django.urls import path
from .views import MeView, MyProfileView
from organizations.views import MyOrganizationView

urlpatterns = [
    path('', MeView.as_view(), name='me'),
    path('profile/', MyProfileView.as_view(), name='my-profile'),
    path('organization/', MyOrganizationView.as_view(), name='my-organization'),
]
