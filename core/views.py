from django.contrib import messages
from django.db import connection, transaction
from django.http import Http404
from django.shortcuts import redirect, render
from django.utils import timezone
from django.views.decorators.http import require_POST

from .forms import HelpRequestForm
from .models import HelpRequest, PublicUser

_swipe_constraint_checked = False


def _ensure_swipes_constraint():
    global _swipe_constraint_checked
    if _swipe_constraint_checked:
        return
    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT pg_get_constraintdef(oid) FROM pg_constraint WHERE conname = %s",
            ["requests_swipes_needed_pos"],
        )
        row = cursor.fetchone()
        if row and "swipes_needed > 0" in row[0]:
            cursor.execute(
                'ALTER TABLE public.requests DROP CONSTRAINT IF EXISTS "requests_swipes_needed_pos";'
            )
            cursor.execute(
                'ALTER TABLE public.requests ADD CONSTRAINT "requests_swipes_needed_pos" CHECK (swipes_needed >= 0);'
            )
    _swipe_constraint_checked = True


def _resolve_requester(request):
    preferred = PublicUser.objects.filter(username__iexact="defi").first()
    if preferred:
        return preferred
    user = None
    if getattr(request, "user", None) and request.user.is_authenticated:
        user = PublicUser.objects.filter(username__iexact=request.user.username).first()
    if user is None:
        user = PublicUser.objects.order_by("created_at").first()
    if user is None:
        raise Http404("No user found to assign as requester.")
    return user


def request_list(request):
    current_user = _resolve_requester(request)
    requests_qs = list(HelpRequest.objects.select_related("requester").all())
    for req in requests_qs:
        req.disable_donate = True
        if current_user:
            req.disable_donate = (
                req.swipes_needed <= 0
                or current_user.meal_swipes <= 0
                or req.requester_id == current_user.id
            )
    leaderboard = (
        PublicUser.objects.order_by("-donation_points", "username")
        .values("username", "donation_points")
        [:5]
    )
    return render(
        request,
        "requests/list.html",
        {
            "requests": requests_qs,
            "current_user": current_user,
            "leaderboard": leaderboard,
        },
    )


def request_create(request):
    requester = _resolve_requester(request)

    if request.method == "POST":
        form = HelpRequestForm(request.POST)
        if form.is_valid():
            help_request = form.save(commit=False)
            help_request.requester = requester
            help_request.status = "open"
            now = timezone.now()
            if not help_request.created_at:
                help_request.created_at = now
            help_request.updated_at = now
            help_request.save()
            return redirect("requests_list")
    else:
        form = HelpRequestForm()

    return render(request, "requests/add.html", {"form": form})


@require_POST
def request_donate(request, pk):
    _ensure_swipes_constraint()
    donor = _resolve_requester(request)
    try:
        with transaction.atomic():
            donor_locked = (
                PublicUser.objects.select_for_update()
                .filter(pk=donor.pk)
                .first()
            )
            if donor_locked is None:
                raise ValueError("Unable to identify donor account.")

            help_request = (
                HelpRequest.objects.select_for_update()
                .select_related("requester")
                .get(pk=pk)
            )
            requester_locked = (
                PublicUser.objects.select_for_update()
                .get(pk=help_request.requester_id)
            )

            if donor_locked.meal_swipes < 1:
                raise ValueError("You do not have enough swipes to donate.")
            if help_request.swipes_needed <= 0 or help_request.status.lower() == "matched":
                raise ValueError("This request is already fulfilled.")

            donor_locked.meal_swipes -= 1
            donor_locked.donation_points = (donor_locked.donation_points or 0) + 1
            requester_locked.meal_swipes += 1
            help_request.swipes_needed = help_request.swipes_needed - 1
            if help_request.swipes_needed == 0:
                help_request.status = "matched"
            help_request.updated_at = timezone.now()

            donor_locked.save(update_fields=["meal_swipes", "donation_points"])
            requester_locked.save(update_fields=["meal_swipes"])
            help_request.save(update_fields=["swipes_needed", "status", "updated_at"])

            messages.success(
                request,
                f"Donated 1 swipe to {help_request.requester.username}'s request.",
            )
    except ValueError as exc:
        messages.error(request, str(exc))
    except HelpRequest.DoesNotExist:
        messages.error(request, "That request was not found.")

    return redirect("requests_list")
