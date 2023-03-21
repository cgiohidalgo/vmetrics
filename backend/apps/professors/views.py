# rest framework
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status


# professors
from .models import Professor, User
from .serializers import *


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def professor_list(request):
    if request.method == "GET":
        professor = Professor.objects.filter(user__is_active=1)

        serializer = GetProfessorSerializer(
            professor, context={"request": request}, many=True
        )

        return Response({"data": serializer.data}, status.HTTP_200_OK)

    if request.method == "POST":

        try:
            email = request.data["email"]
            e = User.objects.filter(email=email)

            if len(e) > 0:
                return Response(
                    {"data": "Ya existe un usuario registrado con este correo."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except KeyError:
            return Response(
                {"data": "Debe ingresar un correo."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            if Professor.objects.filter(code=request.data["code"]).exists():
                return Response(
                    {"data": "Ya se ha asignado este código de profesor."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except KeyError:
            return Response(
                {"data": "Debe ingresar un código de profesor."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        userSerializer = UserSerializer(data=request.data)
        userSerializer.is_valid(raise_exception=True)
        u = User.objects.create_user(
            username=request.data["username"],
            password=request.data["password"],
            first_name=request.data["first_name"],
            last_name=request.data["last_name"],
            email=request.data["email"],
            is_staff=1,
        )

        u = User.objects.get(username=request.data["username"])
        professor = request.data
        professor["user"] = u.pk
        professorSerializer = ProfessorSerializer(data=professor)
        professorSerializer.is_valid(raise_exception=True)
        professorSerializer.save()
        professorResponse = Professor.objects.get(id=professorSerializer.data["pk"])

        return Response(
            status=status.HTTP_201_CREATED,
            data=GetProfessorSerializer(professorResponse).data,
        )

        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def professor_detail(request, id):
    """
    Retrieve, update or delete a professor by id/pk.
    """
    try:
        professor = Professor.objects.get(pk=id, user__is_active=1)
    except Professor.DoesNotExist as e:
        return Response(status=status.HTTP_404_NOT_FOUND, data=str(e))

    if request.method == "GET":
        professorSerializer = GetProfessorSerializer(professor)
        return Response(professorSerializer.data, status=status.HTTP_200_OK)

    if request.method == "PUT":
        professor = Professor.objects.get(pk=id, user__is_active=1)

        # check unique email
        try:
            if (
                User.objects.filter(email=request.data["email"])
                .exclude(pk=professor.user.id)
                .exists()
            ):
                return Response(
                    {"data": "Ya existe un usuario registrado con este correo."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except KeyError:
            pass

        professorSerializer = UpdateProfessorSerializer(professor, request.data)
        user = User.objects.get(pk=professor.user.id)
        userSerializer = UpdateUserSerializer(user, request.data, partial=True)

        professorSerializer.is_valid(raise_exception=True)
        userSerializer.is_valid(raise_exception=True)
        professorSerializer.save()
        userSerializer.save()
        professor = Professor.objects.get(pk=id)
        professorResponse = GetProfessorSerializer(professor)

        return Response(professorResponse.data, status=status.HTTP_200_OK)
