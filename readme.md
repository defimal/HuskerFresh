# SwipeShare

Simple Django app that showcases student help requests backed by Neon Postgres.

## Quick start

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser  # optional
python manage.py runserver
```

## Environment

Create a `.env` file in the project root or set the variables in your shell.

| Variable      | Purpose                                   | Default        |
|---------------|-------------------------------------------|----------------|
| `DJANGO_SECRET_KEY` | Django secret key                       | built-in dev key |
| `DEBUG`       | Toggle debug mode (`1` or `0`)             | `1`            |
| `ALLOWED_HOSTS` | Comma-separated hostnames                | empty          |
| `DB_NAME`     | Neon/Postgres database name                | `postgres`     |
| `DB_USER`     | Database user                              | `postgres`     |
| `DB_PASSWORD` | Database password                          | empty          |
| `DB_HOST`     | Database host                              | `localhost`    |
| `DB_PORT`     | Port                                       | `5432`         |

SSL is forced with `sslmode=require` to match Neon defaults.

## Viewing Neon requests

- The `core` app maps directly to the existing `public.users` and `public.requests` tables in Neon; no Django-managed tables are created.
- Run `python manage.py runserver` and visit `http://127.0.0.1:8001/requests/` to see every request pulled straight from `public.requests` (joined with `public.users` for requester names).

## Donate 1 Swipe flow

Each request row exposes a “Donate 1 Swipe” button. Pressing it issues a single POST to `/requests/<id>/donate/` that atomically:

1. Decrements the donor’s `public.users.meal_swipes`.
2. Increments the requester’s `public.users.meal_swipes`.
3. Decrements `public.requests.swipes_needed` and flips `status` to `matched` if it hits zero.
4. Awards the donor 1 `donation_point`, which feeds the leaderboard shown at the bottom of the dashboard.

All three updates run inside `transaction.atomic()` with row-level locks (`SELECT ... FOR UPDATE`) to ensure consistency even if multiple devices donate simultaneously.

## Product guide

### Landing + auth

- Visitors are funneled to the SwipeShare cover login page; every route behind `/requests/` or `/requests/add/` requires an authenticated public user session.
- The hero exposes demo usernames/passwords pulled straight from `public.users` to keep onboarding frictionless during demos.

### Dashboard experience

- The dashboard surfaces real-time metrics (open vs matched requests, swipes still needed, personal swipe balance) plus filterable request cards and a live leaderboard.
- Each request card shows campus zone, urgency badge, needed-by timestamp, remaining swipes, and a CTA that respects the donor’s available balance and requester identity.
- Progress bars and leaderboard rows automatically animate as data changes so donors immediately see their impact.
- Every donation action triggers a confirmation prompt so swipes are never sent by accident.

### Banana edition theming

- The entire UI now runs on a banana-inspired palette: warm gold gradients, lime accents, and playful banana stamps to differentiate SwipeShare from similar projects.
- Hero sections and the cover login feature animated banana icons plus updated copy to keep the experience light and memorable.

### Request creation guardrails

- A user may not open a new request while they still have any meal swipes in their account. Attempting to visit `/requests/add/` with a positive balance returns to the dashboard with guidance to use remaining swipes first.
- Backend constraint checks (`_ensure_swipes_constraint`) keep `swipes_needed` non-negative even if external systems write into the same Neon tables.

### Weekly swipe resets

- The platform assumes meal swipes are replenished every Sunday via a scheduled job outside of Django. Once the backend refreshes `public.users.meal_swipes`, the UI automatically reflects the new balance the next time the donor logs in.

## Authors

- Shelton
- Defi
- Rometh
- Rohan
