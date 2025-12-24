# Users App

This app handles user authentication, registration, and profile management for the SkillSetz platform.

## API Documentation

### Interactive Documentation (Swagger UI)
```
http://localhost:8000/api/docs/
```
- Interactive API testing interface
- Try endpoints directly from browser
- Built-in authentication support

### Alternative Documentation (ReDoc)
```
http://localhost:8000/api/redoc/
```
- Clean, readable documentation
- Three-panel layout
- Search functionality

### OpenAPI Schema
```
http://localhost:8000/api/schema/
```
- Download raw OpenAPI 3.0 schema
- Import into Postman, Insomnia, etc.

See [SWAGGER_SETUP.md](../../SWAGGER_SETUP.md) for detailed documentation guide.

## Features

- User registration with email and password
- JWT-based authentication
- User profile management
- User preferences management
- Password change functionality
- Email verification (placeholder)
- Password reset (placeholder)
- Profile completion tracking
- Account deletion

## Models

### User
Custom user model extending Django's `AbstractUser` with additional fields:
- Email (unique, used for authentication)
- Profile completion tracking
- Email verification status
- Phone number
- Date of birth
- Login analytics

### UserPreference
User-specific preferences including:
- Job preferences (titles, industries, locations, remote preference)
- Salary expectations
- Learning preferences
- Notification settings

## API Endpoints

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API documentation.

### Quick Reference:
- `POST /api/users/auth/register/` - Register new user
- `POST /api/users/auth/login/` - Login and get JWT tokens
- `POST /api/users/auth/token/refresh/` - Refresh access token
- `GET/PATCH /api/users/profile/` - Get/Update user profile
- `POST /api/users/profile/password/` - Change password
- `GET/PATCH /api/users/profile/preferences/` - Get/Update user preferences
- `GET /api/users/profile/completion/` - Get profile completion status
- `DELETE /api/users/profile/delete/` - Delete account

## Serializers

- `UserSerializer` - Basic user data serialization
- `UserRegistrationSerializer` - User registration with validation
- `UserUpdateSerializer` - Profile update
- `ChangePasswordSerializer` - Password change with validation
- `UserPreferenceSerializer` - User preferences
- `CustomTokenObtainPairSerializer` - JWT token with custom claims

## Views

All views use Django REST Framework class-based and function-based views:
- `UserRegistrationView` - Handle user registration
- `CustomTokenObtainPairView` - Custom JWT login
- `UserDetailView` - Retrieve and update user profile
- `ChangePasswordView` - Password change
- `UserPreferenceView` - Manage user preferences
- `ProfileCompletionView` - Get profile completion status
- `DeleteAccountView` - Account deletion

## Admin

Custom admin interface for managing users and preferences with:
- Advanced filtering
- Search capabilities
- Readonly fields for system-generated data
- Organized fieldsets

## Usage

### Installation
```bash
pip install -r requirements.txt
```

### Run Migrations
```bash
python manage.py migrate
```

### Create Superuser
```bash
python manage.py createsuperuser
```

### Run Server
```bash
python manage.py runserver
```

## Testing

Example registration using curl:
```bash
curl -X POST http://localhost:8000/api/users/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "password_confirm": "SecurePass123!",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

Example login:
```bash
curl -X POST http://localhost:8000/api/users/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

## Notes

- Email verification and password reset are placeholder implementations
- In production, implement actual email sending functionality
- Consider adding rate limiting for authentication endpoints
- Implement proper token blacklisting for logout functionality
