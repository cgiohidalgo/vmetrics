# Django
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

# rest framework
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

# inputs
from .models import Task
from .serializers import *


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def task_list(request):
    if request.method == "GET":
        data = []
        nextPage = 1
        previousPage = 1
        tasks = Task.objects.filter(is_active=True).order_by("-created")
        page = request.GET.get("page", 1)
        paginator = Paginator(tasks, 10)

        try:
            data = paginator.page(page)
        except PageNotAnInteger:
            data = paginator.page(1)
        except EmptyPage:
            data = paginator.page(paginator.num_pages)

        serializer = GetTaskSerializer(data, context={"request": request}, many=True)

        if data.has_next():
            nextPage = data.next_page_number()

        if data.has_previous():
            previousPage = data.previous_page_number()

        return Response(
            {
                "data": serializer.data,
                "count": paginator.count,
                "numpages": paginator.num_pages,
                "nextlink": "?page=" + str(nextPage),
                "prevlink": "?page=" + str(previousPage),
            }
        )

    if request.method == "POST":
        serializer = TaskSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            newTask = Task.objects.get(pk=serializer.data["pk"])
            return Response(
                status=status.HTTP_201_CREATED,
                data=GetTaskSerializer(newTask, context={"request": request}).data,
            )

        return Response(
            {
                "detail": serializer.errors,
                "data": "Ha ocurrido un error, por favor revise los datos.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def task_detail(request, task_id):
    """
    Retrieve, update or delete a task by taskid/pk.
    """
    try:
        task = Task.objects.get(pk=task_id, is_active=True)
    except Task.DoesNotExist:
        return Response(
            {"data": "La actividad no existe o está deshabilitada."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if request.method == "GET":
        serializer = GetTaskSerializer(task, context={"request": request})
        return Response(status=status.HTTP_200_OK, data=serializer.data)

    if request.method == "PUT":
        serializer = UpdateTaskSerializer(
            task, data=request.data, context={"request": request}, partial=True
        )

        if serializer.is_valid():
            serializer.save()
            task = Task.objects.get(pk=task_id)

            return Response(
                status=status.HTTP_204_NO_CONTENT,
                data=GetTaskSerializer(task, context={"request": request}).data,
            )

        return Response(
            {
                "detail": serializer.errors,
                "data": "Ha ocurrido un error, por favor revise los datos.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def task_by_professor(request, professor_id):
    """
    Retrieve tasks by professor_id.
    """
    try:
        tasks = Task.objects.filter(
            resource__professor__pk=professor_id,
            resource__professor__user__is_active=True,
            resource__is_active=True,
            is_active=True,
        ).order_by("-created")
    except Exception as e:
        print(e)
        return Response("Ha ocurrido un error inesperado.", status.HTTP_400_BAD_REQUEST)

    serializer = GetTaskSerializer(tasks, context={"request": request}, many=True)

    return Response(serializer.data, status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def task_by_resource(request, resource_id):
    """
    Retrieve tasks by resource_id.
    """
    try:
        tasks = Task.objects.filter(
            resource__id=resource_id, resource__is_active=True, is_active=True
        ).order_by("-created")
    except Exception:
        return Response("Ha ocurrido un error inesperado.", status.HTTP_400_BAD_REQUEST)

    serializer = GetTaskSerializer(tasks, context={"request": request}, many=True)

    return Response(serializer.data, status.HTTP_200_OK)
