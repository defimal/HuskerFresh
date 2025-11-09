from django.contrib import messages
from django.db import connection, transaction
from django.shortcuts import redirect, render
from django.utils import timezone
from django.utils.http import urlencode, url_has_allowed_host_and_scheme
from django.views.decorators.http import require_POST
from django.urls import reverse

from .forms import HelpRequestForm, PublicLoginForm
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


def _get_session_user(request):
    user_id = request.session.get("public_user_id")
    if not user_id:
        return None
    return PublicUser.objects.filter(pk=user_id).first()


def _set_session_user(request, user: PublicUser):
    request.session["public_user_id"] = user.pk
    request.session["public_user_username"] = user.username
    request.session.modified = True


def _redirect_to_login(request):
    login_url = reverse("login")
    query = urlencode({"next": request.get_full_path()})
    return redirect(f"{login_url}?{query}")


def request_list(request):
    current_user = _get_session_user(request)
    if not current_user:
        return _redirect_to_login(request)
    requests_qs = list(HelpRequest.objects.select_related("requester").all())
    total_swipes_needed = 0
    open_requests = 0
    for req in requests_qs:
        req.disable_donate = True
        remaining = max(0, req.swipes_needed)
        total_swipes_needed += remaining
        if str(req.status).lower() != "matched" and remaining > 0:
            open_requests += 1
        if remaining == 0 or str(req.status).lower() == "matched":
            req.progress_pct = 100
        else:
            req.progress_pct = max(12, 100 - min(remaining, 10) * 8)
        if current_user:
            req.disable_donate = (
                remaining <= 0
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
            "stats": {
                "total_requests": len(requests_qs),
                "open_requests": open_requests,
                "swipes_needed": total_swipes_needed,
                "donor_swipes": current_user.meal_swipes if current_user else 0,
            },
        },
    )


def request_create(request):
    requester = _get_session_user(request)
    if not requester:
        return _redirect_to_login(request)

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


def login_view(request):
    if _get_session_user(request):
        return redirect("requests_list")

    next_url = request.GET.get("next") or request.POST.get("next")
    form = PublicLoginForm(request.POST or None)
    if request.method == "POST" and form.is_valid():
        username = form.cleaned_data["username"]
        password = form.cleaned_data["password"]
        user = PublicUser.objects.filter(username__iexact=username).first()
        if user and user.password == password:
            _set_session_user(request, user)
            messages.success(request, f"Welcome back, {user.username}!")
            if next_url and url_has_allowed_host_and_scheme(
                next_url, allowed_hosts={request.get_host()}
            ):
                return redirect(next_url)
            return redirect("requests_list")
        form.add_error(None, "Invalid username or password.")
    credentials = list(
        PublicUser.objects.order_by("username").values("username", "password")
    )
    return render(
        request,
        "auth/login.html",
        {"form": form, "next": next_url, "credentials": credentials},
    )


def logout_view(request):
    request.session.pop("public_user_id", None)
    request.session.pop("public_user_username", None)
    messages.info(request, "You have been logged out.")
    return redirect("login")


@require_POST
def request_donate(request, pk):
    _ensure_swipes_constraint()
    donor = _get_session_user(request)
    if not donor:
        return _redirect_to_login(request)
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
