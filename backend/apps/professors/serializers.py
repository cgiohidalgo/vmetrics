# Django
from django.contrib.auth.models import User
from django.db.models import fields

# rest framework
from rest_framework import serializers

# professors
from .models import Professor


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class GetUserSerializar(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "username",
            "first_name",
            "last_name",
            "email",
            "last_login",
            "is_superuser",
            "is_staff",
            "is_active",
            "date_joined",
        ]


class GetProfessorSerializer(serializers.ModelSerializer):
    user = GetUserSerializar()

    class Meta:
        model = Professor
        fields = ["pk", "user", "code", "city", "created", "modified"]


class ProfessorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Professor
        fields = ["pk", "user", "code", "city", "created", "modified"]


class UpdateProfessorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Professor
        fields = ["city"]


class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email"]


class ChangePasswordSerializer(serializers.Serializer):
    model = User

    """
    Serializer for password change endpoint.
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
