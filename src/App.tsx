
import React from "react";
import { Outlet } from "react-router-dom";
import ProvidersWrapper from "./components/ProvidersWrapper";
import { Toaster } from "@/components/ui/sonner";
import { usePlayFabInitialization } from "./services/playFabInit";
import EnvironmentCheck from "./components/EnvironmentCheck";
import { env } from "./config/environment";
import { CLERK_ENABLED } from "./config/clerk";
import Header from "./components/Header";
import AppLayout from "./components/AppLayout";

const App: React.FC = () => {
  return (
    <ProvidersWrapper>
      {CLERK_ENABLED && <PlayFabInitializer />}

      <AppLayout>
        <Header />
        {env.isDevelopment && <EnvironmentCheck />}
        <main style={{ padding: '1rem' }}>
          <Outlet />
        </main>
      </AppLayout>

      <Toaster richColors position="top-right" />
    </ProvidersWrapper>
  );
};

// Helper component to conditionally call the hook
const PlayFabInitializer: React.FC = () => {
  usePlayFabInitialization();
  return null; // This component doesn't render anything itself
};

export default App;
