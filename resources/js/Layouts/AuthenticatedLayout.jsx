import Sidebar from '@/Components/Sidebar';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(true);

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    return (
        <div className="h-screen bg-gray-100">
            {/* Fixed Sidebar */}
            <div className="fixed left-0 top-0 h-full z-30">
                <Sidebar user={user} headerExists={!!header} onNavClick={() => setSidebarVisible(!sidebarVisible)} />
            </div>

            {/* Page Header (full width with sidebar offset) */}
            {header && (
                <header className="bg-white shadow ml-16">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Main Content Area */}
            <div className="ml-16 h-full">
                <main className="p-6 overflow-y-auto" style={{ height: header ? 'calc(100vh - 120px)' : '100vh' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
