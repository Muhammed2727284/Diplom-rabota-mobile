import uuid
from django.db import models
from django.conf import settings
from vacancies.models import Vacancy
from resumes.models import Resume


class Application(models.Model):
    STATUS_CHOICES = [
        ('SENT', 'Sent'),
        ('VIEWED', 'Viewed'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vacancy = models.ForeignKey(Vacancy, on_delete=models.CASCADE, related_name='applications')
    applicant_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='applications',
    )
    resume = models.ForeignKey(Resume, on_delete=models.SET_NULL, null=True, blank=True, related_name='applications')
    message = models.TextField(blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='SENT')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['vacancy', 'applicant_user'],
                name='unique_vacancy_applicant',
            ),
        ]
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.applicant_user.email} -> {self.vacancy.title}'
