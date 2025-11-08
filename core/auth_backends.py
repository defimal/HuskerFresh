import logging
from typing import Optional

from django.contrib.auth.backends import BaseBackend
from django.db import connection

from .models import PublicUser

logger = logging.getLogger(__name__)


class PublicUsersBackend(BaseBackend):
    """
    Authenticates against the public.users table in Neon.
    Passwords are stored in plaintext so we compare directly.
    """

    def authenticate(
        self, request, username: Optional[str] = None, password: Optional[str] = None, **kwargs
    ):
        if username is None or password is None:
            return None

        user = PublicUser.objects.filter(username=username).first()

        db_settings = connection.settings_dict
        logger.info(
            "PublicUsersBackend lookup",
            extra={
                "database": db_settings.get("NAME"),
                "host": db_settings.get("HOST"),
                "username": username,
                "matched": bool(user),
            },
        )

        if not user or user.password != password:
            return None

        return user

    def get_user(self, user_id):
        return PublicUser.objects.filter(pk=user_id).first()
