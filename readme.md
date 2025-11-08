# HuskerFresh

Simple Django app that showcases marketplace-style offers backed by Neon Postgres.

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

## Viewing Neon offers

- The `core` app maps directly to the existing `public.users` and `public.offers` tables in Neon; no Django-managed tables are created.
- Run `python manage.py runserver` and visit `http://127.0.0.1:8001/offers/` to see every offer pulled straight from `public.offers` (joined with `public.users` for owner names).
