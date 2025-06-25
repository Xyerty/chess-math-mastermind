import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import * as Sentry from "@sentry/react";
import { ClerkProvider } from '@clerk/clerk-react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute.tsx';
import { CLERK_ENABLED, CLERK_PUBLISHABLE_KEY } from './config/clerk.ts';

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

// Define DashboardPage placeholder
const DashboardPage = () => <div><h1>Dashboard</h1><p>This is a protected page.</p></div>;

// Create the router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <div><h1>Home Page</h1><p>This is the public home page.</p></div>,
      },
      {
        path: "/dashboard",
        element: CLERK_ENABLED ? <ProtectedRoute /> : <div><h1>Dashboard</h1><p>Clerk is not enabled. Please configure VITE_CLERK_PUBLISHABLE_KEY.</p></div>,
        children: CLERK_ENABLED ? [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          }
        ] : [],
      }
    ]
  }
]);

// Application component with router
const AppWithRouter = () => <RouterProvider router={router} />;

// Conditionally wrap with ClerkProvider if enabled
const AppWithClerk = CLERK_ENABLED ? (
  <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
    <AppWithRouter />
  </ClerkProvider>
) : (
  <AppWithRouter />
);

// Use Sentry ErrorBoundary if available
const AppToRender = sentryDsn ? (
  <Sentry.ErrorBoundary fallback={ErrorFallback}>
    <AppWithClerk />
  </Sentry.ErrorBoundary>
) : (
  <AppWithClerk />
);

root.render(
  <React.StrictMode>
    {AppToRender}
  </React.StrictMode>
);