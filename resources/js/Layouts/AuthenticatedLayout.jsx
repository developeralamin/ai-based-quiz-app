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
            {/* Page Header (full width so no gap next to sidebar) */}
            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Main Content Area with Sidebar */}
            <div className="flex h-full">
                {/* Sidebar */}
                <div className={`transition-all duration-300 ${sidebarVisible ? 'w-64' : 'w-0'} overflow-hidden h-full flex-shrink-0`}>
                    <div className="h-full">
                        <Sidebar user={user} headerExists={!!header} onNavClick={() => setSidebarVisible(false)} />
                    </div>
                </div>

                {/* Main Content */}
                <div className={`flex-1 transition-all duration-300 ${sidebarVisible ? 'ml-0' : 'ml-0'} flex flex-col h-full overflow-hidden`}>

                    <main className="flex-1 p-6 overflow-y-auto">{children}</main>
                </div>
            </div>
        </div>
    );
}
