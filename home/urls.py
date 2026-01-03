from django.urls import path
from .views import user_quote

urlpatterns = [
    path("user-quote/", user_quote),
]
