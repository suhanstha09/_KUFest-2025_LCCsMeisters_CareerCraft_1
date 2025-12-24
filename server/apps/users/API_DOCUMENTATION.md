# Users API Documentation

## Base URL
```
/api/users/
```

## Authentication Endpoints

### 1. User Registration
**Endpoint:** `POST /api/users/auth/register/`

**Access:** Public

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "password_confirm": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response (201 Created):**
```json
{
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "profile_completed": false,
    "profile_completion_percentage": 0
  },
  "message": "User registered successfully. Please verify your email."
}
```

---

### 2. User Login (JWT)
**Endpoint:** `POST /api/users/auth/login/`

**Access:** Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "profile_completed": false,
    "profile_completion_percentage": 0
  }
}
```

---

### 3. Token Refresh
**Endpoint:** `POST /api/users/auth/token/refresh/`

**Access:** Public

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response (200 OK):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

### 4. Verify Email
**Endpoint:** `POST /api/users/auth/verify-email/`

**Access:** Authenticated

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "message": "Email verified successfully."
}
```

---

### 5. Request Password Reset
**Endpoint:** `POST /api/users/auth/password-reset/request/`

**Access:** Public

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset email sent if account exists."
}
```

---

### 6. Reset Password
**Endpoint:** `POST /api/users/auth/password-reset/confirm/`

**Access:** Public

**Request Body:**
```json
{
  "token": "reset-token-here",
  "new_password": "NewSecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset successfully."
}
```

---

## User Profile Endpoints

### 7. Get/Update User Profile
**Endpoint:** `GET/PATCH /api/users/profile/`

**Access:** Authenticated

**Headers:**
```
Authorization: Bearer <access_token>
```

**GET Response (200 OK):**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+1234567890",
  "date_of_birth": "1990-01-01",
  "email_verified": true,
  "profile_completed": false,
  "profile_completion_percentage": 25,
  "last_active": "2025-12-21T12:00:00Z",
  "login_count": 5,
  "created_at": "2025-12-01T10:00:00Z",
  "updated_at": "2025-12-21T12:00:00Z",
  "preferences": {
    "id": 1,
    "desired_job_titles": ["Software Engineer", "Backend Developer"],
    "desired_industries": ["Technology", "Finance"],
    "desired_locations": ["New York", "Remote"],
    "remote_preference": "HYBRID",
    "min_salary": 80000,
    "max_salary": 120000,
    "currency": "USD"
  }
}
```

**PATCH Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Smith",
  "phone_number": "+1234567890",
  "date_of_birth": "1990-01-01"
}
```

---

### 8. Change Password
**Endpoint:** `POST /api/users/profile/password/`

**Access:** Authenticated

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "old_password": "OldPass123!",
  "new_password": "NewPass123!",
  "new_password_confirm": "NewPass123!"
}
```

**Response (200 OK):**
```json
{
  "message": "Password changed successfully."
}
```

---

### 9. Get/Update User Preferences
**Endpoint:** `GET/PATCH /api/users/profile/preferences/`

**Access:** Authenticated

**Headers:**
```
Authorization: Bearer <access_token>
```

**GET Response (200 OK):**
```json
{
  "id": 1,
  "desired_job_titles": ["Software Engineer", "Backend Developer"],
  "desired_industries": ["Technology", "Finance"],
  "desired_locations": ["New York", "Remote"],
  "remote_preference": "HYBRID",
  "min_salary": 80000,
  "max_salary": 120000,
  "currency": "USD",
  "learning_style": ["practical", "visual"],
  "hours_per_week": 10,
  "email_notifications": true,
  "job_alerts": true,
  "roadmap_reminders": true,
  "created_at": "2025-12-01T10:00:00Z",
  "updated_at": "2025-12-21T12:00:00Z"
}
```

**PATCH Request Body:**
```json
{
  "desired_job_titles": ["Senior Software Engineer"],
  "remote_preference": "REMOTE",
  "min_salary": 100000,
  "max_salary": 150000,
  "job_alerts": false
}
```

---

### 10. Profile Completion Status
**Endpoint:** `GET /api/users/profile/completion/`

**Access:** Authenticated

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "profile_completed": false,
  "completion_percentage": 45
}
```

---

### 11. Delete Account
**Endpoint:** `DELETE /api/users/profile/delete/`

**Access:** Authenticated

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (204 No Content)**

---

## Error Responses

### 400 Bad Request
```json
{
  "field_name": ["Error message here"]
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

---

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <access_token>
```

Access tokens expire after 1 hour. Use the refresh token endpoint to get a new access token.
