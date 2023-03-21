# Django
from django.urls import path

# tasks
from . import views

urlpatterns = [
    # list all task from DB
    path("", views.task_list),
    # get only one task by id
    path("<int:task_id>/", views.task_detail),
    # list of all tasks by professor
    path("professor/<int:professor_id>/", views.task_by_professor),
    # list of tasks by resource
    path("resource/<int:resource_id>/", views.task_by_resource),
]
