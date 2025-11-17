# Firebase Setup Instructions

## 1. Firebase Console Configuration

### Step 1: Go to Firebase Console
1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Select your project or create a new one

### Step 2: Enable Authentication
1. Go to "Authentication" in the left sidebar
2. Click "Get started" if not already enabled
3. Go to "Sign-in method" tab
4. Click on "Google" provider
5. Enable it by toggling the switch

### Step 3: Configure Authorized Domains
In the Google sign-in provider settings, make sure these domains are added to "Authorized domains":
- `localhost` (for development)
- `your-production-domain.com` (for production)

### Step 4: Configure OAuth Redirect URIs
1. In the Google sign-in provider, you'll see a Web SDK configuration
2. Note down the Web client ID
3. Go to [Google Cloud Console](https://console.cloud.google.com/)
4. Navigate to "APIs & Services" > "Credentials"
5. Find your OAuth 2.0 client ID (it should match the one from Firebase)
6. Click on it to edit
7. In "Authorized redirect URIs", add ALL of these URIs:
   - `http://localhost:3000` (for Next.js dev server)
   - `http://localhost:3000/__/auth/handler` (Firebase Auth handler - localhost)
   - `https://niblet-ai.firebaseapp.com/__/auth/handler` (Firebase Auth handler - production)
   - `https://your-actual-domain.com` (if you have a custom domain)

⚠️ **IMPORTANT**: The error shows Firebase is trying to use `https://niblet-ai.firebaseapp.com/__/auth/handler` - make sure this EXACT URL is added to your OAuth redirect URIs.

## 2. Environment Variables

Create a `.env.local` file in your project root with:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## 3. Firestore Database Setup

### Step 1: Create Firestore Database
1. Go to "Firestore Database" in Firebase Console
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location close to your users

### Step 2: Create Collections
Create these collections manually or they will be created automatically when you add data:
- `users` - for user profiles
- `meal_logs` - for meal tracking
- `weight_logs` - for weight tracking

### Step 3: Security Rules (Optional for development)
For development, you can use these permissive rules (update for production):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Common Issues and Solutions

### redirect_uri_mismatch Error
This error occurs when the redirect URI used by Firebase isn't registered in Google Cloud Console.

**Quick Fix for Current Error:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Credentials"
3. Find your OAuth 2.0 client ID (should start with your project name)
4. Click on it to edit
5. In "Authorized redirect URIs" section, add this EXACT URL:
   ```
   https://niblet-ai.firebaseapp.com/__/auth/handler
   ```
6. Click "Save"
7. Wait 5-10 minutes for changes to propagate
8. Try signing in again

**Additional URIs to add for complete functionality:**
- `http://localhost:3000` (for local development)
- `http://localhost:3000/__/auth/handler` (for local Firebase auth)
- Any custom domains you plan to use

**Troubleshooting Steps:**
- Ensure `localhost` is in Firebase authorized domains
- Make sure you're using the correct client ID
- Clear browser cache and cookies for your domain
- Wait a few minutes after making changes in Google Cloud Console

### Authentication Popup Blocked
- Ensure popups are allowed for your domain
- Try using `signInWithRedirect` instead of `signInWithPopup` if needed

### Environment Variables Not Loading
- Ensure `.env.local` file is in the project root
- Restart your development server after adding environment variables
- Check that variable names start with `NEXT_PUBLIC_` for client-side access