from rest_framework.routers import DefaultRouter
from .views import LabReportViewSet

router = DefaultRouter()
router.register("lab-reports", LabReportViewSet, basename="lab-report")

urlpatterns = router.urls
