import Sidebar from '@/Components/Sidebar';
import Topbar from '@/Components/Topbar';
import { usePage } from '@inertiajs/react';

export default function DashboardLayout({ children }) {
  const user = usePage().props.auth?.user || {};
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
} 