import json
import random
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import User
from .otp_store import save_otp, verify_otp
from .email_utils import send_otp_email


# REGISTER USER
@csrf_exempt
def register_user(request):

    if request.method == "POST":
        data = json.loads(request.body)

        email = data.get("email")
        password = data.get("password")
        role = data.get("role")

        if User.objects.filter(email=email).exists():
            return JsonResponse({"error": "User already exists"}, status=400)

        otp = random.randint(100000, 999999)

        save_otp(email, str(otp))
        send_otp_email(email, otp)

        return JsonResponse({"message": "OTP sent to email"})


# VERIFY OTP
@csrf_exempt
def verify_otp_view(request):

    if request.method == "POST":
        data = json.loads(request.body)

        email = data.get("email")
        otp = data.get("otp")
        password = data.get("password")
        role = data.get("role")

        if verify_otp(email, otp):

            User.objects.create(
                email=email,
                password=password,
                role=role
            )

            return JsonResponse({"message": "Registration successful"})

        return JsonResponse({"error": "Invalid OTP"}, status=400)


# LOGIN USER
@csrf_exempt
def login_user(request):

    if request.method == "POST":
        data = json.loads(request.body)

        email = data.get("email")
        password = data.get("password")

        try:
            user = User.objects.get(email=email, password=password)

            return JsonResponse({
                "message": "Login successful",
                "role": user.role,
                "token": "sampletoken123"
            })

        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid credentials"}, status=400)


# FORGOT PASSWORD
@csrf_exempt
def forgot_password(request):

    if request.method == "POST":
        data = json.loads(request.body)

        email = data.get("email")

        otp = random.randint(100000, 999999)

        save_otp(email, str(otp))
        send_otp_email(email, otp)

        return JsonResponse({"message": "OTP sent for password reset"})


# RESET PASSWORD
@csrf_exempt
def reset_password(request):

    if request.method == "POST":
        data = json.loads(request.body)

        email = data.get("email")
        otp = data.get("otp")
        new_password = data.get("password")

        if verify_otp(email, otp):

            user = User.objects.get(email=email)
            user.password = new_password
            user.save()

            return JsonResponse({"message": "Password reset successful"})

        return JsonResponse({"error": "Invalid OTP"}, status=400)