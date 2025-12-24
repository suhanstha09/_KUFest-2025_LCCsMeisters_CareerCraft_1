"""
Admin configuration for User models
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

from .models import User, UserPreference


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Custom User Admin
    """

    list_display = [
        "email",
        "username",
        "first_name",
        "last_name",
        "email_verified",
        "profile_completed",
        "profile_completion_percentage",
        "is_staff",
        "is_active",
        "created_at",
    ]
    list_filter = [
        "is_staff",
        "is_active",
        "email_verified",
        "profile_completed",
        "created_at",
    ]
    search_fields = ["email", "username", "first_name", "last_name"]
    ordering = ["-created_at"]

    fieldsets = (
        (None, {"fields": ("username", "email", "password")}),
        (
            _("Personal info"),
            {"fields": ("first_name", "last_name", "phone_number", "date_of_birth")},
        ),
        (
            _("Profile Status"),
            {
                "fields": (
                    "email_verified",
                    "profile_completed",
                    "profile_completion_percentage",
                )
            },
        ),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        (
            _("Analytics"),
            {"fields": ("last_active", "login_count", "last_login")},
        ),
        (_("Important dates"), {"fields": ("created_at", "updated_at")}),
    )

    readonly_fields = [
        "created_at",
        "updated_at",
        "last_active",
        "login_count",
        "profile_completion_percentage",
    ]

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "username",
                    "email",
                    "password1",
                    "password2",
                    "first_name",
                    "last_name",
                ),
            },
        ),
    )


@admin.register(UserPreference)
class UserPreferenceAdmin(admin.ModelAdmin):
    """
    UserPreference Admin
    """

    list_display = [
        "user",
        "remote_preference",
        "min_salary",
        "max_salary",
        "currency",
        "hours_per_week",
        "email_notifications",
        "job_alerts",
    ]
    list_filter = [
        "remote_preference",
        "email_notifications",
        "job_alerts",
        "roadmap_reminders",
    ]
    search_fields = ["user__email", "user__username"]
    readonly_fields = ["created_at", "updated_at"]

    fieldsets = (
        (_("User"), {"fields": ("user",)}),
        (
            _("Job Preferences"),
            {
                "fields": (
                    "desired_job_titles",
                    "desired_industries",
                    "desired_locations",
                    "remote_preference",
                )
            },
        ),
        (
            _("Salary Expectations"),
            {"fields": ("min_salary", "max_salary", "currency")},
        ),
        (
            _("Learning Preferences"),
            {"fields": ("learning_style", "hours_per_week")},
        ),
        (
            _("Notification Settings"),
            {"fields": ("email_notifications", "job_alerts", "roadmap_reminders")},
        ),
        (_("Timestamps"), {"fields": ("created_at", "updated_at")}),
    )
