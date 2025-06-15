
import React, { memo } from 'react';
import { ThemeProvider } from "next-themes";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { LanguageProvider } from "../contexts/LanguageContext";
import { DifficultyProvider } from "../contexts/DifficultyContext";
import { SettingsProvider } from "../contexts/SettingsContext";
import { GameModeProvider } from "../contexts/GameModeContext";
import { OpponentProvider } from "../contexts/OpponentContext";
import { queryClient } from '../config/queryClient';
import { UserProvider } from '../contexts/UserContext';

const ProvidersWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <SettingsProvider>
            <DifficultyProvider>
              <LanguageProvider>
                <GameModeProvider>
                  <OpponentProvider>
                    <TooltipProvider>
                      <Toaster />
                      <Sonner />
                      {children}
                    </TooltipProvider>
                  </OpponentProvider>
                </GameModeProvider>
              </LanguageProvider>
            </DifficultyProvider>
          </SettingsProvider>
        </UserProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default memo(ProvidersWrapper);
