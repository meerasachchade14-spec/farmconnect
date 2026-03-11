from django.urls import path
from .views import (
register_user,
verify_otp_view,
login_user,
forgot_password,
reset_password
)

urlpatterns = [
    path("register/", register_user),
    path("verify-otp/", verify_otp_view),
    path("login/", login_user),
    path("forgot-password/", forgot_password),
    path("reset-password/", reset_password),
]