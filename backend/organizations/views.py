from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Organization
from .serializers import OrganizationSerializer


class MyOrganizationView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrganizationSerializer

    def get_object(self):
        org, _ = Organization.objects.get_or_create(owner_user=self.request.user)
        return org
