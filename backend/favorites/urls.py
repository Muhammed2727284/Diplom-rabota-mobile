from django.urls import path
from .views import FavoriteListView, FavoriteCreateView, FavoriteDeleteView, FavoriteToggleView

urlpatterns = [
    path('favorites/', FavoriteListView.as_view(), name='favorite-list'),
    path('favorites/create/', FavoriteCreateView.as_view(), name='favorite-create'),
    path('favorites/<uuid:pk>/', FavoriteDeleteView.as_view(), name='favorite-delete'),
    path('favorites/toggle/', FavoriteToggleView.as_view(), name='favorite-toggle'),
]
