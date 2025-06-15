
import React from "react";
import { ClerkProvider } from "@clerk/clerk-react";
import ErrorBoundary from "./components/ErrorBoundary";
import ProvidersWrapper from "./components/ProvidersWrapper";
import AppRoutes from "./components/AppRoutes";
import { CLERK_PUBLISHABLE_KEY } from "./config/clerk";
import { Toaster } from "@/components/ui/sonner";
import { usePlayFabInitialization } from "./services/playFabInit";

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
  return (
    <ErrorBoundary>
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <ProvidersWrapper>
          <AppContent />
        </ProvidersWrapper>
      </ClerkProvider>
    </ErrorBoundary>
  );
};

export default App;
