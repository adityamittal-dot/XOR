from django.contrib import admin

from lab.models import LabReport


@admin.register(LabReport)
class LabReportAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "title", "status", "uploaded_at")
    list_filter = ("status", "uploaded_at")
    search_fields = ("title", "user__email")
    readonly_fields = ("extracted_text", "ai_analysis", "uploaded_at", "updated_at")
