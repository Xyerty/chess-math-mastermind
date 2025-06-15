import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as Sentry from "@sentry/react";

import AppLayout from "./AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import FloatingAuthStatus from "./FloatingAuthStatus";
import PageLoader from "./PageLoader";
import BetaBanner from "./BetaBanner";
import AuthAwareRouter from "./AuthAwareRouter";

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
    return (
        <BrowserRouter>
            <AuthAwareRouter>
                <BetaBanner />
                <FloatingAuthStatus />
                <Suspense fallback={<PageLoader />}>
                    <SentryRoutes>
                        {/* Public route for authentication */}
                        <Route path="/auth" element={<AuthPage />} />

                        {/* Protected routes with the shared layout */}
                        <Route element={
                            <ProtectedRoute>
                                <AppLayout />
                            </ProtectedRoute>
                        }>
                            <Route path="/" element={<MainMenu />} />
                            <Route path="/game" element={<Game />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/statistics" element={<Statistics />} />
                            <Route path="/leaderboard" element={<Leaderboard />} />
                            <Route path="/achievements" element={<Achievements />} />
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
                </Suspense>
            </AuthAwareRouter>
        </BrowserRouter>
    );
};

export default AppRoutes;
