import React from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link, Outlet, useNavigate } from "react-router-dom"; // useNavigate might be needed if Clerk interaction requires it, but ClerkProvider in main.tsx handles routing.
import ProvidersWrapper from "./components/ProvidersWrapper";
import { Toaster } from "@/components/ui/sonner"; // Assuming @ is src
import { usePlayFabInitialization } from "./services/playFabInit";
import EnvironmentCheck from "./components/EnvironmentCheck";
import { env } from "./config/environment";
import { CLERK_ENABLED } from "./config/clerk"; // CLERK_ENABLED might still be useful

// console.log from original App.tsx can be removed or adapted if needed for debugging.
// For this task, they are removed for clarity.

const App: React.FC = () => {
  // Initialize PlayFab if Clerk is enabled and it's part of the core app functionality
  // This needs to be called unconditionally within a component that's always part of the React tree.
  // If ProvidersWrapper is always there, this is a good spot.
  if (CLERK_ENABLED) {
    // usePlayFabInitialization(); // This is a hook, should be called at the top level of a component.
    // Let's create a small component for this if it needs to be conditional.
  }

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
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            {/* Relying on ProtectedRoute to handle redirects.
                Clerk's hosted pages will manage sign-in.
                A simple message or a <Link to="/sign-in">Sign In</Link> could be added if needed.
            */}
            <p>You are signed out.</p>
          </SignedOut>
        </div>
      </header>

      {env.isDevelopment && <EnvironmentCheck />}

      <main style={{ padding: '1rem' }}>
        <Outlet /> {/* This will render the child route's element (Home page, Dashboard, etc.) */}
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
