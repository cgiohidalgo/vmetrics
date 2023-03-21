from django.urls import path
from . import views

urlpatterns = [
    path('', views.images_all),
    path('<int:csvFile_id>/', views.image_by_csvFile),
    path('<int:csvFile_id>/<int:number>/', views.imageNumber_by_csvFile),
]
