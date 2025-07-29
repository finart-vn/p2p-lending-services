# P2P Lending Platform - Authentication Flow Specification

## 📋 Overview

This document outlines the complete authentication and authorization system for the P2P lending platform, built on a microservices architecture with RabbitMQ messaging.

## 🏗️ Architecture Components

### Services
- **API Gateway** (Port 3000) - Entry point for all client requests
- **Auth Service** (Port 3001) - JWT token management and validation
- **User Service** (Port 3002) - User management and data persistence
- **Notification Service** (Port 3003) - Email, SMS, and in-app notifications

### Message Queues
- **auth_queue** - Authentication operations
- **user_queue** - User management operations  
- **notification_queue** - Notification delivery

### Databases
- **PostgreSQL** - Primary user data storage
- **Redis** - JWT token cache and session management
- **Token Blacklist** - Revoked token storage

---

## 🔐 Authentication Flows

### 1. User Registration Flow

**Endpoint:** `POST /auth/register`

**Request Payload:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-15",
  "role": "BORROWER"  // BORROWER | LENDER | ADMIN
}
```

**Flow Steps:**
1. **API Gateway** validates input and sends `user.register` to auth_queue
2. **Auth Service** validates password strength and email format
3. **Auth Service** sends `create_user` to user_queue
4. **User Service** checks email uniqueness and creates user record
5. **User Service** triggers `email.verification` to notification_queue
6. **Notification Service** sends verification email with token
7. **Response** returns user ID and verification status

**Response:**
```json
{
  "success": true,
  "userId": "12345",
  "message": "Registration successful. Please verify your email.",
  "verificationRequired": true
}
```

**Database Changes:**
- Creates user record with `status: INACTIVE`
- Generates email verification token (expires in 24h)

---

### 2. Email Verification Flow

**Endpoint:** `POST /auth/verify-email`

**Request Payload:**
```json
{
  "email": "user@example.com",
  "verificationToken": "abc123xyz789"
}
```

**Flow Steps:**
1. **API Gateway** sends `auth.verify_email` to auth_queue
2. **Auth Service** validates token and expiry
3. **Auth Service** sends `user.activate` to user_queue
4. **User Service** updates user status to `ACTIVE`
5. **User Service** sets `emailVerifiedAt` timestamp

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "redirectUrl": "/login"
}
```

---

### 3. Login Flow

**Endpoint:** `POST /auth/login`

**Request Payload:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "rememberMe": false
}
```

**Flow Steps:**
1. **API Gateway** sends `auth.login` to auth_queue
2. **Auth Service** sends `user.validate_credentials` to user_queue
3. **User Service** verifies password hash and user status
4. **Auth Service** generates JWT access token (15min) and refresh token (7d)
5. **Auth Service** stores tokens in Redis cache
6. **Auth Service** checks if 2FA is enabled for user
7. If 2FA enabled, generates OTP and triggers notification

**Response (No 2FA):**
```json
{
  "success": true,
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "tokenType": "Bearer",
    "expiresIn": 900
  },
  "user": {
    "id": "12345",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roles": ["BORROWER"],
    "kycStatus": "PENDING"
  }
}
```

**Response (2FA Required):**
```json
{
  "success": true,
  "requiresTwoFactor": true,
  "otpSent": true,
  "message": "OTP sent to your registered phone number",
  "sessionId": "temp_session_123"
}
```

---

### 4. Two-Factor Authentication (OTP) Flow

**Endpoint:** `POST /auth/verify-otp`

**Request Payload:**
```json
{
  "sessionId": "temp_session_123",
  "otpCode": "123456"
}
```

**Flow Steps:**
1. **API Gateway** sends `auth.verify_otp` to auth_queue
2. **Auth Service** validates OTP code and session
3. **Auth Service** generates final JWT tokens
4. **Auth Service** clears temporary session

**Response:**
```json
{
  "success": true,
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "tokenType": "Bearer",
    "expiresIn": 900
  },
  "user": {
    "id": "12345",
    "email": "user@example.com",
    "roles": ["BORROWER"]
  }
}
```

---

### 5. Token Refresh Flow

**Endpoint:** `POST /auth/refresh`

**Request Payload:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Flow Steps:**
1. **API Gateway** sends `auth.refresh_token` to auth_queue
2. **Auth Service** validates refresh token signature and expiry
3. **Auth Service** checks token against blacklist
4. **Auth Service** generates new access token
5. **Auth Service** optionally rotates refresh token (security best practice)

**Response:**
```json
{
  "success": true,
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "tokenType": "Bearer",
    "expiresIn": 900
  }
}
```

---

### 6. Password Reset Flow

**Step 1:** `POST /auth/forgot-password`
```json
{
  "email": "user@example.com"
}
```

**Flow Steps:**
1. **API Gateway** sends `auth.forgot_password` to auth_queue
2. **Auth Service** sends `user.find_by_email` to user_queue
3. **User Service** validates email exists
4. **Auth Service** generates secure reset token (expires in 1h)
5. **Auth Service** triggers `email.password_reset` to notification_queue
6. **Notification Service** sends password reset email

**Step 2:** `POST /auth/reset-password`
```json
{
  "resetToken": "secure_reset_token_123",
  "newPassword": "NewSecurePassword123!",
  "confirmPassword": "NewSecurePassword123!"
}
```

**Flow Steps:**
1. **Auth Service** validates reset token and expiry
2. **Auth Service** validates new password strength
3. **Auth Service** sends `user.update_password` to user_queue
4. **User Service** updates password hash
5. **Auth Service** invalidates all existing tokens for security

---

### 7. Logout Flow

**Endpoint:** `POST /auth/logout`

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Flow Steps:**
1. **API Gateway** extracts token from Authorization header
2. **API Gateway** sends `auth.logout` to auth_queue
3. **Auth Service** adds token to blacklist
4. **Auth Service** removes token from Redis cache
5. **Auth Service** optionally invalidates all sessions for user

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 🛡️ Authorization & Access Control

### JWT Token Structure

**Access Token Payload:**
```json
{
  "sub": "12345",
  "email": "user@example.com",
  "roles": ["BORROWER"],
  "permissions": ["CREATE_LOAN", "VIEW_PROFILE"],
  "kycStatus": "VERIFIED",
  "iat": 1640995200,
  "exp": 1640996100,
  "type": "access"
}
```

**Refresh Token Payload:**
```json
{
  "sub": "12345",
  "tokenId": "unique_token_id_123",
  "iat": 1640995200,
  "exp": 1641600000,
  "type": "refresh"
}
```

### Role-Based Permissions

#### Borrower Permissions
- `CREATE_LOAN_REQUEST`
- `VIEW_OWN_LOANS`
- `UPDATE_PROFILE`
- `UPLOAD_DOCUMENTS`
- `VIEW_REPAYMENT_SCHEDULE`

#### Lender Permissions  
- `VIEW_LOAN_LISTINGS`
- `CREATE_INVESTMENT`
- `VIEW_PORTFOLIO`
- `VIEW_RETURNS`
- `UPDATE_PROFILE`

#### Admin Permissions
- `APPROVE_KYC`
- `APPROVE_LOANS`
- `VIEW_ALL_USERS`
- `MANAGE_PLATFORM_SETTINGS`
- `GENERATE_REPORTS`
- `MANAGE_USERS`

### Authorization Guard Implementation

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('Access token required');
    }
    
    // Validate token with auth service
    const validation = await this.authClient.validateToken(token);
    
    if (!validation.valid) {
      throw new UnauthorizedException(validation.error);
    }
    
    // Attach user info to request
    request.user = {
      id: validation.userId,
      roles: validation.roles,
      permissions: validation.permissions
    };
    
    return true;
  }
}
```

---

## 🔄 RabbitMQ Message Patterns

### Auth Service Messages

#### `auth.validate_token`
**Request:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```
**Response:**
```json
{
  "valid": true,
  "userId": "12345",
  "roles": ["BORROWER"],
  "permissions": ["CREATE_LOAN"],
  "error": null
}
```

#### `auth.login`
**Request:**
```json
{
  "email": "user@example.com",
  "password": "hashedPassword",
  "userAgent": "Mozilla/5.0...",
  "ipAddress": "192.168.1.1"
}
```

#### `auth.refresh_token`
**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "userAgent": "Mozilla/5.0...",
  "ipAddress": "192.168.1.1"
}
```

### User Service Messages

#### `user.create`
**Request:**
```json
{
  "email": "user@example.com",
  "passwordHash": "hashedPassword",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "BORROWER"
}
```

#### `user.validate_credentials`
**Request:**
```json
{
  "email": "user@example.com",
  "password": "plainPassword"
}
```

#### `user.get_by_id`
**Request:**
```json
{
  "userId": "12345"
}
```

### Notification Service Messages

#### `notification.send_email`
**Request:**
```json
{
  "to": "user@example.com",
  "template": "email_verification",
  "data": {
    "firstName": "John",
    "verificationLink": "https://app.com/verify?token=abc123"
  }
}
```

#### `notification.send_sms`
**Request:**
```json
{
  "to": "+1234567890",
  "message": "Your OTP code is: 123456"
}
```

---

## 🔒 Security Considerations

### Password Security
- **Minimum Requirements:** 8 characters, uppercase, lowercase, number, special character
- **Hashing:** bcrypt with salt rounds ≥ 12
- **Rate Limiting:** Max 5 failed attempts per 15 minutes
- **Password History:** Prevent reusing last 5 passwords

### Token Security
- **Access Token Expiry:** 15 minutes
- **Refresh Token Expiry:** 7 days
- **Token Rotation:** Refresh tokens are rotated on each use
- **Blacklisting:** Tokens added to Redis blacklist on logout/compromise
- **Secure Storage:** HttpOnly, Secure, SameSite cookies for web clients

### Session Security
- **Device Tracking:** Track active sessions per user
- **Concurrent Sessions:** Limit to 5 active sessions
- **Location Monitoring:** Alert on login from new locations
- **Suspicious Activity:** Auto-lock account on multiple failed attempts

### 2FA Security
- **OTP Expiry:** 5 minutes
- **Rate Limiting:** Max 3 OTP requests per 10 minutes
- **Backup Codes:** Provide 10 single-use backup codes
- **Recovery:** Email-based account recovery for 2FA

---

## 📊 Database Schema Updates

### Add to `users` table:
```sql
ALTER TABLE users ADD COLUMN two_factor_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN two_factor_secret VARCHAR(255);
ALTER TABLE users ADD COLUMN backup_codes JSON;
ALTER TABLE users ADD COLUMN last_login_at TIMESTAMP;
ALTER TABLE users ADD COLUMN last_login_ip VARCHAR(45);
ALTER TABLE users ADD COLUMN failed_login_attempts INT DEFAULT 0;
ALTER TABLE users ADD COLUMN locked_until TIMESTAMP;
```

### Create `user_sessions` table:
```sql
CREATE TABLE user_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    session_token VARCHAR(255) UNIQUE NOT NULL,
    device_info TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    last_activity_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Create `password_resets` table:
```sql
CREATE TABLE password_resets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 Implementation Roadmap

### Phase 1: Basic Authentication
1. ✅ JWT token validation
2. ✅ User registration/login
3. ✅ Password hashing
4. ❌ Email verification
5. ❌ Token refresh mechanism

### Phase 2: Enhanced Security
1. ❌ Two-factor authentication
2. ❌ Password reset flow
3. ❌ Session management
4. ❌ Rate limiting
5. ❌ Account lockout

### Phase 3: Advanced Features
1. ❌ Device tracking
2. ❌ Suspicious activity detection
3. ❌ Backup codes
4. ❌ Security audit logs
5. ❌ Admin user management

---

## 📚 API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | User registration | No |
| POST | `/auth/verify-email` | Email verification | No |
| POST | `/auth/login` | User login | No |
| POST | `/auth/verify-otp` | 2FA verification | No |
| POST | `/auth/refresh` | Token refresh | No |
| POST | `/auth/forgot-password` | Password reset request | No |
| POST | `/auth/reset-password` | Password reset | No |
| POST | `/auth/logout` | User logout | Yes |
| GET | `/auth/me` | Get current user | Yes |
| POST | `/auth/change-password` | Change password | Yes |
| POST | `/auth/enable-2fa` | Enable 2FA | Yes |
| POST | `/auth/disable-2fa` | Disable 2FA | Yes |
| GET | `/auth/sessions` | List active sessions | Yes |
| DELETE | `/auth/sessions/:id` | Revoke session | Yes |

---

*Last Updated: December 2024*
*Version: 1.0* 