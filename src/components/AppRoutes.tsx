import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { useAuth } from "@clerk/clerk-react";

import AppLayout from "./AppLayout";
import FloatingAuthStatus from "./FloatingAuthStatus";
import PageLoader from "./PageLoader";
import BetaBanner from "./BetaBanner";

// Lazy-loaded pages
const MainMenu = React.lazy(() => import("../pages/MainMenu"));
const Game = React.lazy(() => import("../pages/Game"));
const Tutorial = React.lazy(() => import("../pages/Tutorial"));
const Settings = React.lazy(() => import("../pages/Settings"));
const Statistics = React.lazy(() => import("../pages/Statistics"));
const Leaderboard = React.lazy(() => import("../pages/Leaderboard"));
const Achievements = React.lazy(() => import("../pages/Achievements"));
const NotFound = React.lazy(() => import("../pages/NotFound"));
const AuthPage = React.lazy(() => import("../pages/Auth"));

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

const AppRoutes: React.FC = () => {
    const { isLoaded, isSignedIn } = useAuth();

    // Render a global loading screen until the authentication state is determined.
    // This prevents race conditions and flashes of incorrect content.
    if (!isLoaded) {
        return <PageLoader message="Securing your session..." />;
    }

    return (
        <>
            {/* These components are available on all routes */}
            <BetaBanner />
            <FloatingAuthStatus />
            
            <Suspense fallback={<PageLoader />}>
                <SentryRoutes>
                    {isSignedIn ? (
                        <>
                            {/* If signed in, redirect away from the auth page */}
                            <Route path="/auth" element={<Navigate to="/" replace />} />

                            {/* Protected routes with the shared layout */}
                            <Route element={<AppLayout />}>
                                <Route path="/" element={<MainMenu />} />
                                <Route path="/game" element={<Game />} />
                                <Route path="/settings" element={<Settings />} />
                                <Route path="/statistics" element={<Statistics />} />
                                <Route path="/leaderboard" element={<Leaderboard />} />
                                <Route path="/achievements" element={<Achievements />} />
                            </Route>

                            {/* Tutorial without layout but still protected */}
                            <Route path="/tutorial" element={<Tutorial />} />

                            {/* 404 page for authenticated users */}
                            <Route path="*" element={<NotFound />} />
                        </>
                    ) : (
                        <>
                            {/* Public route for authentication */}
                            <Route path="/auth" element={<AuthPage />} />

                            {/* For any other route, redirect to the auth page */}
                            <Route path="*" element={<Navigate to="/auth" replace />} />
                        </>
                    )}
                </SentryRoutes>
            </Suspense>
        </>
    );
};

export default AppRoutes;
