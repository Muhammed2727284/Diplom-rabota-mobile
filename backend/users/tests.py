from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import User


class AuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = '/api/auth/register/'
        self.login_url = '/api/auth/login/'

    def test_register_user(self):
        data = {'email': 'user@test.com', 'password': 'testpass123', 'confirm_password': 'testpass123', 'role': 'USER'}
        res = self.client.post(self.register_url, data)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', res.data)
        self.assertIn('refresh', res.data)
        self.assertEqual(res.data['user']['role'], 'USER')

    def test_register_org(self):
        data = {'email': 'org@test.com', 'password': 'testpass123', 'confirm_password': 'testpass123', 'role': 'ORG'}
        res = self.client.post(self.register_url, data)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['user']['role'], 'ORG')

    def test_register_password_mismatch(self):
        data = {'email': 'u@test.com', 'password': 'testpass123', 'confirm_password': 'wrongpass', 'role': 'USER'}
        res = self.client.post(self.register_url, data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_duplicate_email(self):
        data = {'email': 'dup@test.com', 'password': 'testpass123', 'confirm_password': 'testpass123', 'role': 'USER'}
        self.client.post(self.register_url, data)
        res = self.client.post(self.register_url, data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_success(self):
        User.objects.create_user(email='login@test.com', password='testpass123', role='USER')
        res = self.client.post(self.login_url, {'email': 'login@test.com', 'password': 'testpass123'})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('access', res.data)

    def test_login_invalid(self):
        res = self.client.post(self.login_url, {'email': 'no@test.com', 'password': 'wrong'})
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_me_requires_auth(self):
        res = self.client.get('/api/me/')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_authenticated(self):
        user = User.objects.create_user(email='me@test.com', password='testpass123', role='USER')
        self.client.force_authenticate(user=user)
        res = self.client.get('/api/me/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['email'], 'me@test.com')


class PermissionTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email='puser@test.com', password='testpass123', role='USER')
        self.org_user = User.objects.create_user(email='porg@test.com', password='testpass123', role='ORG')

    def test_user_cannot_create_vacancy(self):
        self.client.force_authenticate(user=self.user)
        res = self.client.post('/api/vacancies/create/', {'title': 'Test', 'position': 'Dev'})
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_org_cannot_create_resume(self):
        self.client.force_authenticate(user=self.org_user)
        res = self.client.post('/api/resumes/create/', {'title': 'Test', 'position': 'Dev'})
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_org_can_create_vacancy(self):
        self.client.force_authenticate(user=self.org_user)
        res = self.client.post('/api/vacancies/create/', {'title': 'Dev Job', 'position': 'Developer'})
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    def test_user_can_create_resume(self):
        self.client.force_authenticate(user=self.user)
        res = self.client.post('/api/resumes/create/', {'title': 'My Resume', 'position': 'Developer'})
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    def test_user_profile_access(self):
        self.client.force_authenticate(user=self.user)
        res = self.client.get('/api/me/profile/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_org_organization_access(self):
        self.client.force_authenticate(user=self.org_user)
        res = self.client.get('/api/me/organization/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
