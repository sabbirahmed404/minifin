# MiniFin - Personal Finance Tracker

MiniFin is a simple, elegant personal finance tracker built with Next.js, Firebase, and Tailwind CSS.

## Features

- 📊 Dashboard with financial overview
- 💰 Transaction management (add, edit, delete)
- 📈 Analytics and reporting
- 🔥 Firebase integration for data persistence
- 🔄 Automatic syncing between devices
- 📱 Responsive design for all devices
- 🌙 Beautiful dark theme

## Demo

[Live Demo](https://minifin.vercel.app) (Coming soon)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Firebase account (for production use)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/minifin.git
cd minifin
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root of the project:

```
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-measurement_id
```

### Development Mode

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Note:** The app includes a development mode with mock data when Firebase credentials are not provided. This allows you to develop and test the app without setting up Firebase, but for production use, Firebase configuration is required.

### Build for Production

```bash
npm run build
npm start
```

## Deployment on Vercel

The easiest way to deploy MiniFin is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Import the project into Vercel
3. Add your Firebase environment variables in the Vercel dashboard (Settings > Environment Variables)
4. Deploy! Vercel will automatically build and deploy your app.

## Firebase Setup

MiniFin uses Firebase Firestore as its primary data store. To set up Firebase:

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Add a web app to your project
3. Enable Firestore Database
4. Set up appropriate security rules for Firestore
5. Add your Firebase configuration to the `.env.local` file
6. More detailed instructions are available in `FIREBASE_CONFIG.md`

### Firebase Security Rules

For production, set up appropriate security rules for your Firestore database. Here's a basic example:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Project Structure

```
minifin/
├── app/                 # Next.js 14 app directory
│   ├── components/      # Reusable UI components
│   │   └── ui/          # Base UI components
│   ├── lib/             # App-specific libraries
│   │   ├── data/        # Data management
│   │   └── firebase/    # Firebase integration
│   ├── dashboard/       # Dashboard page
│   ├── transactions/    # Transactions pages
│   ├── analytics/       # Analytics pages
│   ├── settings/        # Settings page
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── lib/                 # Shared libraries
├── public/              # Static assets
└── ...configuration files
```

## Technology Stack

- [Next.js 14](https://nextjs.org/) - React framework with App Router
- [React 19](https://react.dev/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Firebase](https://firebase.google.com/) - Backend and data persistence
- [Recharts](https://recharts.org/) - Charting library
- [shadcn/ui](https://ui.shadcn.com/) - UI component collection
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Lucide Icons](https://lucide.dev/) for the beautiful icons
- [shadcn/ui](https://ui.shadcn.com/) for the component system
- [date-fns](https://date-fns.org/) for date manipulation
