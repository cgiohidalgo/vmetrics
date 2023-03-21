# rest framework
from rest_framework.views import APIView
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework import status

# Resource model
from apps.resources.models import Resource

# Files
from .serializers import *
from .models import File

# functions
from functions.Unlock import Unlock
from functions.UploadSubmission import UploadSubmission
from functions.ml.MachineLearning import MachineLearning
from functions.Emails import Email

# REST framework
from rest_framework.permissions import IsAuthenticated


class FileView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        files = File.objects.all()
        serializer = FileSerializer(files, many=True)
        return Response(serializer.data, status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):

        file_serializer = FileSerializer(data=request.data)
        if file_serializer.is_valid():
            file_serializer.save()
            pathName = file_serializer.data["file"]  # /media/media/<file-name>.tgz
            name = pathName[13:]  # <file-name>.tgz
            result = extract_info(pathName, name[:-4])
            if result["status"] == True:

                newResource = Resource.objects.get(resource_name=result["resource"])

                file = File.objects.get(pk=file_serializer.data["id"])
                file.resource = newResource
                file.save()
                sending_email = Email(
                    "INGInious-Tareas",
                    "Se han cargado al sistema las actividades pertenecientes al recurso "
                    + str(newResource.resource_name),
                    [request.user.email],
                )
                sending_email.send_django_mail()
                return Response(result, status.HTTP_201_CREATED)
            else:
                return Response({"data": result["data"]}, status.HTTP_400_BAD_REQUEST)
        else:
            return Response(
                {
                    "detail": file_serializer.errors,
                    "data": "Ha ocurrido un error, por favor revise los datos.",
                },
                status.HTTP_400_BAD_REQUEST,
            )


class CSVFileView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        files = CSVFile.objects.all()
        serializer = CSVFileSerializer(files, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        try:
            file_serializer = CSVFileSerializer(data=request.data)
            if file_serializer.is_valid():
                file_serializer.save()
                # /media/media/csv/<name>.csv
                pathName = file_serializer.data["file"]
                # <name>.csv
                # name = pathName[17:]
                m_learning, obj = extract_csvInfo(
                    pathName, file_serializer.data["id"], request.data["check"]
                )

                if not m_learning:
                    info = file_serializer.data
                    info["email"] = obj.emailList
                    info["media"] = obj.meanList
                    info["accuracyDT"] = obj.accDT
                    info["accuracyKNN"] = obj.accKNN
                    info["accuracyNB"] = obj.accNB
                    info["accuracySVM"] = obj.accSVM
                    info["rocDT"] = obj.rocDT
                    info["rocKNN"] = obj.rocKNN
                    info["rocNB"] = obj.rocNB
                    info["rocSVM"] = obj.rocSVM
                    info["matrixDT"] = obj.matrixInfoDT.values()
                    info["matrixKNN"] = obj.matrixInfoKNN.values()
                    info["matrixNB"] = obj.matrixInfoNB.values()
                    info["matrixSVM"] = obj.matrixInfoSVM.values()
                    for student in obj.studentInfo:
                        try:
                            obj = Email(
                                "Recordatorio Atención Aula",
                                "Hola "
                                + str(student["realname"])
                                + " tienes una calificación igual a "
                                + str(student["grade"])
                                + ", debes practicar un poco más tus actividades de programación, recuerda 'La práctica hace al maestro'. No olvides consultar las dudas con tu profesor.",
                                [
                                    "luz.lucumi@correounivalle.edu.co",
                                    "stiven.pinzon@correounivalle.edu.co",
                                ],
                            )
                            obj.send_django_mail()
                        except Exception as e:
                            print(e)
                            continue

                    return Response(
                        info,
                        status=status.HTTP_201_CREATED
                        # file_serializer.data, status=status.HTTP_201_CREATED
                    )
                else:
                    return Response(
                        "El archivo se cargó pero el .csv no está en el formato requerido",
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            else:
                print(file_serializer.errors)
                return Response(
                    file_serializer.errors, status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            print(e)


def extract_csvInfo(path, infoSerializer, check):
    import os

    # Ruta absoluta = C:\Users\miime\Desktop\TG\TG_alpha\tg_alpha\backend
    newPath = os.path.abspath(".")
    current_path = newPath.replace(os.sep, "/")
    file = f"{current_path}{path}"
    classification = MachineLearning(file, infoSerializer, f"{current_path}", check)
    status = classification.error
    return status, classification


# local methods
def extract_info(path, name):
    import tempfile
    import os

    MEDIA_PATH = "/media/files"

    # create temporal foler
    temp = tempfile.TemporaryDirectory()
    newPath = os.path.abspath(".")
    current_path = newPath.replace(os.sep, "/")

    file = f"{current_path}{path}"
    un = Unlock(temp.name, file)

    # choose .test files
    test_files = un.read_paths()

    if len(test_files) == 0:
        return {
            "status": False,
            "data": "No existe algún archivo .test en el .tgz enviado.",
        }

    # read and save .test files
    read_test = un.read_inputs(test_files)

    # get essential data from submission
    data = un.extract_info(read_test)

    # write .json file into /media/files
    json_list = un.write_json(data, name, current_path + MEDIA_PATH)

    us = UploadSubmission(data=json_list)

    status = us.save_data()

    # clean temporal folder
    temp.cleanup()
    return status
