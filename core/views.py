from django.http import Http404
from django.shortcuts import redirect, render
from django.utils import timezone

from .forms import OfferForm
from .models import Offer, PublicUser


def _resolve_owner(request):
    owner = None
    if request.user.is_authenticated:
        owner = PublicUser.objects.filter(
            username__iexact=request.user.username
        ).first()
    if owner is None:
        owner = PublicUser.objects.order_by("created_at").first()
    if owner is None:
        raise Http404("No user found to assign as owner.")
    return owner


def offer_list(request):
    offers = Offer.objects.select_related("owner").all()
    return render(request, "offers/list.html", {"offers": offers})


def offer_create(request):
    owner = _resolve_owner(request)

    if request.method == "POST":
        form = OfferForm(request.POST)
        if form.is_valid():
            offer = form.save(commit=False)
            offer.owner = owner
            offer.status = "published"
            now = timezone.now()
            if not offer.created_at:
                offer.created_at = now
            offer.updated_at = now
            offer.save()
            return redirect("offers_list")
    else:
        form = OfferForm()

    return render(request, "offers/add.html", {"form": form})
