from rest_framework import generics, permissions
from users.permissions import IsOrg, IsOwner
from .models import Vacancy
from .serializers import VacancyListSerializer, VacancyDetailSerializer, VacancyCreateUpdateSerializer
from .filters import VacancyFilter


class VacancyListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = VacancyListSerializer
    filterset_class = VacancyFilter
    ordering = ['-created_at']

    def get_queryset(self):
        return Vacancy.objects.filter(is_published=True).select_related('owner_org')


class VacancyDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = VacancyDetailSerializer
    queryset = Vacancy.objects.select_related('owner_org')
    lookup_field = 'pk'


class VacancyCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsOrg]
    serializer_class = VacancyCreateUpdateSerializer

    def perform_create(self, serializer):
        serializer.save(owner_org=self.request.user.organization)


class VacancyUpdateView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsOrg, IsOwner]
    serializer_class = VacancyCreateUpdateSerializer
    queryset = Vacancy.objects.all()
    lookup_field = 'pk'


class VacancyDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, IsOrg, IsOwner]
    queryset = Vacancy.objects.all()
    lookup_field = 'pk'


class MyVacanciesView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, IsOrg]
    serializer_class = VacancyListSerializer

    def get_queryset(self):
        return Vacancy.objects.filter(
            owner_org=self.request.user.organization
        ).select_related('owner_org')
