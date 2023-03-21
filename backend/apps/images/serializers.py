from rest_framework import serializers
from .models import Image


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = [
            "csvFile_id",
            "image1",
            "image2",
            "image3",
            "image4",
            "image5",
            "image6",
        ]
