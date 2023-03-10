from django.contrib.auth.models import AbstractUser, UserManager
from django.db.models import CharField, BooleanField
from django.urls import reverse
from django.utils.translation import ugettext_lazy as _


class CustomUserManager(UserManager):
    def get_by_natural_key(self, username):
        case_insensitive_username_field = '{}__iexact'.format(self.model.USERNAME_FIELD)
        return self.get(**{case_insensitive_username_field: username})

class User(AbstractUser):
    objects = CustomUserManager()

    # First Name and Last Name do not cover name patterns
    # around the globe.
    name = CharField(_("Name of User"), blank=True, max_length=255)
    onboarding_email_sent = BooleanField(_("Onboarding Email Sent"), default=False)

    def get_absolute_url(self):
        return reverse("users:detail", kwargs={"username": self.username})
