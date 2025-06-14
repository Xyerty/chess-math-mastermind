
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import * as Sentry from "@sentry/react";

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

// Create a fallback component for when Sentry is not configured
const ErrorFallback = ({ error }: { error: Error }) => (
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
      {error.message || 'An unexpected error occurred'}
    </p>
    <button 
      onClick={() => window.location.reload()} 
      style={{
        padding: '0.5rem 1rem',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '0.375rem',
        cursor: 'pointer'
      }}
    >
      Reload Page
    </button>
  </div>
);

// Use Sentry ErrorBoundary if available, otherwise use a simple fallback
const AppWithErrorBoundary = sentryDsn ? (
  <Sentry.ErrorBoundary fallback={ErrorFallback}>
    <App />
  </Sentry.ErrorBoundary>
) : (
  <App />
);

root.render(
  <React.StrictMode>
    {AppWithErrorBoundary}
  </React.StrictMode>
);
