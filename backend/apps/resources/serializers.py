# rest-framework
from rest_framework import serializers

# resources
from apps.resources.models import Resource

# courses serializer
from apps.courses.serializers import CourseSerializer

# professor serializer
from apps.professors.serializers import GetProfessorSerializer


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = "__all__"


class GetResourceSerializer(serializers.ModelSerializer):
    course = CourseSerializer()
    professor = GetProfessorSerializer()

    class Meta:
        model = Resource
        fields = "__all__"


class UpdateResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = [
            "pk",
            "course",
            "resource",
            "resource_group",
            "resource_code",
            "modified",
        ]
