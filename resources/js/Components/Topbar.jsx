import { useState } from 'react';

export default function Topbar() {
  const [english, setEnglish] = useState(true);
  return (
    <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
      <input
        type="text"
        placeholder="Search book..."
        className="w-1/3 px-4 py-2 border rounded focus:outline-none focus:ring focus:border-purple-400"
      />
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">English Version</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={english} onChange={() => setEnglish(!english)} className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-400 rounded-full peer dark:bg-gray-700 peer-checked:bg-purple-600 transition"></div>
          <span className="ml-3 text-sm font-medium text-gray-900"></span>
        </label>
      </div>
    </div>
  );
} 