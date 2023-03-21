# rest framework
from rest_framework import serializers

# files
from .models import File, CSVFile


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = "__all__"


class GetFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = "__all__"


class CSVFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CSVFile
        fields = "__all__"
