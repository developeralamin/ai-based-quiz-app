import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <DashboardLayout>
            <Head title="Dashboard" />
            {/* Filter Section */}
            <div className="flex flex-wrap gap-4 mb-8 items-center">
                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">Education Type</label>
                    <select className="px-4 py-2 border rounded focus:outline-none focus:ring focus:border-purple-400">
                        <option>All Education Types</option>
                        <option>School</option>
                        <option>College</option>
                        <option>University</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">Class</label>
                    <select className="px-4 py-2 border rounded focus:outline-none focus:ring focus:border-purple-400">
                        <option>All Class</option>
                        <option>Class 1</option>
                        <option>Class 2</option>
                        <option>Class 3</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">Subject</label>
                    <select className="px-4 py-2 border rounded focus:outline-none focus:ring focus:border-purple-400">
                        <option>All Subjects</option>
                        <option>Math</option>
                        <option>Science</option>
                        <option>English</option>
                    </select>
                </div>
            </div>
            {/* Main Content Area */}
            <div className="flex flex-col items-center justify-center h-96 bg-white rounded shadow">
                <div className="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m0 0H3" /></svg>
                    <div className="text-lg font-semibold text-gray-700 mb-2">No books available</div>
                    <div className="text-gray-400">There are no books available at the moment.</div>
                </div>
            </div>
        </DashboardLayout>
    );
}
