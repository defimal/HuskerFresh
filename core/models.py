from django.db import models


class PublicUser(models.Model):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=150)
    password = models.CharField(max_length=255)
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


class Offer(models.Model):
    id = models.AutoField(primary_key=True)
    owner = models.ForeignKey(
        PublicUser,
        db_column="owner_user_id",
        related_name="offers",
        on_delete=models.DO_NOTHING,
    )
    meal_type = models.TextField()
    swipes_count = models.IntegerField()
    price_usd = models.DecimalField(max_digits=8, decimal_places=2)
    campus_zone = models.TextField()
    start_at = models.DateTimeField()
    end_at = models.DateTimeField()
    notes = models.TextField(blank=True, null=True)
    status = models.TextField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'public"."offers'
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.owner.username} · {self.meal_type}"
