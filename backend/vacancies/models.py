import uuid
from django.db import models
from organizations.models import Organization


class Vacancy(models.Model):
    EMPLOYMENT_TYPE_CHOICES = [
        ('FULL_TIME', 'Full Time'),
        ('PART_TIME', 'Part Time'),
        ('CONTRACT', 'Contract'),
        ('INTERN', 'Intern'),
    ]
    WORK_FORMAT_CHOICES = [
        ('OFFICE', 'Office'),
        ('REMOTE', 'Remote'),
        ('HYBRID', 'Hybrid'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner_org = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='vacancies')
    title = models.CharField(max_length=255)
    position = models.CharField(max_length=255)
    city = models.CharField(max_length=100, blank=True, default='')
    salary_from = models.PositiveIntegerField(null=True, blank=True)
    salary_to = models.PositiveIntegerField(null=True, blank=True)
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPE_CHOICES, default='FULL_TIME')
    work_format = models.CharField(max_length=20, choices=WORK_FORMAT_CHOICES, default='OFFICE')
    description = models.TextField(blank=True, default='')
    requirements = models.TextField(blank=True, default='')
    conditions = models.TextField(blank=True, default='')
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'vacancies'

    def __str__(self):
        return self.title
