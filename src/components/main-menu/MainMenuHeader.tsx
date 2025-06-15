
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrentUser } from "@/contexts/UserContext";

const MainMenuHeader = () => {
  const { t } = useLanguage();
  const { currentUser, isLoading: isUserLoading } = useCurrentUser();

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('welcome.goodMorning');
    if (hour < 17) return t('welcome.goodAfternoon');
    return t('welcome.goodEvening');
  };

  const displayName = currentUser?.firstName || currentUser?.username || 'Player';
  const fallbackInitials = (displayName?.[0] || 'P').toUpperCase();

  return (
    <div className="text-center animate-fade-in">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary mb-4">
        Mathematical<br className="sm:hidden" /> Chess
      </h1>
      <p className="text-lg text-muted-foreground max-w-3xl mx-auto" style={{ animationDelay: '200ms' }}>
        {t('mainMenu.appDescription')}
      </p>
      
      <div className="mt-8 flex flex-col items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
        {isUserLoading ? (
          <Skeleton className="h-16 w-16 rounded-full" />
        ) : (
          <Avatar className="h-16 w-16 ring-4 ring-primary/20 shrink-0">
            <AvatarImage src={currentUser?.imageUrl} alt={displayName} />
            <AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary">
              {fallbackInitials}
            </AvatarFallback>
          </Avatar>
        )}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            {getTimeOfDay()},{" "}
            {isUserLoading ? (
              <Skeleton className="h-8 w-40 inline-block" />
            ) : (
              <span className="text-primary">{displayName}</span>
            )}
            !
          </h2>
          <p className="text-muted-foreground mt-1">{t('welcome.challengePrompt')}</p>
        </div>
      </div>
    </div>
  );
};

export default MainMenuHeader;
