from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from users.models import User
from organizations.models import Organization
from vacancies.models import Vacancy
from resumes.models import Resume


class ApplicationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email='appuser@test.com', password='testpass123', role='USER')
        self.org_user = User.objects.create_user(email='apporg@test.com', password='testpass123', role='ORG')
        self.org = Organization.objects.get(owner_user=self.org_user)
        self.vacancy = Vacancy.objects.create(
            owner_org=self.org, title='Apply Vacancy', position='Dev', is_published=True,
        )

    def test_user_can_apply(self):
        self.client.force_authenticate(user=self.user)
        res = self.client.post(f'/api/vacancies/{self.vacancy.id}/apply/', {'message': 'Hi'})
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    def test_user_cannot_apply_twice(self):
        self.client.force_authenticate(user=self.user)
        self.client.post(f'/api/vacancies/{self.vacancy.id}/apply/', {})
        res = self.client.post(f'/api/vacancies/{self.vacancy.id}/apply/', {})
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_org_cannot_apply(self):
        self.client.force_authenticate(user=self.org_user)
        res = self.client.post(f'/api/vacancies/{self.vacancy.id}/apply/', {})
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_my_applications(self):
        self.client.force_authenticate(user=self.user)
        self.client.post(f'/api/vacancies/{self.vacancy.id}/apply/', {})
        res = self.client.get('/api/my/applications/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_org_sees_applications(self):
        self.client.force_authenticate(user=self.user)
        self.client.post(f'/api/vacancies/{self.vacancy.id}/apply/', {})
        self.client.force_authenticate(user=self.org_user)
        res = self.client.get(f'/api/my/vacancies/{self.vacancy.id}/applications/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_org_update_status(self):
        self.client.force_authenticate(user=self.user)
        apply_res = self.client.post(f'/api/vacancies/{self.vacancy.id}/apply/', {})
        app_id = apply_res.data['id']
        self.client.force_authenticate(user=self.org_user)
        res = self.client.patch(f'/api/applications/{app_id}/status/', {'status': 'ACCEPTED'})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['status'], 'ACCEPTED')

    def test_user_cannot_update_status(self):
        self.client.force_authenticate(user=self.user)
        apply_res = self.client.post(f'/api/vacancies/{self.vacancy.id}/apply/', {})
        app_id = apply_res.data['id']
        res = self.client.patch(f'/api/applications/{app_id}/status/', {'status': 'ACCEPTED'})
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
