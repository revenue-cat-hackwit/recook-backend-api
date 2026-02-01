# ReCook Authentication System

Complete authentication system with JWT, OTP verification, and password reset functionality.

## 🚀 Features

- ✅ User registration with email verification (OTP)
- ✅ Login with JWT authentication
- ✅ Password reset via email
- ✅ Protected routes with auth middleware
- ✅ MongoDB integration with Mongoose
- ✅ Email notifications with Nodemailer
- ✅ TypeScript support

## 📦 Installation

Packages already installed:
- mongoose
- bcryptjs
- jsonwebtoken
- nodemailer
- @types/bcryptjs, @types/jsonwebtoken, @types/nodemailer

## 🔧 Environment Setup

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Update `.env.local` with your credentials:
```env
MONGODB_URI=mongodb://localhost:27017/recook
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Gmail Setup (for EMAIL_USER & EMAIL_PASSWORD)
1. Enable 2-factor authentication in your Google account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the generated password in `EMAIL_PASSWORD`

## 📡 API Endpoints

### 1. Create Account
**POST** `/api/auth/create-account`

Request:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "Account created successfully. Please check your email for OTP verification.",
  "data": {
    "userId": "...",
    "email": "john@example.com"
  }
}
```

### 2. Verify OTP
**POST** `/api/auth/verify-otp`

Request:
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

Response:
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "username": "johndoe",
      "email": "john@example.com",
      "isVerified": true
    }
  }
}
```

### 3. Login
**POST** `/api/auth/login`

Request:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "username": "johndoe",
      "email": "john@example.com",
      "isVerified": true
    }
  }
}
```

### 4. Forgot Password
**POST** `/api/auth/forgot-password`

Request:
```json
{
  "email": "john@example.com"
}
```

Response:
```json
{
  "success": true,
  "message": "Password reset link has been sent to your email"
}
```

### 5. Reset Password
**POST** `/api/auth/reset-password`

Request:
```json
{
  "token": "reset-token-from-email",
  "newPassword": "newpassword123"
}
```

Response:
```json
{
  "success": true,
  "message": "Password has been reset successfully. You can now login with your new password."
}
```

### 6. Get Profile (Protected)
**GET** `/api/profile`

Headers:
```
Authorization: Bearer <your-jwt-token>
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "username": "johndoe",
      "email": "john@example.com",
      "isVerified": true,
      "createdAt": "2026-01-31T...",
      "updatedAt": "2026-01-31T..."
    }
  }
}
```

## 🔐 Protected Routes

Use the `withAuth` middleware to protect your routes:

```typescript
// @/app/api/your-protected-route/route.ts

import { NextResponse } from 'next/server'
import { withAuth, AuthenticatedRequest } from '@/lib/authMiddleware'

async function handler(req: AuthenticatedRequest) {
  // Access user info via req.user
  const userId = req.user?.userId
  const email = req.user?.email
  const username = req.user?.username

  return NextResponse.json({
    success: true,
    message: `Hello ${username}!`
  })
}

export const GET = withAuth(handler)
export const POST = withAuth(handler)
```

## 📁 Project Structure

```
app/
├── api/
│   ├── auth/
│   │   ├── create-account/route.ts
│   │   ├── verify-otp/route.ts
│   │   ├── login/route.ts
│   │   ├── forgot-password/route.ts
│   │   └── reset-password/route.ts
│   └── profile/route.ts (example protected route)
lib/
├── mongoConnect.ts (MongoDB connection)
├── jwt.ts (JWT & OTP utilities)
├── email.ts (Email sending utilities)
└── authMiddleware.ts (Auth protection)
models/
└── User.ts (Mongoose User model)
```

## 🧪 Testing

1. Start the development server:
```bash
npm run dev
```

2. Test with curl or Postman:

```bash
# Create account
curl -X POST http://localhost:3000/api/auth/create-account \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"test123"}'

# Verify OTP (check your email for OTP)
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Get profile (use token from login)
curl http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔒 Security Notes

- Passwords are hashed with bcrypt (10 rounds)
- OTP expires after 10 minutes
- Password reset tokens expire after 1 hour
- JWT tokens expire after 7 days (configurable)
- Protected routes require valid JWT tokens
- Email verification required before login

## 🛠️ Customization

### Change OTP expiry time
Edit `app/api/auth/create-account/route.ts`:
```typescript
const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
```

### Change JWT expiry time
Edit `.env.local`:
```env
JWT_EXPIRES_IN=30d  # 30 days instead of 7
```

### Customize email templates
Edit `lib/email.ts` to modify the email HTML templates.

## 📝 Notes

- MongoDB must be running before starting the app
- For production, use MongoDB Atlas instead of local MongoDB
- Store sensitive data in `.env.local`, never commit it
- Consider adding rate limiting for production use
- Add email resend functionality if needed
