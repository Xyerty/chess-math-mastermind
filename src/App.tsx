import React from "react";
import { Outlet } from "react-router-dom";
import ProvidersWrapper from "./components/ProvidersWrapper";
import { Toaster } from "@/components/ui/sonner";
import EnvironmentCheck from "./components/EnvironmentCheck";
import { env } from "./config/environment";
import Header from "./components/Header";
import AppLayout from "./components/AppLayout";

const App: React.FC = () => {
  return (
    <ProvidersWrapper>
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

export default App;