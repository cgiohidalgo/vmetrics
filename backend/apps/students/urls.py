# Django
from django.urls import path

# students
from . import views

urlpatterns = [
    path("", views.student_list),  # get all students fom DB
    path("<int:id>/", views.student_detail),  # get only one student by id
    path("resource/<int:resourceId>/", views.student_by_resource),
    path("professor/<int:professorId>/", views.student_by_professor),
]
