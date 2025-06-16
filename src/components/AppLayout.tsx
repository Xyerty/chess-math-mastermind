
import { Outlet } from 'react-router-dom';
import Header from './Header';

const AppLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
        </div>
    );
};

export default AppLayout;
