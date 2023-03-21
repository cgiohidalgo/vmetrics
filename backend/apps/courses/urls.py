# Django
from django.urls import path

# courses
from . import views

urlpatterns = [
    path("", views.course_list),  # get all courses from DB
    path("<int:id>", views.course_detail),  # get only one course by id
]
