# Django
from django.contrib import admin
from django.urls import path
from django.urls.conf import include


urlpatterns = [
    path("api/admin/", admin.site.urls),
    path("api/student/", include("apps.students.urls")),
    path("api/professor/", include("apps.professors.urls")),
    path("api/course/", include("apps.courses.urls")),
    path("api/resource/", include("apps.resources.urls")),
    path("api/task/", include("apps.tasks.urls")),
    path("api/input/", include("apps.inputs.urls")),
    path("api/file/", include("apps.files.urls")),
    path("api/image/", include("apps.images.urls")),
    # jwt
    path("api/auth/", include("apps.auth.urls")),
]
