import React from "react";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import ProvidersWrapper from "./components/ProvidersWrapper";
import AppRoutes from "./components/AppRoutes";
import { CLERK_PUBLISHABLE_KEY } from "./config/clerk";
import { Toaster } from "@/components/ui/sonner";
import { usePlayFabInitialization } from "./services/playFabInit";

// This new component allows ClerkProvider to access React Router's navigation context.
const ClerkProviderWithRouter: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const navigate = useNavigate();

    return (
        <ClerkProvider
            publishableKey={CLERK_PUBLISHABLE_KEY}
            routerPush={(to) => navigate(to)}
            routerReplace={(to) => navigate(to, { replace: true })}
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
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ClerkProviderWithRouter>
          <ProvidersWrapper>
            <AppContent />
          </ProvidersWrapper>
        </ClerkProviderWithRouter>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
