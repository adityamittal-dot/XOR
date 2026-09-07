import io
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from rest_framework import status
from rest_framework.test import APITestCase

from lab.gemini_client import GeminiUnavailable, _safe_json_load
from lab.models import LabReport
from lab.utils import PdfExtractionError, extract_text_from_pdf, looks_like_pdf

User = get_user_model()

ANALYSIS = {"title_guess": "CBC", "summary": "Looks broadly fine.", "key_findings": []}


def pdf_upload(name="report.pdf", body=b"%PDF-1.4 fake body"):
    return SimpleUploadedFile(name, body, content_type="application/pdf")


class PdfUtilsTests(APITestCase):
    def test_looks_like_pdf_checks_magic_bytes(self):
        self.assertTrue(looks_like_pdf(io.BytesIO(b"%PDF-1.7 ...")))
        self.assertFalse(looks_like_pdf(io.BytesIO(b"GIF89a not a pdf")))

    def test_looks_like_pdf_restores_stream_position(self):
        stream = io.BytesIO(b"%PDF-1.7 ...")
        stream.seek(3)

        looks_like_pdf(stream)

        self.assertEqual(stream.tell(), 3)

    def test_unreadable_pdf_raises_extraction_error(self):
        with self.assertRaises(PdfExtractionError):
            extract_text_from_pdf(io.BytesIO(b"%PDF-1.4 not really a pdf"))


class SafeJsonLoadTests(APITestCase):
    def test_parses_plain_json(self):
        self.assertEqual(_safe_json_load('{"a": 1}'), {"a": 1})

    def test_parses_json_wrapped_in_prose(self):
        self.assertEqual(_safe_json_load('Here you go:\n{"a": 1}\nThanks'), {"a": 1})

    def test_rejects_non_json(self):
        with self.assertRaises(ValueError):
            _safe_json_load("no json here")


@override_settings(MEDIA_ROOT="/tmp/xor-test-media")
class LabReportApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="owner@example.com", password="s3cure-pass-42"
        )
        self.other = User.objects.create_user(
            email="other@example.com", password="s3cure-pass-42"
        )
        self.client.force_authenticate(user=self.user)

    def test_requires_authentication(self):
        self.client.force_authenticate(user=None)

        self.assertEqual(
            self.client.get("/api/lab-reports/").status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_rejects_non_pdf_upload(self):
        bad_file = SimpleUploadedFile("notes.txt", b"just text", content_type="text/plain")

        response = self.client.post("/api/lab-reports/", {"file": bad_file})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(LabReport.objects.count(), 0)

    @override_settings(MAX_UPLOAD_SIZE_BYTES=10)
    def test_rejects_oversized_upload(self):
        response = self.client.post(
            "/api/lab-reports/", {"file": pdf_upload(body=b"%PDF-" + b"x" * 500)}
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("lab.views.analyze_lab_report", return_value=ANALYSIS)
    @patch("lab.views.extract_text_from_pdf", return_value="Hemoglobin 13.5 g/dL")
    def test_successful_upload_is_analysed(self, _extract, _analyze):
        response = self.client.post("/api/lab-reports/", {"file": pdf_upload()})

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        report = LabReport.objects.get()
        self.assertEqual(report.status, LabReport.Status.READY)
        self.assertEqual(report.ai_analysis, ANALYSIS)
        self.assertEqual(report.title, "CBC")

    @patch("lab.views.extract_text_from_pdf", side_effect=PdfExtractionError("scanned"))
    def test_unreadable_pdf_marks_report_failed(self, _extract):
        response = self.client.post("/api/lab-reports/", {"file": pdf_upload()})

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(LabReport.objects.get().status, LabReport.Status.FAILED)

    @patch("lab.views.analyze_lab_report", side_effect=GeminiUnavailable("no key"))
    @patch("lab.views.extract_text_from_pdf", return_value="Hemoglobin 13.5 g/dL")
    def test_ai_outage_marks_report_failed_without_500(self, _extract, _analyze):
        response = self.client.post("/api/lab-reports/", {"file": pdf_upload()})

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        report = LabReport.objects.get()
        self.assertEqual(report.status, LabReport.Status.FAILED)
        self.assertEqual(report.extracted_text, "Hemoglobin 13.5 g/dL")

    def test_list_excludes_other_users_reports(self):
        LabReport.objects.create(user=self.other, title="Theirs", file="x.pdf")
        LabReport.objects.create(user=self.user, title="Mine", file="y.pdf")

        response = self.client.get("/api/lab-reports/")

        self.assertEqual([r["title"] for r in response.data], ["Mine"])

    @patch("lab.views.chat_about_lab_report", return_value="Hello, here is the answer.")
    def test_chat_returns_reply(self, _chat):
        report = LabReport.objects.create(
            user=self.user, title="Mine", file="y.pdf", extracted_text="Hb 13.5"
        )

        response = self.client.post(
            f"/api/lab-reports/{report.pk}/chat/",
            {"message": "Is my hemoglobin fine?"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["reply"], "Hello, here is the answer.")

    def test_chat_requires_a_message(self):
        report = LabReport.objects.create(
            user=self.user, title="Mine", file="y.pdf", extracted_text="Hb 13.5"
        )

        response = self.client.post(
            f"/api/lab-reports/{report.pk}/chat/", {}, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_chat_on_report_without_text_is_rejected(self):
        report = LabReport.objects.create(user=self.user, title="Mine", file="y.pdf")

        response = self.client.post(
            f"/api/lab-reports/{report.pk}/chat/", {"message": "hi"}, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def test_general_assistant_requires_authentication(self):
        self.client.force_authenticate(user=None)

        response = self.client.post(
            "/api/assistant/chat/", {"message": "hi"}, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_general_assistant_requires_a_message(self):
        response = self.client.post("/api/assistant/chat/", {}, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("lab.views.chat_general_health", return_value="General answer.")
    def test_general_assistant_answers_without_any_reports(self, _chat):
        response = self.client.post(
            "/api/assistant/chat/", {"message": "What is a normal BP?"}, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["reply"], "General answer.")
        self.assertEqual(_chat.call_args.kwargs["reports_context"], "")

    @patch("lab.views.chat_general_health", return_value="Grounded answer.")
    def test_general_assistant_context_only_includes_own_ready_reports(self, _chat):
        LabReport.objects.create(
            user=self.user,
            title="Mine Ready",
            file="a.pdf",
            status=LabReport.Status.READY,
            ai_analysis={"summary": "hemoglobin slightly low"},
        )
        LabReport.objects.create(
            user=self.user,
            title="Mine Failed",
            file="b.pdf",
            status=LabReport.Status.FAILED,
            ai_analysis={"error": "unreadable"},
        )
        LabReport.objects.create(
            user=self.other,
            title="Theirs Ready",
            file="c.pdf",
            status=LabReport.Status.READY,
            ai_analysis={"summary": "someone else data"},
        )

        self.client.post(
            "/api/assistant/chat/", {"message": "Is my hemoglobin low?"}, format="json"
        )

        context = _chat.call_args.kwargs["reports_context"]
        self.assertIn("Mine Ready", context)
        self.assertIn("hemoglobin slightly low", context)
        self.assertNotIn("Mine Failed", context)
        self.assertNotIn("Theirs Ready", context)
        self.assertNotIn("someone else data", context)

    @patch("lab.views.chat_general_health", side_effect=GeminiUnavailable("no key"))
    def test_general_assistant_reports_outage_as_503(self, _chat):
        response = self.client.post(
            "/api/assistant/chat/", {"message": "hello"}, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_503_SERVICE_UNAVAILABLE)

    def test_cannot_chat_about_another_users_report(self):
        report = LabReport.objects.create(
            user=self.other, title="Theirs", file="x.pdf", extracted_text="Hb 13.5"
        )

        response = self.client.post(
            f"/api/lab-reports/{report.pk}/chat/", {"message": "hi"}, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
