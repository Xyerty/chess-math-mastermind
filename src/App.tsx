
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { DifficultyProvider } from "./contexts/DifficultyContext";
import MainMenu from "./pages/MainMenu";
import Game from "./pages/Game";
import Tutorial from "./pages/Tutorial";
import Settings from "./pages/Settings";
import Statistics from "./pages/Statistics";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/AppLayout";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <DifficultyProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
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
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </DifficultyProvider>
    </QueryClientProvider>
  );
};

export default App;
