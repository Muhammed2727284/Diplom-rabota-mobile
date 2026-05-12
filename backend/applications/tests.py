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


class InvitationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email='inviteuser@test.com', password='testpass123', role='USER')
        self.other_user = User.objects.create_user(email='other@test.com', password='testpass123', role='USER')
        self.org_user = User.objects.create_user(email='inviteorg@test.com', password='testpass123', role='ORG')
        self.other_org_user = User.objects.create_user(email='otherorg@test.com', password='testpass123', role='ORG')
        self.org = Organization.objects.get(owner_user=self.org_user)
        self.other_org = Organization.objects.get(owner_user=self.other_org_user)
        self.vacancy = Vacancy.objects.create(
            owner_org=self.org, title='Invite Vacancy', position='Dev', is_published=True,
        )
        self.other_vacancy = Vacancy.objects.create(
            owner_org=self.other_org, title='Other Vacancy', position='Dev', is_published=True,
        )
        self.resume = Resume.objects.create(
            owner_user=self.user, title='My Resume', position='Dev', is_published=True,
        )

    def test_org_can_invite(self):
        self.client.force_authenticate(user=self.org_user)
        res = self.client.post(
            f'/api/resumes/{self.resume.id}/invite/',
            {'vacancy_id': str(self.vacancy.id), 'message': 'Come work with us'},
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['status'], 'SENT')

    def test_org_cannot_invite_twice(self):
        self.client.force_authenticate(user=self.org_user)
        self.client.post(
            f'/api/resumes/{self.resume.id}/invite/',
            {'vacancy_id': str(self.vacancy.id)},
        )
        res = self.client.post(
            f'/api/resumes/{self.resume.id}/invite/',
            {'vacancy_id': str(self.vacancy.id)},
        )
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_org_cannot_invite_with_foreign_vacancy(self):
        self.client.force_authenticate(user=self.org_user)
        res = self.client.post(
            f'/api/resumes/{self.resume.id}/invite/',
            {'vacancy_id': str(self.other_vacancy.id)},
        )
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_cannot_send_invitation(self):
        self.client.force_authenticate(user=self.user)
        res = self.client.post(
            f'/api/resumes/{self.resume.id}/invite/',
            {'vacancy_id': str(self.vacancy.id)},
        )
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_my_invitations_returns_only_mine(self):
        self.client.force_authenticate(user=self.org_user)
        self.client.post(
            f'/api/resumes/{self.resume.id}/invite/',
            {'vacancy_id': str(self.vacancy.id)},
        )
        self.client.force_authenticate(user=self.user)
        res = self.client.get('/api/my/invitations/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data['results']), 1)
        self.assertEqual(str(res.data['results'][0]['vacancy']), str(self.vacancy.id))

    def test_other_user_does_not_see_invitation(self):
        self.client.force_authenticate(user=self.org_user)
        self.client.post(
            f'/api/resumes/{self.resume.id}/invite/',
            {'vacancy_id': str(self.vacancy.id)},
        )
        self.client.force_authenticate(user=self.other_user)
        res = self.client.get('/api/my/invitations/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data['results']), 0)

    def test_org_sees_vacancy_invitations(self):
        self.client.force_authenticate(user=self.org_user)
        self.client.post(
            f'/api/resumes/{self.resume.id}/invite/',
            {'vacancy_id': str(self.vacancy.id)},
        )
        res = self.client.get(f'/api/my/vacancies/{self.vacancy.id}/invitations/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data['results']), 1)

    def test_user_can_accept_invitation(self):
        self.client.force_authenticate(user=self.org_user)
        invite_res = self.client.post(
            f'/api/resumes/{self.resume.id}/invite/',
            {'vacancy_id': str(self.vacancy.id)},
        )
        inv_id = invite_res.data['id']
        self.client.force_authenticate(user=self.user)
        res = self.client.patch(f'/api/invitations/{inv_id}/status/', {'status': 'ACCEPTED'})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['status'], 'ACCEPTED')

    def test_user_can_reject_invitation(self):
        self.client.force_authenticate(user=self.org_user)
        invite_res = self.client.post(
            f'/api/resumes/{self.resume.id}/invite/',
            {'vacancy_id': str(self.vacancy.id)},
        )
        inv_id = invite_res.data['id']
        self.client.force_authenticate(user=self.user)
        res = self.client.patch(f'/api/invitations/{inv_id}/status/', {'status': 'REJECTED'})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['status'], 'REJECTED')

    def test_org_cannot_change_invitation_status(self):
        self.client.force_authenticate(user=self.org_user)
        invite_res = self.client.post(
            f'/api/resumes/{self.resume.id}/invite/',
            {'vacancy_id': str(self.vacancy.id)},
        )
        inv_id = invite_res.data['id']
        res = self.client.patch(f'/api/invitations/{inv_id}/status/', {'status': 'ACCEPTED'})
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_anonymous_cannot_invite(self):
        res = self.client.post(
            f'/api/resumes/{self.resume.id}/invite/',
            {'vacancy_id': str(self.vacancy.id)},
        )
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
