"""
Views for User management
"""

from django.contrib.auth import get_user_model
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter, OpenApiExample
from drf_spectacular.types import OpenApiTypes

from .models import UserPreference
from .serializers import (
    UserSerializer,
    UserRegistrationSerializer,
    UserUpdateSerializer,
    ChangePasswordSerializer,
    UserPreferenceSerializer,
    CustomTokenObtainPairSerializer,
)

User = get_user_model()


@extend_schema(
    tags=['Authentication'],
    summary='Login and obtain JWT tokens',
    description='Authenticate user with email and password to receive access and refresh tokens',
    responses={200: CustomTokenObtainPairSerializer},
)
class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom JWT token view with additional user data
    """

    serializer_class = CustomTokenObtainPairSerializer


@extend_schema(
    tags=['Authentication'],
    summary='Register a new user',
    description='Create a new user account with email, username, and password',
    request=UserRegistrationSerializer,
    responses={
        201: UserSerializer,
        400: OpenApiTypes.OBJECT,
    },
    examples=[
        OpenApiExample(
            'Registration Example',
            value={
                'username': 'johndoe',
                'email': 'john@example.com',
                'password': 'SecurePass123!',
                'password_confirm': 'SecurePass123!',
                'first_name': 'John',
                'last_name': 'Doe'
            },
            request_only=True,
        ),
    ],
)
class UserRegistrationView(generics.CreateAPIView):
    """
    API endpoint for user registration
    """

    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response(
            {
                "user": UserSerializer(user).data,
                "message": "User registered successfully. Please verify your email.",
            },
            status=status.HTTP_201_CREATED,
        )


@extend_schema_view(
    get=extend_schema(
        tags=['User Profile'],
        summary='Get current user profile',
        description='Retrieve the authenticated user profile information',
        responses={200: UserSerializer},
    ),
    patch=extend_schema(
        tags=['User Profile'],
        summary='Update user profile',
        description='Update the authenticated user profile information',
        request=UserUpdateSerializer,
        responses={200: UserSerializer},
    ),
    put=extend_schema(
        tags=['User Profile'],
        summary='Update user profile',
        description='Update the authenticated user profile information',
        request=UserUpdateSerializer,
        responses={200: UserSerializer},
    ),
)
class UserDetailView(generics.RetrieveUpdateAPIView):
    """
    API endpoint to retrieve and update current user details
    """

    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = UserUpdateSerializer(
            instance, data=request.data, partial=partial, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(UserSerializer(instance).data)


@extend_schema(
    tags=['User Profile'],
    summary='Change password',
    description='Change the password for the authenticated user',
    request=ChangePasswordSerializer,
    responses={
        200: OpenApiTypes.OBJECT,
        400: OpenApiTypes.OBJECT,
    },
)
class ChangePasswordView(APIView):
    """
    API endpoint for changing password
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {"message": "Password changed successfully."}, status=status.HTTP_200_OK
        )


@extend_schema_view(
    get=extend_schema(
        tags=['User Preferences'],
        summary='Get user preferences',
        description='Retrieve preferences and settings for the authenticated user',
        responses={200: UserPreferenceSerializer},
    ),
    patch=extend_schema(
        tags=['User Preferences'],
        summary='Update user preferences',
        description='Update preferences and settings for the authenticated user',
        request=UserPreferenceSerializer,
        responses={200: UserPreferenceSerializer},
    ),
    put=extend_schema(
        tags=['User Preferences'],
        summary='Update user preferences',
        description='Update preferences and settings for the authenticated user',
        request=UserPreferenceSerializer,
        responses={200: UserPreferenceSerializer},
    ),
)
class UserPreferenceView(generics.RetrieveUpdateAPIView):
    """
    API endpoint to retrieve and update user preferences
    """

    serializer_class = UserPreferenceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Get or create preferences for the current user
        preferences, created = UserPreference.objects.get_or_create(
            user=self.request.user
        )
        return preferences


@extend_schema(
    tags=['User Profile'],
    summary='Delete user account',
    description='Permanently delete the authenticated user account',
    responses={204: None},
)
class DeleteAccountView(APIView):
    """
    API endpoint for account deletion
    """

    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        user = request.user
        user.delete()

        return Response(
            {"message": "Account deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )


@extend_schema(
    tags=['User Profile'],
    summary='Get profile completion status',
    description='Calculate and retrieve the profile completion percentage',
    responses={200: OpenApiTypes.OBJECT},
)
class ProfileCompletionView(APIView):
    """
    API endpoint to get profile completion status
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        user.update_profile_completion()

        return Response(
            {
                "profile_completed": user.profile_completed,
                "completion_percentage": user.profile_completion_percentage,
            },
            status=status.HTTP_200_OK,
        )


@extend_schema(
    tags=['Authentication'],
    summary='Verify email',
    description='Verify user email address (placeholder implementation)',
    request=None,
    responses={200: OpenApiTypes.OBJECT},
)
@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def verify_email(request):
    """
    API endpoint to verify user email (placeholder for actual implementation)
    """
    # In a real implementation, this would verify a token sent via email
    user = request.user
    user.email_verified = True
    user.save(update_fields=["email_verified"])

    return Response(
        {"message": "Email verified successfully."}, status=status.HTTP_200_OK
    )


@extend_schema(
    tags=['Authentication'],
    summary='Request password reset',
    description='Send password reset email to the user (placeholder implementation)',
    request={
        'type': 'object',
        'properties': {
            'email': {'type': 'string', 'format': 'email'}
        },
        'required': ['email']
    },
    responses={200: OpenApiTypes.OBJECT},
)
@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def request_password_reset(request):
    """
    API endpoint to request password reset (placeholder for actual implementation)
    """
    email = request.data.get("email")

    if not email:
        return Response(
            {"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST
        )

    # In a real implementation, this would send a password reset email
    # For now, just return a success message
    return Response(
        {"message": "Password reset email sent if account exists."},
        status=status.HTTP_200_OK,
    )


@extend_schema(
    tags=['Authentication'],
    summary='Reset password',
    description='Reset password using reset token (placeholder implementation)',
    request={
        'type': 'object',
        'properties': {
            'token': {'type': 'string'},
            'new_password': {'type': 'string', 'format': 'password'}
        },
        'required': ['token', 'new_password']
    },
    responses={200: OpenApiTypes.OBJECT},
)
@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def reset_password(request):
    """
    API endpoint to reset password with token (placeholder for actual implementation)
    """
    token = request.data.get("token")
    new_password = request.data.get("new_password")

    if not token or not new_password:
        return Response(
            {"error": "Token and new password are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # In a real implementation, this would verify the token and reset the password
    # For now, just return a success message
    return Response(
        {"message": "Password reset successfully."}, status=status.HTTP_200_OK
    )
