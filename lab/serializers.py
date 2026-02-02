from rest_framework import serializers
from .models import LabReport

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
      "status",
      "extracted_text",
      "ai_analysis",
      "uploaded_at",
      "updated_at",
    ]