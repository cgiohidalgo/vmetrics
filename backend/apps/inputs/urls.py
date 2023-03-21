# Django
from django.urls import path

# inputs
from . import views

urlpatterns = [
    path("", views.input_list),  # get all tasks from DB
    # path(
    #     "student/<int:studentid>", views.input_list
    # ),  # get inputs from specific student
    path("task/<int:taskid>/", views.input_by_task),  # get inputs from specific task
    path("<str:id>/", views.input_detail),  # get only one input by id
    path("languages/get/", views.language_list),
    # Metrics
    path("metrics/task/<int:taskid>/", views.metrics_by_task),  # by taskid
    path("metrics/source-code/<str:input_id>/", views.metrics_by_source_code),
    path("metrics/student/<int:student_id>/", views.metrics_by_student),
    path("metrics/task/evaluated/<int:professor_id>/", views.get_input_metrics),
]
