import React from "react";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import ProvidersWrapper from "./components/ProvidersWrapper";
import AppRoutes from "./components/AppRoutes";
import { CLERK_PUBLISHABLE_KEY } from "./config/clerk";
import { Toaster } from "@/components/ui/sonner";
import { usePlayFabInitialization } from "./services/playFabInit";
import MissingEnvVar from "./components/MissingEnvVar";

// Authentication Error Boundary specifically for Clerk issues
const AuthErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
};

// This component allows ClerkProvider to access React Router's navigation context.
const ClerkProviderWithRouter: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const navigate = useNavigate();

    // Add debugging for Clerk initialization
    console.log("🔧 Initializing Clerk with key:", CLERK_PUBLISHABLE_KEY.substring(0, 20) + "...");

    return (
        <ClerkProvider
            publishableKey={CLERK_PUBLISHABLE_KEY}
            routerPush={(to) => {
                console.log("🔄 Clerk routing to:", to);
                navigate(to);
            }}
            routerReplace={(to) => {
                console.log("🔄 Clerk replacing route to:", to);
                navigate(to, { replace: true });
            }}
        >
            {children}
        </ClerkProvider>
    );
};

const AppContent: React.FC = () => {
  // Initialize PlayFab in the background without blocking navigation
  usePlayFabInitialization();

  return (
    <>
      <AppRoutes />
      <Toaster richColors position="top-right" />
    </>
  );
};

const App: React.FC = () => {
  console.log("🚀 App initializing...");

  if (!CLERK_PUBLISHABLE_KEY) {
    return (
      <MissingEnvVar
        varName="VITE_CLERK_PUBLISHABLE_KEY"
        instructions={
          <ol className="list-decimal list-inside space-y-2">
            <li>
              Go to your{" "}
              <a
                href="https://dashboard.clerk.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Clerk Dashboard
              </a>
              .
            </li>
            <li>Navigate to your project's <strong>API Keys</strong> page.</li>
            <li>Copy the <strong>Publishable key</strong>. It starts with <code className="font-mono bg-muted px-1 py-0.5 rounded">pk_...</code>.</li>
            <li>
              In Lovable, go to <strong>Project Settings</strong> {'>'} <strong>Environment Variables</strong>.
            </li>
            <li>
              Add a new variable with the name{" "}
              <code className="font-mono bg-muted px-1 py-0.5 rounded">VITE_CLERK_PUBLISHABLE_KEY</code> and paste your key as the value.
            </li>
            <li>Save the changes and refresh the preview.</li>
          </ol>
        }
      />
    );
  }
  
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthErrorBoundary>
          <ClerkProviderWithRouter>
            <ProvidersWrapper>
              <AppContent />
            </ProvidersWrapper>
          </ClerkProviderWithRouter>
        </AuthErrorBoundary>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
