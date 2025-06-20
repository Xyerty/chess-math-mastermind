
import React from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link, Outlet } from "react-router-dom";
import ProvidersWrapper from "./components/ProvidersWrapper";
import { Toaster } from "@/components/ui/sonner";
import { usePlayFabInitialization } from "./services/playFabInit";
import EnvironmentCheck from "./components/EnvironmentCheck";
import { env } from "./config/environment";
import { CLERK_ENABLED } from "./config/clerk";

const App: React.FC = () => {
  return (
    <ProvidersWrapper>
      {/* Conditional PlayFab Initialization Component */}
      {CLERK_ENABLED && <PlayFabInitializer />}

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#f0f0f0', borderBottom: '1px solid #ccc' }}>
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'blue' }}>Home</Link>
          <Link to="/dashboard" style={{ textDecoration: 'none', color: 'blue' }}>Dashboard</Link>
        </nav>
        <div>
          {CLERK_ENABLED ? (
            <>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <p>You are signed out.</p>
              </SignedOut>
            </>
          ) : (
            <p>Authentication disabled</p>
          )}
        </div>
      </header>

      {env.isDevelopment && <EnvironmentCheck />}

      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>

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
