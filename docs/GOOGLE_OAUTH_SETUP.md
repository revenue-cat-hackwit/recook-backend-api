# Google OAuth Setup Guide for Pirinku

## 🔐 Setup Google OAuth Credentials

### Step 1: Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Login dengan akun Google kamu

### Step 2: Create or Select Project
1. Klik dropdown project di atas
2. Klik **"New Project"**
3. Nama project: **Pirinku** (atau terserah)
4. Klik **Create**

### Step 3: Enable Google+ API
1. Di sidebar, pilih **"APIs & Services"** > **"Library"**
2. Search: **"Google+ API"**
3. Klik **"Google+ API"**
4. Klik **"Enable"**

### Step 4: Configure OAuth Consent Screen
1. Di sidebar, pilih **"OAuth consent screen"**
2. Pilih **"External"** (untuk testing)
3. Klik **Create**
4. Isi form:
   - **App name**: Pirinku
   - **User support email**: your-email@gmail.com
   - **Developer contact email**: your-email@gmail.com
5. Klik **"Save and Continue"**
6. Di **Scopes**, klik **"Add or Remove Scopes"**
   - Pilih: `userinfo.email`, `userinfo.profile`, `openid`
7. Klik **"Save and Continue"**
8. Di **Test users**, klik **"Add Users"**
   - Tambahkan email kamu untuk testing
9. Klik **"Save and Continue"**

### Step 5: Create OAuth Credentials
1. Di sidebar, pilih **"Credentials"**
2. Klik **"+ Create Credentials"** > **"OAuth client ID"**
3. **Application type**: Web application
4. **Name**: Pirinku Web Client
5. **Authorized JavaScript origins**:
   - `http://localhost:3000`
   - `http://localhost:3001` (jika pakai port lain)
6. **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google`
7. Klik **Create**

### Step 6: Copy Credentials
Setelah create, akan muncul popup dengan:
- **Client ID**: `123456789-abc...xyz.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-abc...xyz`

Copy kedua value ini!

### Step 7: Update .env.local
```env
GOOGLE_CLIENT_ID=123456789-abc...xyz.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc...xyz
NEXTAUTH_SECRET=your-random-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

**Generate NEXTAUTH_SECRET:**
```bash
# Option 1: Using OpenSSL
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 🚀 Testing Google Login

### 1. Start Development Server
```bash
npm run dev
```

### 2. Test Login Flow

**Via Browser:**
```
http://localhost:3000/api/auth/signin
```

**Via API (untuk mobile/frontend):**
```javascript
// Install next-auth di frontend
import { signIn } from 'next-auth/react'

// Trigger Google login
signIn('google', { callbackUrl: '/dashboard' })

// Or with credentials
signIn('credentials', {
  email: 'user@example.com',
  password: 'password123',
  redirect: false,
})
```

### 3. Check Session
```javascript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

// In server component or API route
const session = await getServerSession(authOptions)
console.log(session.user)
```

---

## 📱 For Production

### Update Google Console:
1. Add production URLs to **Authorized JavaScript origins**:
   - `https://yourdomain.com`
2. Add production callback to **Authorized redirect URIs**:
   - `https://yourdomain.com/api/auth/callback/google`

### Update .env:
```env
NEXTAUTH_URL=https://yourdomain.com
```

---

## ⚠️ Common Issues

### Error: redirect_uri_mismatch
- Pastikan `http://localhost:3000/api/auth/callback/google` ada di Google Console
- Pastikan `NEXTAUTH_URL=http://localhost:3000` di `.env.local`

### Error: invalid_client
- Cek `GOOGLE_CLIENT_ID` dan `GOOGLE_CLIENT_SECRET` benar
- Pastikan tidak ada spasi di awal/akhir

### Error: access_denied
- User belum ditambahkan ke Test Users
- Atau app masih dalam testing mode dan user bukan tester

---

## 🔗 Useful Links

- Google Cloud Console: https://console.cloud.google.com/
- NextAuth.js Docs: https://next-auth.js.org/
- Google OAuth Guide: https://developers.google.com/identity/protocols/oauth2
