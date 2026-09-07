"""Lab report upload, analysis and follow-up chat."""

import logging

from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response

from lab.gemini_client import (
    GeminiUnavailable,
    analyze_lab_report,
    chat_about_lab_report,
)
from lab.models import LabReport
from lab.serializers import (
    LabChatRequestSerializer,
    LabReportListSerializer,
    LabReportSerializer,
)
from lab.utils import PdfExtractionError, extract_text_from_pdf

logger = logging.getLogger(__name__)


class LabReportViewSet(viewsets.ModelViewSet):
    """Upload lab report PDFs, read their AI analysis, and ask follow-ups."""

    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    throttle_scope = "lab_ai"

    def get_queryset(self):
        return LabReport.objects.filter(user=self.request.user).order_by("-uploaded_at")

    def get_serializer_class(self):
        if self.action == "list":
            return LabReportListSerializer
        return LabReportSerializer

    def get_throttles(self):
        # Only the AI-backed endpoints are rate limited; plain reads are not.
        if self.action in {"create", "chat"}:
            return super().get_throttles()
        return []

    def perform_create(self, serializer):
        report = serializer.save(
            user=self.request.user, status=LabReport.Status.PROCESSING
        )
        self._process(report)

    def _process(self, report: LabReport) -> None:
        """Extract text and run the analysis, recording failure on the report."""
        try:
            with report.file.open("rb") as handle:
                report.extracted_text = extract_text_from_pdf(handle)
        except PdfExtractionError as exc:
            logger.warning("Report %s: text extraction failed: %s", report.pk, exc)
            report.status = LabReport.Status.FAILED
            report.ai_analysis = {"error": str(exc)}
            report.save(update_fields=["status", "ai_analysis", "updated_at"])
            return

        try:
            report.ai_analysis = analyze_lab_report(report.extracted_text)
            report.status = LabReport.Status.READY
            if not report.title:
                guess = report.ai_analysis.get("title_guess")
                if guess:
                    report.title = str(guess)[:255]
        except (GeminiUnavailable, ValueError) as exc:
            logger.warning("Report %s: analysis failed: %s", report.pk, exc)
            report.status = LabReport.Status.FAILED
            report.ai_analysis = {"error": str(exc)}

        report.save()

    @action(detail=True, methods=["post"])
    def reanalyze(self, request, pk=None):
        """Re-run analysis on a report whose first attempt failed."""
        report = self.get_object()
        report.status = LabReport.Status.PROCESSING
        report.save(update_fields=["status", "updated_at"])
        self._process(report)
        return Response(LabReportSerializer(report, context={"request": request}).data)

    @action(detail=True, methods=["post"])
    def chat(self, request, pk=None):
        """Answer a follow-up question about one specific report."""
        report = self.get_object()

        request_serializer = LabChatRequestSerializer(data=request.data)
        request_serializer.is_valid(raise_exception=True)
        payload = request_serializer.validated_data

        if not report.extracted_text:
            return Response(
                {"detail": "This report has no readable text to discuss yet."},
                status=status.HTTP_409_CONFLICT,
            )

        try:
            reply = chat_about_lab_report(
                extracted_text=report.extracted_text,
                analysis=report.ai_analysis,
                history=payload["history"],
                question=payload["message"],
            )
        except GeminiUnavailable as exc:
            logger.warning("Report %s: chat failed: %s", report.pk, exc)
            return Response(
                {"detail": "The AI assistant is unavailable right now."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        return Response({"reply": reply})
