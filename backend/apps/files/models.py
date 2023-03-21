# Django
from apps.resources.models import Resource
from django.db import models
from apps.professors.models import Professor


class File(models.Model):
    resource = models.ForeignKey(
        Resource, on_delete=models.CASCADE, blank=True, null=True
    )
    title = models.CharField(max_length=100)
    file = models.FileField(upload_to="media")
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class CSVFile(models.Model):
    professor = models.ForeignKey(Professor, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    file = models.FileField(upload_to="csv")
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
