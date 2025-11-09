from django import forms

from .models import HelpRequest

DATETIME_INPUT_FORMAT = "%Y-%m-%dT%H:%M"


class HelpRequestForm(forms.ModelForm):
    needed_before = forms.DateTimeField(
        widget=forms.DateTimeInput(attrs={"type": "datetime-local"}),
        input_formats=[DATETIME_INPUT_FORMAT],
    )

    urgency = forms.TypedChoiceField(
        choices=HelpRequest.URGENCY_CHOICES,
        coerce=int,
        widget=forms.Select(attrs={"class": "hf-input"}),
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
            "need_type": forms.TextInput(attrs={"placeholder": "E.g. Late lunch, Study session"}),
            "description": forms.Textarea(attrs={"rows": 4, "placeholder": "Share context and meetup details"}),
            "campus_zone": forms.TextInput(attrs={"placeholder": "Nebraska Union"}),
            "swipes_needed": forms.NumberInput(attrs={"min": 1}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            classes = field.widget.attrs.get("class", "")
            field.widget.attrs["class"] = (classes + " hf-input").strip()


class PublicLoginForm(forms.Form):
    username = forms.CharField(widget=forms.TextInput(attrs={"placeholder": "Enter username", "class": "hf-input"}))
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={"placeholder": "Enter password", "class": "hf-input"})
    )
