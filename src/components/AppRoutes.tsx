
import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as Sentry from "@sentry/react";

import AppLayout from "./AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import FloatingAuthStatus from "./FloatingAuthStatus";
import PageLoader from "./PageLoader";

// Lazy-loaded pages
const MainMenu = React.lazy(() => import("../pages/MainMenu"));
const Game = React.lazy(() => import("../pages/Game"));
const Tutorial = React.lazy(() => import("../pages/Tutorial"));
const Settings = React.lazy(() => import("../pages/Settings"));
const Statistics = React.lazy(() => import("../pages/Statistics"));
const NotFound = React.lazy(() => import("../pages/NotFound"));
const AuthPage = React.lazy(() => import("../pages/Auth"));


const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

const AppRoutes: React.FC = () => {
    return (
        <BrowserRouter>
            <FloatingAuthStatus />
            <Suspense fallback={<PageLoader />}>
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
        </BrowserRouter>
    );
};

export default AppRoutes;
