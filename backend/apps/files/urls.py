# Django
from django.urls import path

# Files
from . import views

urlpatterns = [
    path("", views.FileView.as_view(), name="file_list"),
    path("csv/", views.CSVFileView.as_view(), name="csvfile_list"),
]
