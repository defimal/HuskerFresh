from django.db import models


class PublicUser(models.Model):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=150)
    password = models.CharField(max_length=255)
    meal_swipes = models.IntegerField()
    donation_points = models.IntegerField(default=0)
    created_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'public"."users'

    def __str__(self) -> str:
        return self.username

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

    @property
    def is_active(self):
        return True

    @property
    def is_staff(self):
        return False

    @property
    def is_superuser(self):
        return False


class HelpRequest(models.Model):
    URGENCY_CHOICES = (
        (1, "Low"),
        (2, "Medium"),
        (3, "High"),
        (4, "Critical"),
        (5, "Emergency"),
    )

    id = models.AutoField(primary_key=True)
    requester = models.ForeignKey(
        PublicUser,
        db_column="requester_user_id",
        related_name="requests",
        on_delete=models.DO_NOTHING,
    )
    need_type = models.TextField()
    description = models.TextField()
    campus_zone = models.TextField()
    needed_before = models.DateTimeField()
    urgency = models.IntegerField(choices=URGENCY_CHOICES)
    swipes_needed = models.IntegerField()
    status = models.TextField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'public"."requests'
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.requester.username} · {self.need_type}"

    @property
    def urgency_label(self) -> str:
        return dict(self.URGENCY_CHOICES).get(self.urgency, "Unknown")
