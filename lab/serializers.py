from django.conf import settings
from rest_framework import serializers

from lab.models import LabReport
from lab.utils import looks_like_pdf


class LabReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabReport
        fields = [
            "id",
            "title",
            "file",
            "status",
            "extracted_text",
            "ai_analysis",
            "uploaded_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "status",
            "extracted_text",
            "ai_analysis",
            "uploaded_at",
            "updated_at",
        ]

    def validate_file(self, value):
        if value.size > settings.MAX_UPLOAD_SIZE_BYTES:
            limit_mb = settings.MAX_UPLOAD_SIZE_BYTES / (1024 * 1024)
            raise serializers.ValidationError(
                f"File is too large. The limit is {limit_mb:.0f} MB."
            )
        if not looks_like_pdf(value):
            raise serializers.ValidationError("Only PDF files are supported.")
        return value


class LabReportListSerializer(LabReportSerializer):
    """Report list without the bulky extracted text."""

    class Meta(LabReportSerializer.Meta):
        fields = [
            field for field in LabReportSerializer.Meta.fields if field != "extracted_text"
        ]


class LabChatRequestSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=4000, trim_whitespace=True)
    history = serializers.ListField(
        child=serializers.DictField(), required=False, default=list
    )

    def validate_history(self, value):
        # Only the last few turns are sent to the model.
        return value[-10:]
