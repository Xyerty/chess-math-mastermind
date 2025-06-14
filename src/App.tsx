
import React from "react";
import * as Sentry from "@sentry/react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/clerk-react";
import { LanguageProvider } from "./contexts/LanguageContext";
import { DifficultyProvider } from "./contexts/DifficultyContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { GameModeProvider } from "./contexts/GameModeContext";
import { OpponentProvider } from "./contexts/OpponentContext";
import { AuthProvider } from "./contexts/AuthContext";
import { PlayFabProvider } from "./contexts/PlayFabContext";
import MainMenu from "./pages/MainMenu";
import Game from "./pages/Game";
import Tutorial from "./pages/Tutorial";
import Settings from "./pages/Settings";
import Statistics from "./pages/Statistics";
import Leaderboards from "./pages/Leaderboards";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/AppLayout";
import AuthPage from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import FloatingAuthStatus from "./components/FloatingAuthStatus";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on auth errors
        if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

// Use the provided Clerk publishable key
const CLERK_PUBLISHABLE_KEY = "pk_test_cmVsYXhpbmctc2hlcGhlcmQtMTAuY2xlcmsuYWNjb3VudHMuZGV2JA";

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

const AppContent: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ErrorBoundary>
              <PlayFabProvider>
                <SettingsProvider>
                  <DifficultyProvider>
                    <LanguageProvider>
                      <GameModeProvider>
                        <OpponentProvider>
                          <TooltipProvider>
                            <Toaster />
                            <Sonner />
                            <BrowserRouter>
                              <FloatingAuthStatus />
                              <SentryRoutes>
                                {/* Public route for authentication */}
                                <Route path="/auth" element={<AuthPage />} />
                                
                                {/* Protected routes - require authentication */}
                                <Route path="/" element={
                                  <ProtectedRoute>
                                    <MainMenu />
                                  </ProtectedRoute>
                                } />
                                
                                {/* Routes with the shared layout - all protected */}
                                <Route element={<AppLayout />}>
                                  <Route path="/game" element={
                                    <ProtectedRoute>
                                      <Game />
                                    </ProtectedRoute>
                                  } />
                                  <Route path="/settings" element={
                                    <ProtectedRoute>
                                      <Settings />
                                    </ProtectedRoute>
                                  } />
                                  <Route path="/statistics" element={
                                    <ProtectedRoute>
                                      <Statistics />
                                    </ProtectedRoute>
                                  } />
                                  <Route path="/leaderboards" element={
                                    <ProtectedRoute>
                                      <Leaderboards />
                                    </ProtectedRoute>
                                  } />
                                </Route>

                                {/* Tutorial without layout but still protected */}
                                <Route path="/tutorial" element={
                                  <ProtectedRoute>
                                    <Tutorial />
                                  </ProtectedRoute>
                                } />
                                
                                {/* 404 page */}
                                <Route path="*" element={<NotFound />} />
                              </SentryRoutes>
                            </BrowserRouter>
                          </TooltipProvider>
                        </OpponentProvider>
                      </GameModeProvider>
                    </LanguageProvider>
                  </DifficultyProvider>
                </SettingsProvider>
              </PlayFabProvider>
            </ErrorBoundary>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <AppContent />
      </ClerkProvider>
    </ErrorBoundary>
  );
};

export default App;
