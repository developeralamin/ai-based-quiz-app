import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import Sidebar from '@/Components/Sidebar';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(true);

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Top Navigation Bar */}
            

            {/* Main Content Area with Sidebar */}
            <div className="flex">
                {/* Sidebar */}
                <div className={`transition-all duration-300 ${sidebarVisible ? 'w-64' : 'w-0'} overflow-hidden`}>
                    <Sidebar user={user} onNavClick={() => setSidebarVisible(false)} />
                </div>

                {/* Main Content */}
                <div className={`flex-1 transition-all duration-300 ${sidebarVisible ? 'ml-0' : 'ml-0'}`}>
                    {header && (
                        <header className="bg-white shadow">
                            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )}

                    <main className="p-6">{children}</main>
                </div>
            </div>
        </div>
    );
}
