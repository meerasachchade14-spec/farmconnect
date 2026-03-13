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

    server = smtplib.SMTP("smtp.gmail.com",587)
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