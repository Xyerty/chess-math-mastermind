
import React from "react";
import * as Sentry from "@sentry/react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "./contexts/LanguageContext";
import { DifficultyProvider } from "./contexts/DifficultyContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { GameModeProvider } from "./contexts/GameModeContext";
import { OpponentProvider } from "./contexts/OpponentContext";
import { AuthProvider } from "./contexts/AuthContext";
import MainMenu from "./pages/MainMenu";
import Game from "./pages/Game";
import Tutorial from "./pages/Tutorial";
import Settings from "./pages/Settings";
import Statistics from "./pages/Statistics";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/AppLayout";
import AuthPage from "./pages/Auth";
import FloatingAuthStatus from "./components/FloatingAuthStatus";

const queryClient = new QueryClient();

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

const App: React.FC = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
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
                          <Route path="/" element={<MainMenu />} />
                          <Route path="/auth" element={<AuthPage />} />
                          
                          {/* Routes with the new shared layout */}
                          <Route element={<AppLayout />}>
                            <Route path="/game" element={<Game />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/statistics" element={<Statistics />} />
                          </Route>

                          {/* Routes without the new layout (due to file restrictions) */}
                          <Route path="/tutorial" element={<Tutorial />} />
                          <Route path="*" element={<NotFound />} />
                        </SentryRoutes>
                      </BrowserRouter>
                    </TooltipProvider>
                  </OpponentProvider>
                </GameModeProvider>
              </LanguageProvider>
            </DifficultyProvider>
          </SettingsProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
