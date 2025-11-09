from django import forms

from .models import HelpRequest

DATETIME_INPUT_FORMAT = "%Y-%m-%dT%H:%M"


class HelpRequestForm(forms.ModelForm):
    needed_before = forms.DateTimeField(
        widget=forms.DateTimeInput(attrs={"type": "datetime-local"}),
        input_formats=[DATETIME_INPUT_FORMAT],
    )

    class Meta:
        model = HelpRequest
        fields = (
            "need_type",
            "description",
            "campus_zone",
            "needed_before",
            "urgency",
            "swipes_needed",
        )
        widgets = {
            "description": forms.Textarea(attrs={"rows": 4}),
        }
