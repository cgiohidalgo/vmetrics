# professor
from apps.professors.models import Professor

# rest framework
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# exceptions
from django.core.exceptions import ObjectDoesNotExist


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super(MyTokenObtainPairSerializer, cls).get_token(user)

        # custom claims
        try:
            professor = Professor.objects.get(user_id=user.id, user__is_active=True)
        except ObjectDoesNotExist:
            token["username"] = user.username
            token["email"] = user.email
            token["role"] = "admin"
            return token

        token["id"] = professor.pk
        token["username"] = user.username
        token["email"] = user.email
        token["role"] = "professor"
        return token
