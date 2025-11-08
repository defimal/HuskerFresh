from django.contrib import admin

from .models import Offer


@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = (
        "owner",
        "meal_type",
        "campus_zone",
        "swipes_count",
        "price_usd",
        "status",
        "start_at",
    )
    list_filter = ("status", "campus_zone")
    search_fields = ("owner__username", "meal_type", "campus_zone", "status")
    ordering = ("-created_at",)
