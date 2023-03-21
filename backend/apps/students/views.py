# Django
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

# rest framework
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

# models
from apps.students.models import Student
from apps.resources.models import Resource
from apps.professors.models import Professor

from .serializers import *

# email
from functions.Emails import Email


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def student_list(request):
    if request.method == "GET":

        students = Student.objects.filter(is_active=True)

        serializer = StudentSerializer(
            students, context={"request": request}, many=True
        )

        return Response({"data": serializer.data}, status.HTTP_200_OK)

    if request.method == "POST":
        serializer = StudentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED, data=serializer.data)

        return Response(
            {
                "detail": serializer.errors,
                "data": "Ha ocurrido un error, por favor revise los datos.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def student_detail(request, id):
    """
    Retrieve, update or delete a student by id/pk.
    """
    try:
        student = Student.objects.get(pk=id, is_active=True)
    except Student.DoesNotExist as e:
        return Response(status=status.HTTP_404_NOT_FOUND, data=e.errors)

    if request.method == "GET":
        serializer = StudentSerializer(student, context={"request": request})
        return Response(status=status.HTTP_200_OK, data=serializer.data)

    if request.method == "PUT":
        serializer = StudentSerializer(
            student, data=request.data, context={"request": request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT, data=serializer.data)

        return Response(
            {
                "detail": serializer.errors,
                "data": "Ha ocurrido un error, por favor revise los datos.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def student_by_resource(request, resourceId):
    """
    Retrieve, update or delete a student by id/pk.
    """
    try:
        Resource.objects.get(pk=resourceId)
    except Resource.DoesNotExist as e:
        return Response(
            {"data": "El recurso no existe o está inhabilitado."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if request.method == "GET":

        students = Student.objects.filter(
            student_task__task__resource__id=resourceId,
            student_task__task__resource__is_active=True,
            is_active=True,
        )
        serializer = StudentSerializer(
            students, context={"request": request}, many=True
        )

        return Response(serializer.data, status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def student_by_professor(request, professorId):
    """
    Retrieve, update or delete a student by id/pk.
    """

    try:
        Professor.objects.get(pk=professorId)
    except Professor.DoesNotExist as e:
        return Response(
            status=status.HTTP_404_NOT_FOUND,
            data={"data": "El profesor no existe o está inhabilitado."},
        )

    if request.method == "GET":

        students = Student.objects.filter(
            student_task__task__resource__professor__pk=professorId,
            student_task__task__resource__professor__user__is_active=True,
        ).distinct()
        serializer = StudentSerializer(
            students, context={"request": request}, many=True
        )

        return Response(serializer.data, status.HTTP_200_OK)
