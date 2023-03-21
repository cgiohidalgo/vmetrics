from apps.tasks.models import Task
from django.db import models


class Student(models.Model):
    username = models.CharField(max_length=200, unique=True)
    email = models.EmailField(unique=True, blank=True, null=True)
    student_code = models.CharField(max_length=15, unique=True, blank=True, null=True)
    program = models.CharField(max_length=10, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username


class Student_Task(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
