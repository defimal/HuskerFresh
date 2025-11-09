from django.urls import path

from .views import request_create, request_donate, request_list

urlpatterns = [
    path("", request_list, name="requests_list"),
    path("add/", request_create, name="requests_add"),
    path("<int:pk>/donate/", request_donate, name="requests_donate"),
]
