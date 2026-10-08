from django.core.mail import send_mail
from django.conf import settings


def send_otp_email(receiver_email, otp):
    subject = "FarmConnect OTP"
    body = f"""
Welcome to FarmConnect!

Your One-Time Password (OTP) is:

{otp}

This OTP is valid for 10 minutes.

Do not share this OTP with anyone.

Regards,
FarmConnect Team
"""

    send_mail(
        subject,
        body,
        settings.EMAIL_HOST_USER,
        [receiver_email],
        fail_silently=False,
    )