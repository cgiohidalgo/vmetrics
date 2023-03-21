from apps.resources.models import Resource
from django.db import models


class Task(models.Model):
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, blank=True)
    taskid = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    is_upload = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
