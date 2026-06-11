import smtplib
from email.mime.text import MIMEText
from django.conf import settings


def send_otp_email(receiver_email, otp):
    subject = "FarmConnect OTP"
    body = f"Your OTP is {otp}"

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = settings.EMAIL_HOST_USER
    msg["To"] = receiver_email

    host = getattr(settings, "EMAIL_HOST", "smtp.gmail.com")
    port = getattr(settings, "EMAIL_PORT", 587)
    use_tls = getattr(settings, "EMAIL_USE_TLS", True)

    try:
        server = smtplib.SMTP(host, port, timeout=10)
        if use_tls:
            server.starttls()

        server.login(
            settings.EMAIL_HOST_USER,
            settings.EMAIL_HOST_PASSWORD
        )

        server.sendmail(
            settings.EMAIL_HOST_USER,
            receiver_email,
            msg.as_string()
        )

        server.quit()
        return True, None
    except Exception as exc:
        return False, str(exc)
