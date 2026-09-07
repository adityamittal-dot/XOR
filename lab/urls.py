from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import AssistantChatView, LabReportViewSet

router = DefaultRouter()
router.register("lab-reports", LabReportViewSet, basename="lab-report")

urlpatterns = [
    path("assistant/chat/", AssistantChatView.as_view(), name="assistant-chat"),
    *router.urls,
]
