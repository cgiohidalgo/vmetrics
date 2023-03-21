from django.db import models
from apps.files.models import CSVFile
# Create your models here.


class Image(models.Model):
    csvFile_id = models.ForeignKey(
        CSVFile, on_delete=models.CASCADE)
    image1 = models.CharField(
        max_length=200)
    image2 = models.CharField(
        max_length=200)
    image3 = models.CharField(
        max_length=200)
    image4 = models.CharField(
        max_length=200)
    image5 = models.CharField(
        max_length=200)
    image6 = models.CharField(
        max_length=200)

    def __str__(self):
        return self.title
