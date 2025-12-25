"""
Serializers for User and UserPreference models
"""

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import UserPreference
from apps.profiles.serializers import CompleteProfileSerializer

User = get_user_model()


class UserPreferenceSerializer(serializers.ModelSerializer):
    """
    Serializer for UserPreference model
    """

    class Meta:
        model = UserPreference
        fields = [
            "id",
            "desired_job_titles",
            "desired_industries",
            "desired_locations",
            "remote_preference",
            "min_salary",
            "max_salary",
            "currency",
            "learning_style",
            "hours_per_week",
            "email_notifications",
            "job_alerts",
            "roadmap_reminders",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class UserSerializer(serializers.ModelSerializer):
    """
    Basic User serializer for general use
    """

    preferences = UserPreferenceSerializer(read_only=True)
    profile = CompleteProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "date_of_birth",
            "email_verified",
            "profile_completed",
            "profile_completion_percentage",
            "last_active",
            "login_count",
            "created_at",
            "updated_at",
            "preferences",
            "profile",
        ]
        read_only_fields = [
            "id",
            "email_verified",
            "profile_completed",
            "profile_completion_percentage",
            "last_active",
            "login_count",
            "created_at",
            "updated_at",
        ]


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration
    """

    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "password",
            "password_confirm",
            "first_name",
            "last_name",
        ]
        read_only_fields = ["id"]

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )
        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
        )

        # Create associated UserPreference
        UserPreference.objects.create(user=user)

        return user


class UserRegistrationResponseSerializer(serializers.Serializer):
    """
    Explicit serializer for registration response (no tokens)
    """
    id = serializers.IntegerField()
    username = serializers.CharField()
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    profile_completed = serializers.BooleanField()
    profile_completion_percentage = serializers.IntegerField()


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating user profile
    """

    class Meta:
        model = User
        fields = [
            "username",
            "first_name",
            "last_name",
            "phone_number",
            "date_of_birth",
        ]

    def validate_username(self, value):
        user = self.context["request"].user
        if User.objects.exclude(pk=user.pk).filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for password change
    """

    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(
        required=True, write_only=True, validators=[validate_password]
    )
    new_password_confirm = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        if attrs["new_password"] != attrs["new_password_confirm"]:
            raise serializers.ValidationError(
                {"new_password": "Password fields didn't match."}
            )
        return attrs

    def validate_old_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value

    def save(self):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save()
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT token serializer that includes additional user data
    """

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token["email"] = user.email
        token["username"] = user.username
        token["profile_completed"] = user.profile_completed

        # Increment login count
        user.login_count += 1
        user.save(update_fields=["login_count"])

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # Add user data to response
        data["user"] = UserSerializer(self.user).data

        return data
