# Django
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

# rest framwork
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

# courses
from .models import Course
from .serializers import *


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def course_list(request):
    if request.method == "GET":
        try:
            course = Course.objects.filter(is_active=1).order_by("-created")
        except Course.DoesNotExist:
            return Response(
                {"data": "El curso buscado no existe o se encuentra inhabilitado"},
                status.HTTP_404_NOT_FOUND,
            )

        serializer = CourseSerializer(course, context={"request": request}, many=True)

        return Response(serializer.data, status.HTTP_200_OK)

    if request.method == "POST":

        serializer = CourseSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status.HTTP_201_CREATED)

        error_response = {
            "detail": "Por favor revise los datos.",
            "data": serializer.errors,
        }
        return Response(error_response, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def course_detail(request, id):
    """
    Retrieve, update or delete a course by id/pk.
    """
    try:
        course = Course.objects.get(id=id)
    except Course.DoesNotExist:
        return Response(
            {"detail": "No se encontraron resultados"}, status.HTTP_404_NOT_FOUND
        )

    if request.method == "GET":
        serializer = CourseSerializer(course, context={"request": request})
        return Response(serializer.data, status.HTTP_200_OK)

    if request.method == "PUT":
        serializer = CourseSerializer(
            course, data=request.data, context={"request": request}, partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status.HTTP_200_OK)

    if request.method == "DELETE":
        course.is_active = 0
        course.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    error_response = {
        "detail": "Por favor revise los datos.",
        "data": serializer.errors,
    }
    return Response(error_response, status.HTTP_400_BAD_REQUEST)
