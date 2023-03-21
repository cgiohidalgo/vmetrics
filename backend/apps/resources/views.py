# models
from apps.professors.models import Professor
from apps.tasks.models import Task
from apps.inputs.models import Input
from apps.resources.models import Resource

# serializers
from apps.resources.serializers import (
    GetResourceSerializer,
    ResourceSerializer,
    UpdateResourceSerializer,
)

# rest framwork
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

# django models
from django.db.models import Count, F


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def resource_list(request):
    if request.method == "GET":
        """List of resources or create new resource"""
        resources = Resource.objects.filter(is_active=1).order_by("-created")

        serializer = GetResourceSerializer(
            resources, context={"request": request}, many=True
        )
        return Response({"data": serializer.data}, status.HTTP_200_OK)

    if request.method == "POST":

        serializer = ResourceSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            res = Resource.objects.get(pk=serializer.data["id"])
            return Response(
                GetResourceSerializer(res, context={"request": request}).data,
                status.HTTP_201_CREATED,
            )

        return Response(
            {
                "detail": serializer.errors,
                "data": "Ya existe un curso con ese nombre.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def resource_detail(request, id):
    """
    Retrieve, update or delete a course by id/pk.
    """
    try:
        resource = Resource.objects.get(id=id, is_active=True)
    except Resource.DoesNotExist:
        return Response(
            {
                "data": "El curso al que desea crear el recurso no existe o está deshabilitado"
            },
            status.HTTP_404_NOT_FOUND,
        )

    if request.method == "GET":
        serializer = GetResourceSerializer(resource, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == "PUT":
        serializer = UpdateResourceSerializer(
            resource, request.data, context={"request": request}, partial=True
        )

        if serializer.is_valid():
            serializer.save()
            resource = Resource.objects.get(id=id, is_active=True)

            return Response(
                status=status.HTTP_200_OK,
                data=GetResourceSerializer(resource, context={"request": request}).data,
            )

    if request.method == "DELETE":
        resource.is_active = 0
        resource.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    return Response(
        {
            "detail": serializer.errors,
            "data": "Ha ocurrido un error, por favor revise los datos.",
        },
        status.HTTP_400_BAD_REQUEST,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def resource_by_professor(request, id):

    try:
        Professor.objects.get(pk=id, user__is_active=1)
        resources = Resource.objects.filter(
            is_active=True,
            professor__pk=id,
            professor__user__is_active=True,
        ).order_by("-created")
    except Professor.DoesNotExist:
        return Response(
            {"data": "El profesor buscado no existe o se encuentra inhabilitado"},
            status.HTTP_404_NOT_FOUND,
        )
    except Resource.DoesNotExist:
        return Response(
            {"data": "El curso buscado no existe o se encuentra inhabilitado"},
            status.HTTP_404_NOT_FOUND,
        )

    if request.method == "GET":
        serializer = GetResourceSerializer(
            resources, context={"request": request}, many=True
        )
        return Response(serializer.data, status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def tasks_by_courses(request, id):
    try:
        Professor.objects.get(pk=id)
    except:
        return Response(
            {"data": "No hay datos para mostrar"},
            status.HTTP_404_NOT_FOUND,
        )
    if request.method == "GET":
        query = (
            Task.objects.filter(resource__professor__id=id, resource__is_active=True)
            .annotate(res_name=F("resource__resource_name"))
            .values("res_name")
            .annotate(total_tasks=Count("id"))
        )

        return Response(query, status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def total_results(request, id):
    try:
        Professor.objects.get(pk=id)
    except:
        return Response(
            {"data": "No hay datos para mostrar"},
            status.HTTP_404_NOT_FOUND,
        )
    if request.method == "GET":
        query = (
            Input.objects.filter(
                task__resource__professor_id=id, task__resource__is_active=True
            )
            .values("result")
            .annotate(total=Count("result"))
        )

        return Response(query, status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def total_results_by_courses(request, id):
    try:
        Professor.objects.get(pk=id)
    except:
        return Response(
            {"data": "No hay datos para mostrar"},
            status.HTTP_404_NOT_FOUND,
        )
    if request.method == "GET":

        query = (
            Input.objects.filter(
                task__resource__professor_id=id, task__resource__is_active=True
            )
            .annotate(res_name=F("task__resource__resource_name"))
            .values("res_name", "result")
            .annotate(total=Count("result"))
            .order_by("-res_name", "-result")
        )

        return Response(query, status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def tasks_failed(request, id):
    try:
        Professor.objects.get(pk=id)
    except:
        return Response(
            {"data": "No hay datos para mostrar"},
            status.HTTP_404_NOT_FOUND,
        )
    if request.method == "GET":
        query = (
            Input.objects.filter(
                task__resource__professor__id=id, task__resource__is_active=True
            )
            .values("taskid", "result")
            .annotate(fails=Count("result"))
            .exclude(result="success")
            .order_by("-fails")[:10]
        )

        return Response(query, status.HTTP_200_OK)
