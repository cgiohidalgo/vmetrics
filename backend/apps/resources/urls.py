# Django
from django.urls import path

# Resources views
from apps.resources.views import *

urlpatterns = [
    path("", resource_list),  # get all resources
    path("<int:id>/", resource_detail),  # get, update and delete resource by ID
    path("professor/<int:id>/", resource_by_professor),  # get resources by professor
    path("graphics/courses-tasks/professor/<int:id>", tasks_by_courses),
    path("graphics/total-result/professor/<int:id>", total_results),
    path("graphics/total-result-courses/professor/<int:id>", total_results_by_courses),
    path("graphics/tasks-failed/professor/<int:id>", tasks_failed),
]
