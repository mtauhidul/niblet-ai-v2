# NibletAI - Your AI-Powered Health Assistant

Transform your health journey with personalized AI guidance, smart tracking, and data-driven insights.

## 🌟 Features

- **AI-Powered Chat**: Interact with Niblet, your personal health assistant, for nutritional advice, meal logging, and health insights
- **Smart Meal Tracking**: Log meals manually or upload food photos for automatic nutritional analysis
- **Weight Tracking**: Monitor your weight progress with visual charts and trends
- **Goal Setting**: Set and track personalized health goals with smart recommendations
- **Progress Visualization**: Beautiful charts showing your calorie consumption and weight trends
- **Real-time BMI Calculation**: Automatic BMI calculation with health category insights
- **Activity Level Tracking**: Customize your calorie targets based on your activity level

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or higher
- pnpm (recommended) or npm
- Firebase account

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd niblet-ai
```

2. Install dependencies:

```bash
pnpm install
# or
npm install
```

3. Set up Firebase:

   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Google Sign-in)
   - Create a Firestore database
   - Add authorized domains for OAuth

4. Configure environment variables:

   - Copy `.env.example` to `.env.local`
   - Add your Firebase configuration
   - Add your OpenAI API key

5. Run the development server:

```bash
pnpm dev
# or
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Authentication**: Firebase Auth
- **Database**: Cloud Firestore
- **AI Integration**: OpenAI API
- **Charts**: Recharts
- **Icons**: Lucide React, Tabler Icons

## 📁 Project Structure

```
niblet-ai/
├── app/                       # Next.js app directory
│   ├── api/
│   │   └── chat/             # Chat API endpoint (OpenAI integration)
│   ├── auth/                 # Authentication page
│   ├── dashboard/            # Dashboard pages
│   │   ├── chart/           # Analytics and progress charts
│   │   ├── logs/            # Meal and weight logs
│   │   └── profile/         # User profile settings
│   ├── onboarding/          # Multi-step onboarding flow
│   ├── layout.tsx           # Root layout with SEO metadata
│   ├── page.tsx             # Landing page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── modals/             # Modal components (Add Meal, Log Weight, etc.)
│   ├── ui/                 # Reusable UI components
│   ├── chat-view.tsx       # Chat interface
│   ├── chat-input.tsx      # Message input with image upload
│   ├── ai-avatar.tsx       # AI assistant avatar
│   └── bottom-navigation.tsx # Mobile navigation
├── contexts/               # React context providers
│   ├── AuthContext.tsx     # Authentication state
│   ├── UserContext.tsx     # User data and logs
│   └── ChatContext.tsx     # Chat messages and AI interaction
├── lib/                    # Utility functions and configurations
│   ├── firebase.ts         # Firebase initialization
│   ├── firestore.ts        # Firestore operations
│   ├── schemas.ts          # TypeScript interfaces
│   └── utils.ts            # Helper functions
└── public/                 # Static assets
    ├── avatars/           # User avatar images
    ├── manifest.json      # PWA manifest
    └── robots.txt         # SEO robots file
```

## 🔒 Authentication Flow

1. **New Users**: Auth → Onboarding → Dashboard
2. **Returning Users**: Auth → Dashboard
3. **Incomplete Onboarding**: Auth → Onboarding

## 📱 Key Pages

- `/` - Landing page with product information
- `/auth` - Google sign-in authentication
- `/onboarding` - Multi-step onboarding for new users
- `/dashboard` - Main dashboard with AI chat and meal logging
- `/dashboard/chart` - Detailed progress charts
- `/dashboard/logs` - Meal and weight logs history
- `/dashboard/profile` - User profile management

## 🛠️ Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## � Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key
```

## 🚀 Deployment

This project can be deployed to any platform that supports Next.js:

- **Vercel** (Recommended): Connect your GitHub repository for automatic deployments
- **Netlify**: Deploy with automatic builds
- **AWS/GCP/Azure**: Deploy with your preferred cloud provider

Make sure to set up environment variables in your deployment platform.

## 📝 Key Features Explained

### AI Chat Assistant

- Natural language processing for meal queries
- Image recognition for food photos
- Automatic nutritional data extraction
- Personalized health recommendations

### Meal Tracking

- Manual entry with detailed macros
- Photo upload with AI analysis
- Meal type categorization (Breakfast, Lunch, Dinner, Snack)
- Historical tracking and editing

### Progress Analytics

- Daily calorie consumption charts
- Weight tracking over time
- BMI calculation and monitoring
- Goal progress visualization

### User Onboarding

- Multi-step form for initial setup
- BMI calculation with health insights
- Activity level assessment
- Personalized calorie target calculation

## 🐛 Troubleshooting

### Firebase Authentication Issues

- Ensure redirect URIs are properly configured in Google Cloud Console
- Check that your domain is listed in Firebase authorized domains
- Verify environment variables are correctly set

### Build Errors

- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `pnpm install`
- Check Node.js version: `node --version` (should be 18+)

## 🤝 Contributing

This is a private project. For questions or support, contact the development team.

## 📄 License

Proprietary - All rights reserved

---

Built with ❤️ by Mir Tauhidul Islam
