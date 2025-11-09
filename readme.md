# HuskerFresh

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
