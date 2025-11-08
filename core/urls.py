from django.urls import path

from .views import offer_create, offer_list

urlpatterns = [
    path("", offer_list, name="offers_list"),
    path("add/", offer_create, name="offers_add"),
]
