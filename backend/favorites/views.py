from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Favorite
from .serializers import FavoriteSerializer, FavoriteCreateSerializer, FavoriteToggleSerializer
from vacancies.models import Vacancy
from resumes.models import Resume


class FavoriteListView(generics.ListAPIView):
    serializer_class = FavoriteSerializer

    def get_queryset(self):
        qs = Favorite.objects.filter(user=self.request.user).select_related('vacancy__owner_org', 'resume__owner_user')
        target_type = self.request.query_params.get('target_type')
        if target_type in ('VACANCY', 'RESUME'):
            qs = qs.filter(target_type=target_type)
        return qs


class FavoriteCreateView(generics.CreateAPIView):
    serializer_class = FavoriteCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        target_type = data['target_type']

        kwargs_fav = {'user': request.user, 'target_type': target_type}
        if target_type == 'VACANCY':
            kwargs_fav['vacancy_id'] = data['vacancy_id']
        else:
            kwargs_fav['resume_id'] = data['resume_id']

        fav, created = Favorite.objects.get_or_create(**kwargs_fav)
        if not created:
            return Response({'detail': 'Already in favorites.'}, status=status.HTTP_200_OK)
        return Response(FavoriteSerializer(fav).data, status=status.HTTP_201_CREATED)


class FavoriteDeleteView(generics.DestroyAPIView):
    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)


class FavoriteToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = FavoriteToggleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        target_type = serializer.validated_data['target_type']
        target_id = serializer.validated_data['target_id']

        lookup = {'user': request.user, 'target_type': target_type}
        if target_type == 'VACANCY':
            if not Vacancy.objects.filter(id=target_id).exists():
                return Response({'detail': 'Vacancy not found.'}, status=status.HTTP_404_NOT_FOUND)
            lookup['vacancy_id'] = target_id
        else:
            if not Resume.objects.filter(id=target_id).exists():
                return Response({'detail': 'Resume not found.'}, status=status.HTTP_404_NOT_FOUND)
            lookup['resume_id'] = target_id

        try:
            fav = Favorite.objects.get(**lookup)
            fav.delete()
            return Response({'status': 'removed'}, status=status.HTTP_200_OK)
        except Favorite.DoesNotExist:
            fav = Favorite.objects.create(**lookup)
            return Response({'status': 'added', 'id': str(fav.id)}, status=status.HTTP_201_CREATED)
