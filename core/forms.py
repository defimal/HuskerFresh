from django import forms

from .models import Offer

DATETIME_INPUT_FORMAT = "%Y-%m-%dT%H:%M"


class OfferForm(forms.ModelForm):
    start_at = forms.DateTimeField(
        widget=forms.DateTimeInput(attrs={"type": "datetime-local"}),
        input_formats=[DATETIME_INPUT_FORMAT],
    )
    end_at = forms.DateTimeField(
        widget=forms.DateTimeInput(attrs={"type": "datetime-local"}),
        input_formats=[DATETIME_INPUT_FORMAT],
    )

    class Meta:
        model = Offer
        fields = (
            "meal_type",
            "swipes_count",
            "price_usd",
            "campus_zone",
            "start_at",
            "end_at",
            "notes",
        )
        widgets = {
            "notes": forms.Textarea(attrs={"rows": 3}),
        }
