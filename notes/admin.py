from django.contrib import admin

from .models import Note


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "user", "created_at")
    list_filter = ("created_at",)
    search_fields = ("title", "content", "user__email")
