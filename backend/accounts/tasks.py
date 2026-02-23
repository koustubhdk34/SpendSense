from core.celery import app
from django.core.mail import send_mail
from django.conf import settings

@app.task(bind=True, max_retries=3)
def send_otp_email_task(self, email, code):
    subject = "Your OTP code"
    message = f"Your OTP code is {code}. It expires in 10 minutes."
    from_email = settings.EMAIL_HOST_USER or "noreply@example.com"
    # using Django send_mail; console backend shows it in terminal during dev
    send_mail(subject, message, from_email, [email], fail_silently=False)
