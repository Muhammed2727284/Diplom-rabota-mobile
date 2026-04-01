from rest_framework import serializers
from .models import Organization


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = [
            'id', 'name', 'description', 'city', 'address',
            'phone', 'website', 'updated_at',
        ]
        read_only_fields = ['id', 'updated_at']
