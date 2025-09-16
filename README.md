# Legal Marketplace Frontend

A modern, responsive React frontend for the Legal Marketplace platform. Built with TypeScript, Tailwind CSS, and modern UI/UX principles.

## Features

- **Authentication**: Secure login/signup with role-based access control
- **Client Dashboard**: Case management, quote review, and payment processing
- **Lawyer Marketplace**: Browse cases, submit quotes, and manage practice
- **File Upload**: Drag-and-drop file upload with validation
- **Real-time Updates**: React Query for efficient data fetching and caching
- **Type Safety**: Full TypeScript implementation

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Backend API running on http://localhost:3000

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd legal-marketplace-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   REACT_APP_API_URL=http://localhost:3000
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:3001](http://localhost:3001) to view the app.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components
│   └── ui/             # Base UI components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── pages/              # Page components
├── services/           # API services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── assets/             # Static assets
```

## Available Scripts

### `npm start`
Runs the app in development mode at http://localhost:3001.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run eject`
Ejects from Create React App (one-way operation).

## Key Features

### Authentication
- Secure login/signup with JWT tokens
- Role-based routing (Client/Lawyer)
- Protected routes with automatic redirects
- Persistent authentication state

### Client Features
- **Dashboard**: Overview of cases, quotes, and statistics
- **Create Case**: Post legal issues with file uploads
- **My Cases**: Manage and track case progress
- **Quote Review**: Compare and accept lawyer quotes
- **Payment**: Secure Stripe integration

### Lawyer Features
- **Marketplace**: Browse anonymized open cases
- **Quote Submission**: Submit competitive quotes
- **My Quotes**: Track quote status and manage practice
- **Case Access**: View case details after quote acceptance

## API Integration

The frontend integrates with the NestJS backend API:

- **Authentication**: `/auth/signup`, `/auth/signin`
- **Cases**: `/cases/*` for case management
- **Quotes**: `/quotes/*` for quote submission
- **Payments**: `/payments/*` for Stripe integration
- **Files**: `/files/*` for secure file handling

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_APP_API_URL` | Backend API URL | `http://localhost:3000` |
| `VITE_APP_STRIPE_PUBLISHABLE_KEY` | Stripe public key | Required for payments |
| `VITE_APP_NAME` | Application name | `Legal Marketplace` |
| `VITE_APP_VERSION` | Application version | `1.0.0` |

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm run build
# Upload build/ folder to Netlify
```

### Deploy to AWS S3
```bash
npm run build
aws s3 sync build/ s3://your-bucket-name --delete
```