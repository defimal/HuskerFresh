from django import forms

from .models import HelpRequest

DATETIME_INPUT_FORMAT = "%Y-%m-%dT%H:%M"
URGENCY_CHOICES = (
    (3, "High · needs help today"),
    (2, "Medium · within a day"),
    (1, "Low · flexible timing"),
)


class HelpRequestForm(forms.ModelForm):
    needed_before = forms.DateTimeField(
        widget=forms.DateTimeInput(attrs={"type": "datetime-local"}),
        input_formats=[DATETIME_INPUT_FORMAT],
    )
    urgency = forms.TypedChoiceField(
        choices=URGENCY_CHOICES,
        coerce=int,
        widget=forms.RadioSelect(attrs={"class": "hf-radio-group"}),
    )

    class Meta:
        model = HelpRequest
        fields = (
            "need_type",
            "campus_zone",
            "needed_before",
            "urgency",
        )
        widgets = {
            "need_type": forms.Textarea(
                attrs={"rows": 3, "placeholder": "Drop a quick comment for donors"}
            ),
            "campus_zone": forms.TextInput(attrs={"placeholder": "Nebraska Union"}),
        }
        labels = {
            "need_type": "Comment",
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
