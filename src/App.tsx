
import React from "react";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import ProvidersWrapper from "./components/ProvidersWrapper";
import AppRoutes from "./components/AppRoutes";
import { CLERK_PUBLISHABLE_KEY } from "./config/clerk";
import { Toaster } from "@/components/ui/sonner";
import { usePlayFabInitialization } from "./services/playFabInit";

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
