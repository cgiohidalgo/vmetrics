# Django
from django.db.models.fields import DateTimeField
from django.db import models

# models
from apps.students.models import Student
from apps.tasks.models import Task


class Input(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    _id = models.CharField(max_length=100, unique=True)
    courseid = models.CharField(max_length=100)
    taskid = models.CharField(max_length=100)
    grade = models.DecimalField(max_digits=5, decimal_places=1)
    result = models.CharField(max_length=50)
    submitted_on = DateTimeField()
    source_code = models.TextField()
    is_active = models.BooleanField(default=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self._id


class Language(models.Model):
    name = models.CharField(max_length=20, blank=False)
    extension = models.CharField(max_length=4, blank=False, primary_key=True)
    is_active = models.BooleanField(default=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self._input


class Metrics(models.Model):
    input = models.ForeignKey(Input, on_delete=models.CASCADE)
    extension = models.ForeignKey(Language, on_delete=models.CASCADE)
    comment_ratio = models.DecimalField(max_digits=28, decimal_places=20)
    cyclomatic_complexity = models.IntegerField()
    fanout_external = models.IntegerField()
    fanout_internal = models.IntegerField()
    halstead_bugprop = models.DecimalField(max_digits=28, decimal_places=20)
    halstead_difficulty = models.DecimalField(max_digits=28, decimal_places=20)
    halstead_effort = models.DecimalField(max_digits=28, decimal_places=20)
    halstead_timerequired = models.DecimalField(max_digits=28, decimal_places=20)
    halstead_volume = models.DecimalField(max_digits=28, decimal_places=20)
    loc = models.IntegerField()
    maintainability_index = models.DecimalField(max_digits=28, decimal_places=20)
    operands_sum = models.IntegerField()
    operands_uniq = models.IntegerField()
    operators_sum = models.IntegerField()
    operators_uniq = models.IntegerField()
    pylint = models.DecimalField(max_digits=28, decimal_places=20)
    tiobe = models.DecimalField(max_digits=28, decimal_places=20)
    tiobe_compiler = models.DecimalField(max_digits=28, decimal_places=20)
    tiobe_complexity = models.DecimalField(max_digits=28, decimal_places=20)
    tiobe_coverage = models.DecimalField(max_digits=28, decimal_places=20)
    tiobe_duplication = models.DecimalField(max_digits=28, decimal_places=20)
    tiobe_fanout = models.DecimalField(max_digits=28, decimal_places=20)
    tiobe_functional = models.DecimalField(max_digits=28, decimal_places=20)
    tiobe_security = models.DecimalField(max_digits=28, decimal_places=20)
    tiobe_standard = models.DecimalField(max_digits=28, decimal_places=20)
    is_active = models.BooleanField(default=True)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("input", "extension")

    def __str__(self):
        return str(self.input)
