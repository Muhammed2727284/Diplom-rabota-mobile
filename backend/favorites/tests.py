from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from users.models import User
from organizations.models import Organization
from vacancies.models import Vacancy
from resumes.models import Resume


class FavoriteToggleTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email='favuser@test.com', password='testpass123', role='USER')
        self.org_user = User.objects.create_user(email='favorg@test.com', password='testpass123', role='ORG')
        self.org = Organization.objects.get(owner_user=self.org_user)
        self.vacancy = Vacancy.objects.create(
            owner_org=self.org, title='Test Vacancy', position='Dev',
        )
        self.resume = Resume.objects.create(
            owner_user=self.user, title='Test Resume', position='Dev',
        )

    def test_toggle_add_vacancy(self):
        self.client.force_authenticate(user=self.user)
        res = self.client.post('/api/favorites/toggle/', {
            'target_type': 'VACANCY', 'target_id': str(self.vacancy.id),
        })
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['status'], 'added')

    def test_toggle_remove_vacancy(self):
        self.client.force_authenticate(user=self.user)
        self.client.post('/api/favorites/toggle/', {
            'target_type': 'VACANCY', 'target_id': str(self.vacancy.id),
        })
        res = self.client.post('/api/favorites/toggle/', {
            'target_type': 'VACANCY', 'target_id': str(self.vacancy.id),
        })
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['status'], 'removed')

    def test_toggle_add_resume(self):
        self.client.force_authenticate(user=self.org_user)
        res = self.client.post('/api/favorites/toggle/', {
            'target_type': 'RESUME', 'target_id': str(self.resume.id),
        })
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    def test_favorites_list(self):
        self.client.force_authenticate(user=self.user)
        self.client.post('/api/favorites/toggle/', {
            'target_type': 'VACANCY', 'target_id': str(self.vacancy.id),
        })
        res = self.client.get('/api/favorites/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_toggle_nonexistent(self):
        self.client.force_authenticate(user=self.user)
        res = self.client.post('/api/favorites/toggle/', {
            'target_type': 'VACANCY', 'target_id': '00000000-0000-0000-0000-000000000000',
        })
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)
