"""
User models for SkillSetz platform
"""

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """
    Custom User model extending Django's AbstractUser
    """

    email = models.EmailField(_("email address"), unique=True)

    # Override groups and user_permissions to avoid reverse accessor clashes
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name=_('groups'),
        blank=True,
        related_name='custom_user_set',
        related_query_name='custom_user',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name=_('user permissions'),
        blank=True,
        related_name='custom_user_set',
        related_query_name='custom_user',
    )

    # Profile completion tracking
    profile_completed = models.BooleanField(default=False)
    profile_completion_percentage = models.IntegerField(default=0)

    # Metadata
    email_verified = models.BooleanField(default=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    date_of_birth = models.DateField(null=True, blank=True)

    # Analytics
    last_active = models.DateTimeField(auto_now=True)
    login_count = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        db_table = "users"
        verbose_name = _("User")
        verbose_name_plural = _("Users")
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["email"]),
        ]

    def __str__(self):
        return self.email

    def update_profile_completion(self):
        """Calculate and update profile completion percentage"""
        from apps.profiles.models import UserProfile

        try:
            profile = self.profile
            completed_fields = 0
            total_fields = 10

            if profile.bio:
                completed_fields += 1
            if profile.current_title:
                completed_fields += 1
            if profile.years_of_experience > 0:
                completed_fields += 1
            if profile.education_records.exists():
                completed_fields += 1
            if profile.work_experiences.exists():
                completed_fields += 1
            if profile.certifications.exists():
                completed_fields += 1
            if profile.projects.exists():
                completed_fields += 1
            if profile.skills.exists():
                completed_fields += 1
            if profile.resume:
                completed_fields += 1
            if profile.linkedin_url or profile.github_url:
                completed_fields += 1

            self.profile_completion_percentage = int(
                (completed_fields / total_fields) * 100
            )
            self.profile_completed = self.profile_completion_percentage >= 80
            self.save(
                update_fields=["profile_completion_percentage", "profile_completed"]
            )

        except UserProfile.DoesNotExist:
            pass


class UserPreference(models.Model):
    """
    User-specific preferences and settings
    """

    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="preferences"
    )

    # Job preferences
    desired_job_titles = models.JSONField(default=list, blank=True)
    desired_industries = models.JSONField(default=list, blank=True)
    desired_locations = models.JSONField(default=list, blank=True)
    remote_preference = models.CharField(
        max_length=20,
        choices=[
            ("REMOTE", "Remote Only"),
            ("HYBRID", "Hybrid"),
            ("ONSITE", "On-site"),
            ("ANY", "Any"),
        ],
        default="ANY",
    )

    # Salary expectations
    min_salary = models.IntegerField(null=True, blank=True)
    max_salary = models.IntegerField(null=True, blank=True)
    currency = models.CharField(max_length=3, default="USD")

    # Learning preferences
    learning_style = models.JSONField(
        default=list, blank=True
    )  # ['visual', 'practical', 'theoretical']
    hours_per_week = models.IntegerField(default=10)  # Hours available for learning

    # Notification settings
    email_notifications = models.BooleanField(default=True)
    job_alerts = models.BooleanField(default=True)
    roadmap_reminders = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "user_preferences"
        verbose_name = _("User Preference")
        verbose_name_plural = _("User Preferences")

    def __str__(self):
        return f"Preferences for {self.user.email}"
