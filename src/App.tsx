
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
import MainMenu from "./pages/MainMenu";
import Game from "./pages/Game";
import Tutorial from "./pages/Tutorial";
import Settings from "./pages/Settings";
import Statistics from "./pages/Statistics";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/AppLayout";

const queryClient = new QueryClient();

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

const App: React.FC = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <SettingsProvider>
          <DifficultyProvider>
            <LanguageProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <SentryRoutes>
                    <Route path="/" element={<MainMenu />} />
                    
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
            </LanguageProvider>
          </DifficultyProvider>
        </SettingsProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
