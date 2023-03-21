# Images
from django.http.response import FileResponse
from .serializers import ImageSerializer
from .models import Image

# rest framwork
from rest_framework.response import Response
from rest_framework.decorators import api_view


@api_view(["GET"])
def images_all(request):
    if request.method == "GET":
        image = Image.objects.all()
        serializer = ImageSerializer(image, many=True)
        return Response(serializer.data)


@api_view(["GET"])
def image_by_csvFile(request, csvFile_id=None):
    if request.method == "GET":
        if csvFile_id:
            images = Image.objects.get(csvFile_id=csvFile_id)

        serializer = ImageSerializer(images, context={"request": request})

        return Response(serializer.data)


@api_view(["GET"])
def imageNumber_by_csvFile(request, csvFile_id=None, number=0):
    if request.method == "GET":
        if csvFile_id:
            if number == 1:
                images = Image.objects.get(csvFile_id=csvFile_id).image1
            if number == 2:
                images = Image.objects.get(csvFile_id=csvFile_id).image2
            if number == 3:
                images = Image.objects.get(csvFile_id=csvFile_id).image3
            if number == 4:
                images = Image.objects.get(csvFile_id=csvFile_id).image4
            if number == 5:
                images = Image.objects.get(csvFile_id=csvFile_id).image5
            if number == 6:
                images = Image.objects.get(csvFile_id=csvFile_id).image6

            imageNumber = open(images, "rb")
            response = FileResponse(imageNumber)

        return response
