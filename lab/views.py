"""
Views for handling Lab Report uploads and AI-powered chat interactions.
"""

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from lab.models import LabReport
from lab.serializers import LabReportSerializer
from lab.utils import extract_text_from_pdf
from lab.gemini_client import analyze_lab_report_with_gemini


class LabReportViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing, uploading, and interacting with lab reports.
    """
    serializer_class = LabReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LabReport.objects.filter(user=self.request.user).order_by("-uploaded_at")

    def perform_create(self, serializer):
        """
        Handles the initial upload and text extraction.
        """
        report = serializer.save(user=self.request.user, status="PROCESSING")
        try:
            extracted = extract_text_from_pdf(report.file.path)
            report.extracted_text = extracted
            report.ai_analysis = analyze_lab_report_with_gemini(extracted)
            report.status = "READY"
            report.save()
        except (IOError, ValueError, RuntimeError) as e:
            # FIX: Catching specific exceptions to resolve W0718
            report.status = "FAILED"
            report.save()
            print(f"AI Analysis Error: {e}")

    @action(detail=True, methods=['post'])
    def chat(self, request, pk=None):
        """
        Endpoint for interactive chat regarding a specific lab report.
        """
        # pylint: disable=unused-argument
        report = self.get_object()
        user_query = request.data.get("message")
        chat_history = request.data.get("history", [])

        if not user_query:
            return Response(
                {"error": "Message is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Build context from the report and recent conversation history
        context = f"SYSTEM: Analyze this report: {report.extracted_text}\n"
        for msg in chat_history[-5:]:
            context += f"{msg['role'].upper()}: {msg['content']}\n"
        context += f"USER: {user_query}"

        try:
            response_data = analyze_lab_report_with_gemini(context)
            return Response({
                "reply": response_data.get("summary", "I processed your request."),
                "raw_data": response_data
            })
        except RuntimeError as e:
            # FIX: Catching specific exception to resolve W0718
            print(f"Chat Error: {e}")
            return Response(
                {"error": "AI failed to respond"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

