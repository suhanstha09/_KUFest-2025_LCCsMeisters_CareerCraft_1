"""
URL Configuration for users app
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    CustomTokenObtainPairView,
    UserRegistrationView,
    UserDetailView,
    ChangePasswordView,
    UserPreferenceView,
    DeleteAccountView,
    ProfileCompletionView,
    verify_email,
    request_password_reset,
    reset_password,
)

app_name = "users"

urlpatterns = [
    # Authentication endpoints
    path("auth/register/", UserRegistrationView.as_view(), name="register"),
    path("auth/login/", CustomTokenObtainPairView.as_view(), name="login"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/verify-email/", verify_email, name="verify_email"),
    path(
        "auth/password-reset/request/",
        request_password_reset,
        name="request_password_reset",
    ),
    path("auth/password-reset/confirm/", reset_password, name="reset_password"),
    # User profile endpoints
    path("profile/", UserDetailView.as_view(), name="user_profile"),
    path("profile/password/", ChangePasswordView.as_view(), name="change_password"),
    path("profile/preferences/", UserPreferenceView.as_view(), name="user_preferences"),
    path(
        "profile/completion/",
        ProfileCompletionView.as_view(),
        name="profile_completion",
    ),
    path("profile/delete/", DeleteAccountView.as_view(), name="delete_account"),
]
