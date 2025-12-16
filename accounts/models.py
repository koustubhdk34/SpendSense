from django.db import models
from django.contrib.auth.models import User
import uuid
from datetime import timedelta
from django.utils import timezone

class EmailOTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='otp_codes')
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(minutes=10)
        return super().save(*args, **kwargs)

    def is_valid(self):
        return timezone.now() <= self.expires_at
