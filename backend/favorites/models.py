import uuid
from django.db import models
from django.conf import settings
from vacancies.models import Vacancy
from resumes.models import Resume


class Favorite(models.Model):
    TARGET_TYPE_CHOICES = [
        ('VACANCY', 'Vacancy'),
        ('RESUME', 'Resume'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorites')
    target_type = models.CharField(max_length=10, choices=TARGET_TYPE_CHOICES)
    vacancy = models.ForeignKey(Vacancy, on_delete=models.CASCADE, null=True, blank=True, related_name='favorited_by')
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, null=True, blank=True, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'vacancy'],
                condition=models.Q(vacancy__isnull=False),
                name='unique_user_vacancy_favorite',
            ),
            models.UniqueConstraint(
                fields=['user', 'resume'],
                condition=models.Q(resume__isnull=False),
                name='unique_user_resume_favorite',
            ),
        ]
        ordering = ['-created_at']

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.target_type == 'VACANCY' and not self.vacancy:
            raise ValidationError('Vacancy must be set for VACANCY target type.')
        if self.target_type == 'RESUME' and not self.resume:
            raise ValidationError('Resume must be set for RESUME target type.')

    def __str__(self):
        target = self.vacancy or self.resume
        return f'{self.user.email} -> {self.target_type}: {target}'
