from django.contrib import admin

from .models import HelpRequest


@admin.register(HelpRequest)
class HelpRequestAdmin(admin.ModelAdmin):
    list_display = (
        "requester",
        "need_type",
        "campus_zone",
        "urgency",
        "swipes_needed",
        "needed_before",
        "status",
    )
    list_filter = ("status", "campus_zone", "urgency")
    search_fields = ("requester__username", "need_type", "campus_zone", "status")
    ordering = ("-created_at",)
