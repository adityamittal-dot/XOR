from rest_framework import viewsets, permissions
from .models import LabReport
from .serializers import LabReportSerializer
from .utils import extract_text_from_pdf


class LabReportViewSet(viewsets.ModelViewSet):
    serializer_class = LabReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LabReport.objects.filter(user=self.request.user).order_by("-uploaded_at")
    
    def perform_create(self, serializer):
        report = serializer.save(user=self.request.user, status=LabReport.status.PROCESSING)
        
        try:
            extracted = extract_text_from_pdf(report.file.path)
            report.extracted_text = extracted
            
            report.ai_analysis = generate_dummy_analysis(extracted)
            
            report.status = LabReport.Status.READY
            report.save()
            
        except Exception:
            report.status = LabReport.status.FAILED
            report.save()
            raise