from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import Organization


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_organization(sender, instance, created, **kwargs):
    if created and instance.role == 'ORG':
        Organization.objects.get_or_create(owner_user=instance)
