# Django
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

# rest framework
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

# models & serializer
from .models import Input, Language, Metrics
from apps.tasks.models import Task
from apps.students.models import Student
from .serializers import *

# functions
from functions.ExtractMetrics import ExtractMetrics
from functions.Emails import Email

from django.db.utils import IntegrityError
from django.db.models import F


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def input_list(request):
    """List inputs, or create a new input"""

    if request.method == "GET":
        data = []
        nextPage = 1
        previousPage = 1

        inputs = Input.objects.filter(is_active=1)
        page = request.GET.get("page", 1)
        paginator = Paginator(inputs, 10)

        try:
            data = paginator.page(page)
        except PageNotAnInteger:
            data = paginator.page(1)
        except EmptyPage:
            data = paginator.page(paginator.num_pages)

        serializer = GetInputSerializarer(data, context={"request": request}, many=True)

        if data.has_next():
            nextPage = data.next_page_number()

        if data.has_previous():
            previousPage = data.previous_page_number()

        return Response(
            {
                "data": serializer.data,
                "count": paginator.count,
                "numpages": paginator.num_pages,
                "nextlink": "/api/input/?page=" + str(nextPage),
                "prevlink": "/api/input/?page=" + str(previousPage),
            }
        )

    if request.method == "POST":
        serializer = InputsSerializer(data=request.data)

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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def input_by_task(request, taskid):
    """List inputs by specific task."""
    try:
        task = Task.objects.get(id=taskid, is_active=True)
    except:
        pass

    inputs = Input.objects.filter(task=task.id)

    input_serializer = GetInputSerializarer(
        inputs, context={"request": request}, many=True
    )

    return Response(input_serializer.data, status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def input_detail(request, id):
    """
    Retrieve, update or delete a input by id/pk.
    """
    try:
        input_ = Input.objects.get(_id=id)
    except Input.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = GetInputSerializarer(input_, context={"request": request})
        return Response(status=status.HTTP_200_OK, data=serializer.data)

    # if request.method == "PUT":
    #     serializer = InputsSerializer(
    #         input_, data=request.data, context={"request": request}
    #     )

    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(status=status.HTTP_200_OK, data=serializer.data)

    #     return Response(
    #         {
    #             "detail": serializer.errors,
    #             "data": "Ha ocurrido un error, por favor revise los datos.",
    #         },
    #         status=status.HTTP_400_BAD_REQUEST,
    #     )


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def language_list(request):
    if request.method == "GET":
        languages = Language.objects.filter(is_active=True)
        lang_serializer = LanguageSerializer(
            languages, context={"request": request}, many=True
        )
        return Response(lang_serializer.data, status.HTTP_200_OK)

    if request.method == "POST":
        serializer = LanguageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status.HTTP_201_CREATED)
        else:
            return Response(
                {
                    "detail": serializer.errors,
                    "data": "Ha ocurrido un error, por favor revise los datos.",
                },
                status.HTTP_400_BAD_REQUEST,
            )

    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_input_metrics(request, professor_id):
    if request.method == "GET":
        tasks = (
            Metrics.objects.filter(
                input__task__resource__professor_id=professor_id,
                input__task__is_active=True,
            )
            .annotate(
                activity=F("input__task__taskid"), activity_id=F("input__task__id")
            )
            .values("activity", "activity_id", "extension", "extension__name")
            .distinct()
        )

        return Response(tasks, status.HTTP_200_OK)

    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def metrics_by_task(request, taskid):

    if request.method == "GET":
        try:
            language = request.GET.get("language")
            Language.objects.get(extension=language, is_active=True)
            metrics_query = Metrics.objects.filter(
                input__task_id=taskid,
                input__task__is_active=True,
                extension=language,
                is_active=True,
            )
        except Language.DoesNotExist:
            return Response(
                {"data": "No hay resultados con el lenguaje enviado."},
                status.HTTP_400_BAD_REQUEST,
            )
        except KeyError:
            return Response(
                {
                    "data": "Debe indicar el lenguaje con el que será evaluado el código."
                },
                status.HTTP_400_BAD_REQUEST,
            )

        metrics_Serializer = GetMetricsSerializer(
            metrics_query, context={"request": request}, many=True
        )
        return Response(metrics_Serializer.data, status.HTTP_200_OK)

    if request.method == "POST":

        try:
            language = request.data["language"]
            Language.objects.get(extension=language)
            metrics_query = Metrics.objects.filter(
                input__task_id=taskid, extension=language, is_active=True
            )
        except Language.DoesNotExist:
            return Response(
                {"data": "No hay resultados con el lenguaje enviado."},
                status.HTTP_400_BAD_REQUEST,
            )
        except KeyError:
            return Response(
                {
                    "data": "Debe indicar el lenguaje con el que será evaluado el código."
                },
                status.HTTP_400_BAD_REQUEST,
            )

        try:
            input_query = Input.objects.filter(task_id=taskid, is_active=True)
            task = Task.objects.get(id=taskid)

        except Task.DoesNotExist:
            return Response(
                {"data": "No existe la actividad consultada."},
                status.HTTP_404_NOT_FOUND,
            )

        # to save existing metrics to avoid extracting them again
        existing_metrics = []
        for metric in metrics_query:
            existing_metrics.append(metric.input_id)

        # to save possible errors that occur during execution
        metrics_errors = []
        for i in input_query.exclude(pk__in=existing_metrics):
            metrics_obj = ExtractMetrics(language, i.pk)
            result = metrics_obj.get_metrics(i.source_code)
            if result["status"]:
                data = result["data"]
                try:
                    metrics_serializer = MetricSerializer(data=data)
                    if metrics_serializer.is_valid():
                        metrics_serializer.save()
                    else:
                        metrics_errors.append(
                            {
                                "input": i.pk,
                                "source_code": i.source_code,
                                "error": metrics_serializer.errors,
                            }
                        )
                except Exception as e:
                    metrics_errors.append(
                        {
                            "input": i.pk,
                            "source_code": i.source_code,
                            "error": result["data"],
                        }
                    )
            else:
                metrics_errors.append(
                    {
                        "input": i.pk,
                        "source_code": i.source_code,
                        "error": result["data"],
                    }
                )

        task.is_upload = True
        task.save()
        sending_email = Email(
            "INGInious-metrics",
            "Se han cargado al sistema las métricas de los códigos fuente pertenecientes a la tarea "
            + str(task.taskid),
            [request.user.email],
        )
        if metrics_errors:

            sending_email.send_django_mail()
            return Response(
                {
                    "data": "Algunos códigos no pudieron ser evaluados por la plataforma.",
                    "errors": metrics_errors,
                },
                status.HTTP_201_CREATED,
            )

        sending_email.send_django_mail()
        return Response(
            {
                "data": "Códigos evaluados correctamente",
            },
            status.HTTP_201_CREATED,
        )
    return Response(status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def metrics_by_source_code(request, input_id):

    try:
        language = request.GET.get("language")
        Language.objects.get(pk=language)
        input_query = Input.objects.get(_id=input_id, is_active=True)
    except Input.DoesNotExist:
        return Response(
            {"data": "El código ingresado no existe."}, status.HTTP_404_NOT_FOUND
        )
    except Language.DoesNotExist:
        return Response(
            {"data": "No hay resultados con el lenguaje enviado."},
            status.HTTP_400_BAD_REQUEST,
        )
    except TypeError:
        return Response(
            {"data": "Debe indicar el lenguaje con el que será evaluado el código."},
            status.HTTP_400_BAD_REQUEST,
        )

    if request.method == "GET":
        try:
            metrics_query = Metrics.objects.get(
                input=input_query.pk, extension=language, is_active=True
            )
            metrics_serializer = GetMetricsSerializer(metrics_query)
            return Response({"data": metrics_serializer.data}, status.HTTP_200_OK)
        except Metrics.DoesNotExist:
            return Response(
                {"data": "El código ingresado aún no ha sido evaluado por el docente."},
                status=status.HTTP_404_NOT_FOUND,
            )

    if request.method == "POST":

        try:
            language = request.data["language"]
            Language.objects.get(extension=language, is_active=True)
        except KeyError:
            return Response(
                {
                    "data": "Debe indicar el lenguaje con el que será evaluado el código."
                },
                status.HTTP_400_BAD_REQUEST,
            )
        except Language.DoesNotExist:
            return Response(
                {
                    "data": "El lenguaje indicado no está permitido o se encuentra deshabilitado."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        metrics_obj = ExtractMetrics(language, input_query.pk)
        result = metrics_obj.get_metrics(input_query.source_code)
        if result["status"]:
            data = result["data"]
            try:
                metrics_serializer = MetricSerializer(data=data)
                if metrics_serializer.is_valid():
                    metrics_serializer.save()
                    return Response(
                        data={"data": metrics_serializer.data},
                        status=status.HTTP_201_CREATED,
                    )
                else:
                    return Response(
                        metrics_serializer.errors, status.HTTP_400_BAD_REQUEST
                    )

            except IntegrityError as e:
                print(e)
                return Response(metrics_serializer.errors, status.HTTP_400_BAD_REQUEST)

        return Response(
            {"data": "El código ingresado no es apto para ser evaluado."},
            status.HTTP_400_BAD_REQUEST,
        )


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def metrics_by_student(request, student_id):

    try:
        student = Student.objects.get(id=student_id, is_active=True)
    except Student.DoesNotExist:
        return Response(
            {"data": "El estudiante consultado no existe o está inhabilitado."},
            status=status.HTTP_404_NOT_FOUND,
        )

    metrics_query = Metrics.objects.filter(
        input__student_id=student_id, is_active=True
    ).distinct()

    if request.method == "GET":

        metrics_Serializer = GetMetricsSerializer(
            metrics_query, context={"request": request}, many=True
        )
        return Response({"data": metrics_Serializer.data}, status.HTTP_200_OK)

    if request.method == "POST":
        try:
            language = request.data["language"]
            input_query = Input.objects.filter(student_id=student_id, is_active=True)
        except KeyError:
            return Response(
                {
                    "data": "Debe indicar el lenguaje con el que será evaluado el código."
                },
                status.HTTP_400_BAD_REQUEST,
            )

        # to save existing metrics to avoid extracting them again
        existing_metrics = []
        for metric in metrics_query:
            existing_metrics.append(metric.input_id)

        # to save possible errors that occur during execution
        metrics_errors = []
        for i in input_query.exclude(pk__in=existing_metrics):
            metrics_obj = ExtractMetrics(language, i.pk)
            result = metrics_obj.get_metrics(i.source_code)
            if result["status"]:
                data = result["data"]
                try:
                    metrics_serializer = MetricSerializer(data=data)
                    if metrics_serializer.is_valid():
                        metrics_serializer.save()
                except:
                    metrics_errors.append(
                        {
                            "input": i.pk,
                            "source_code": i.source_code,
                            "error": result["data"],
                        }
                    )
            else:
                metrics_errors.append(
                    {
                        "input": i.pk,
                        "source_code": i.source_code,
                        "error": result["data"],
                    }
                )

        # print(len(metrics_errors))
        sending_email = Email(
            "INGInious-metrics",
            "Ya se cargaron las métricas del estudiante " + str(student.username),
            [request.user.email],
        )
        if metrics_errors:
            sending_email.send_django_mail()
            return Response(
                {
                    "data": "Algunos códigos no pudieron ser evaluados por la plataforma.",
                    "errors": metrics_errors,
                },
                status.HTTP_201_CREATED,
            )

        sending_email.send_django_mail()
        return Response(
            {
                "data": "Códigos evaluados correctamente",
            },
            status.HTTP_201_CREATED,
        )

    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
