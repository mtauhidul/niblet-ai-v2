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
   - See `FIREBASE_SETUP.md` for detailed instructions

4. Configure environment variables:
   - Copy `.env.example` to `.env.local`
   - Add your Firebase configuration

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
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication page
│   ├── dashboard/         # Dashboard pages
│   ├── onboarding/        # User onboarding flow
│   └── layout.tsx         # Root layout with metadata
├── components/            # React components
│   ├── modals/           # Modal components
│   └── ui/               # UI components (shadcn/ui)
├── contexts/             # React contexts
├── lib/                  # Utility functions and Firebase config
└── public/               # Static assets
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

## 📚 Documentation

- [Firebase Setup Guide](FIREBASE_SETUP.md)
- [Onboarding System](ONBOARDING_SYSTEM.md)
- [Onboarding Fix Details](ONBOARDING_FIX.md)

## 🤝 Contributing

This is a private project. For questions or support, contact the development team.

## 📄 License

Proprietary - All rights reserved

---

Built with ❤️ by the NibletAI team
