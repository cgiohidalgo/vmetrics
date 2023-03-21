# Django
from django.urls import path

# professor
from . import views

urlpatterns = [
    path("", views.professor_list),  # get all professors from DB
    path("<int:id>/", views.professor_detail),  # get only one professor by id
    # path("<int:pk>/", views.ProfessorUpdateAPIView.as_view()),
]
