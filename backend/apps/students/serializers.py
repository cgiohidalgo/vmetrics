from rest_framework import serializers
from .models import Student, Student_Task


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = [
            "pk",
            "username",
            "email",
            "student_code",
            "program",
            "created",
            "modified",
        ]


class StudentTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student_Task
        fields = "__all__"
