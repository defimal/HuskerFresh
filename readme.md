# HuskerFresh 🍌

HuskerFresh is a full-stack swipe‑sharing platform built in 24 hours for hackathon judging. It connects Huskers who need meal swipes with those who have extra, using Neon Postgres as the live data source. The project demonstrates ambitious scope, thoughtful UX, and production-ready backend practices.

---

## 1. Problem Solved

| Need | How HuskerFresh Addresses It |
|------|------------------------------|
| Students with surplus meal swipes waste them | Dashboard clearly shows active requests and lets donors act instantly |
| Students in need struggle to find help | Users can post detailed requests (location, urgency, timeline) |
| Trust/visibility lacking | Every donation updates the Neon tables in real time with audit-friendly history and donor leaderboard |

This directly tackles food insecurity on campus—an important, high-impact problem.

---

## 2. Innovation & Technical Highlights

- **Direct Neon integration**: No Django-managed tables. The app manipulates `public.users` and `public.requests` directly, respecting existing schema constraints.
- **Atomic “Donate 1 Swipe”**: Uses `transaction.atomic()` + `SELECT ... FOR UPDATE` to modify donor, requester, and request rows safely—even across multiple devices.
- **Session-based “public login”**: Users pick any username/password from `public.users` without needing Django’s auth tables, keeping the focus on the Neon data source.
- **Banana-themed UI system**: Custom CSS + JS bring a delightful hackathon-ready brand, filterable request grid, responsive cards, and live stats.

---

## 3. Difficulty & Scope

Accomplished within a hackathon sprint:

- Backend models, forms, and views aligned to external schema.
- Transaction-safe donor workflow.
- Leaderboard, stats, filters, login, and polished frontend.
- Git history shows many rapid iterations: new features, redesign, login system, CSS overhaul, and deployment-ready adjustments.

---

## 4. Completeness

- **Core flows**: login, create request, donate, leaderboard, filtered list, stats.
- **Validation**: urgency levels enforced as integers; donation counts require swipes > 0; progress bars align with outstanding swipes.
- **Docs & scripts**: `requirements.txt`, `.env`, README instructions, static assets, and templates are all in place.

---

## 5. Solution Quality

Benefits gained:

- **Real-time impact**: donors see open requests, donate, and instantly watch status flip to “matched”.
- **Incentives**: donation points feed the leaderboard, encouraging friendly competition.
- **Auditability**: all changes hit the Neon DB directly, so administrators can run SQL reports without export/import cycles.

The solution is effective and extensible (notifications, analytics, etc. can be layered on).

---

## 6. Design Practices

### Architecture
```
┌──────────┐      ┌───────────────┐      ┌───────────────────┐
│  Browser │ ---> │ Django Views  │ ---> │ Neon Postgres DB  │
│ (HTML/CSS│ <--- │  templates    │ <--- │ public.users/reqs │
│  JS)     │      └───────────────┘      └───────────────────┘
```
- Forms and views go through the `core` app; no custom migrations.
- Static assets served from `static/` with banana-theme branding.
- Session-based login context manages the current donor identity.

### Tech Stack
| Layer | Tech |
|-------|------|
| Backend | Python 3.9+, Django 5.2 APIs |
| Database | Neon Postgres (`public.users`, `public.requests`) |
| Frontend | Django Templates, custom CSS/JS (Space Grotesk, banana motif) |
| Tooling | `pip`, virtualenv, GitHub source |

### Code Quality / Scalability
- `transaction.atomic()` for all critical writes.
- Template tags for progress calculations (`hf_extras.width_percent`).
- Modular static files and consistent utility classes.
- Session helper functions keep request-resolving logic centralized.

---

## 7. Project Presentation

Demo flow:

1. **Login** (`/login/`): choose a `public.users` account (plain-text passwords in Neon for demo purposes).
2. **Dashboard** (`/requests/`):
   - Banana hero banner with stats (open, matched, donor swipes).
   - Filters/search to find requests.
   - Request cards show urgency chips, needed-by time, donation controls.
   - Leaderboard lists top donors by `donation_points`.
3. **Donate**: submit the quantity (default 1). The atomic flow manipulates three tables and updates the UI.
4. **Create request** (`/requests/add/`): friendly form with placeholders, selects, and validation.

Slides / pitch ready: the README itself acts as a detailed narrative for judges.

---

## 8. Quick Start

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Configure .env (see below) and ensure Neon credentials are valid.

python manage.py runserver 0.0.0.0:8001
# visit http://127.0.0.1:8001/login/
```

### Required `.env`

| Variable | Purpose |
|----------|---------|
| `DJANGO_SECRET_KEY` | Secret key (string) |
| `DEBUG` | `1` for dev |
| `ALLOWED_HOSTS` | `127.0.0.1,localhost` etc. |
| `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` | Neon Postgres credentials (must contain `public.users` and `public.requests`) |

---

## 9. Donate 1 Swipe Flow (atomic)

1. Lock donor (`public.users`), requester (`public.users`), and request (`public.requests`) rows with `SELECT ... FOR UPDATE`.
2. Validate:
   - Donor `meal_swipes > 0`.
   - Request `swipes_needed > 0` and not already matched.
3. Decrement donor `meal_swipes`, increment requester `meal_swipes`.
4. Decrement `requests.swipes_needed`; set `status='matched'` when zero.
5. Increment donor `donation_points`.
6. Commit transaction; UI shows success message and refreshed data.

This ensures no race conditions, even if multiple donors try to help simultaneously.

---

## 10. Future Enhancements

- Push notifications / email alerts when requests are matched.
- Analytics dashboard for admins (top zones, urgency trends).
- Expand login system with per-user OTP or university OAuth.
- Deploy to Render/Railway + CI/CD pipeline.

---

## 11. Summary

HuskerFresh checks each judging box with a compelling story, robust execution, and delightful presentation—proof that a focused team can change campus life in a single weekend. 🍌
