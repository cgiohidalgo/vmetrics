# Django
from django.db import models

# Models
from apps.courses.models import Course
from apps.professors.models import Professor

# Create your models here.
class Resource(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    resource_name = models.CharField(max_length=21, unique=True)
    professor = models.ForeignKey(Professor, on_delete=models.CASCADE)
    resource_group = models.CharField(max_length=15, blank=True, null=True)
    resource_code = models.CharField(max_length=15, unique=True, null=True)
    is_active = models.BooleanField(default=True)
    created = models.DateTimeField(auto_now_add=True, editable=False)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.resource_name
