from rest_framework import serializers

from .models import Task

# resource
from apps.resources.serializers import GetResourceSerializer


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            "pk",
            "resource",
            "name",
            "taskid",
            "description",
            "is_upload",
            "created",
            "modified",
        ]


class GetTaskSerializer(serializers.ModelSerializer):
    resource = GetResourceSerializer()

    class Meta:
        model = Task
        fields = [
            "pk",
            "resource",
            "name",
            "taskid",
            "description",
            "is_upload",
            "created",
            "modified",
        ]


class UpdateTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            "pk",
            "resource",
            "name",
            "taskid",
            "description",
            "is_upload",
            "created",
            "modified",
        ]
