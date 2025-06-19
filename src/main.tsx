import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import * as Sentry from "@sentry/react";
import { ClerkProvider } from '@clerk/clerk-react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute.tsx'; // Using relative path

// Only initialize Sentry if DSN is provided
const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of the transactions
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, sample the entire session when an error occurs.
  });
}

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}

const root = createRoot(container);

// Create a fallback component that matches Sentry's expected interface
const ErrorFallback = ({ error, resetError }: { error: unknown; resetError: () => void }) => {
  const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      flexDirection: 'column', 
      fontFamily: 'sans-serif',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h2 style={{ marginBottom: '1rem', color: '#dc2626' }}>Something went wrong</h2>
      <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
        {errorMessage}
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button 
          onClick={resetError}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}
        >
          Reload Page
        </button>
      </div>
    </div>
  );
};

// Get Clerk Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in .env.local");
}

// Define DashboardPage placeholder
const DashboardPage = () => <div><h1>Dashboard</h1><p>This is a protected page.</p></div>;

// Create the router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App will contain the main layout and navigation
    children: [
      {
        path: "/",
        // Placeholder for home page content, Sentry will wrap this via App
        element: <div><h1>Home Page</h1><p>This is the public home page.</p></div>,
      },
      {
        path: "/dashboard",
        element: <ProtectedRoute />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          }
        ]
      }
    ]
  }
]);

// Application component with Sentry Error Boundary
const AppWithSentryAndRouter = () => (
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <RouterProvider router={router} />
  </ClerkProvider>
);

// Use Sentry ErrorBoundary if available, otherwise use a simple fallback
const AppToRender = sentryDsn ? (
  <Sentry.ErrorBoundary fallback={ErrorFallback}>
    <AppWithSentryAndRouter />
  </Sentry.ErrorBoundary>
) : (
  <AppWithSentryAndRouter />
);

root.render(
  <React.StrictMode>
    {AppToRender}
  </React.StrictMode>
);
