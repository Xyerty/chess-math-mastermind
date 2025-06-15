
import React from "react";
import { ClerkProvider } from "@clerk/clerk-react";
import ErrorBoundary from "./components/ErrorBoundary";
import ProvidersWrapper from "./components/ProvidersWrapper";
import AppRoutes from "./components/AppRoutes";
import { CLERK_PUBLISHABLE_KEY } from "./config/clerk";
import { Toaster } from "@/components/ui/sonner";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <ProvidersWrapper>
          <AppRoutes />
          <Toaster richColors position="top-right" />
        </ProvidersWrapper>
      </ClerkProvider>
    </ErrorBoundary>
  );
};

export default App;
