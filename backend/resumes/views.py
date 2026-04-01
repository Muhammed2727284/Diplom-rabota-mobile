from rest_framework import generics, permissions
from users.permissions import IsUser, IsOwner
from .models import Resume
from .serializers import ResumeListSerializer, ResumeDetailSerializer, ResumeCreateUpdateSerializer
from .filters import ResumeFilter


class ResumeListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ResumeListSerializer
    filterset_class = ResumeFilter
    ordering = ['-created_at']

    def get_queryset(self):
        return Resume.objects.filter(is_published=True).select_related('owner_user__profile')


class ResumeDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ResumeDetailSerializer
    queryset = Resume.objects.select_related('owner_user__profile')
    lookup_field = 'pk'


class ResumeCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsUser]
    serializer_class = ResumeCreateUpdateSerializer

    def perform_create(self, serializer):
        serializer.save(owner_user=self.request.user)


class ResumeUpdateView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsUser]
    serializer_class = ResumeCreateUpdateSerializer
    lookup_field = 'pk'

    def get_queryset(self):
        return Resume.objects.filter(owner_user=self.request.user)


class ResumeDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, IsUser]
    lookup_field = 'pk'

    def get_queryset(self):
        return Resume.objects.filter(owner_user=self.request.user)


class MyResumesView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, IsUser]
    serializer_class = ResumeListSerializer

    def get_queryset(self):
        return Resume.objects.filter(
            owner_user=self.request.user
        ).select_related('owner_user__profile')
