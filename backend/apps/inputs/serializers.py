# rest-framework
from rest_framework import serializers

# models
from .models import Input, Language, Metrics

# student serializer
from apps.students.serializers import StudentSerializer


class InputsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Input
        fields = "__all__"


class GetInputSerializarer(serializers.ModelSerializer):
    student = StudentSerializer()

    class Meta:
        model = Input
        fields = "__all__"


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = "__all__"


class MetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = Metrics
        fields = "__all__"


class GetMetricsSerializer(serializers.ModelSerializer):
    input = GetInputSerializarer()
    extension = LanguageSerializer()

    class Meta:
        model = Metrics
        fields = "__all__"
