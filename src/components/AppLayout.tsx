
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const AppLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-green-50">
            <Header />
            <main className="flex-grow p-2 sm:p-4">
                <Outlet />
            </main>
        </div>
    );
};

export default AppLayout;
