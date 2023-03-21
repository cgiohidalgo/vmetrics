# Django
from apps.auth import views
from django.urls import path

# rest framework
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path("login/", views.MyObtainTokenPairView.as_view(), name="token_obtain_pair"),
    path("login/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("logout/", views.LogoutView.as_view(), name="auth_logout"),
]
