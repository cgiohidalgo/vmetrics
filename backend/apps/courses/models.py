from apps.professors.models import Professor
from django.db import models


class Course(models.Model):

    name = models.CharField(max_length=50, unique=True)
    short_name = models.CharField(max_length=5, unique=True, null=True)
    code = models.CharField(max_length=15, unique=True, null=True)
    is_active = models.BooleanField(default=True)
    created = models.DateTimeField(auto_now_add=True, editable=False)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
