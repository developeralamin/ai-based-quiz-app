import {
  ArrowRightOnRectangleIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const navLinks = [
  { name: 'Books', href: '/books', icon: BookOpenIcon },
  // { name: 'AI Tools', href: '/ai-tools', icon: SparklesIcon },
  { name: 'History', href: '/history', icon: ClockIcon },
  // { name: 'Notes', href: '/notes', icon: DocumentTextIcon },
  { name: 'AI Quiz', href: '/ai-chat', icon: ChatBubbleLeftRightIcon },
  // { name: 'Study Calendar', href: '/study-calendar', icon: CalendarDaysIcon },
  // { name: 'Question Bank', href: '/question-bank', icon: QuestionMarkCircleIcon },
  // { name: 'Question Making', href: '/question-making', icon: PencilSquareIcon },
  { name: 'Quiz', href: '/quiz/form', icon: QuestionMarkCircleIcon },
  // { name: 'Subscription', href: '/subscription', icon: CreditCardIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

export default function Sidebar({ user, onNavClick, headerExists = false }) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(null);
  const page = usePage();
  const currentUrl = page.url;
  const topOffsetClass = headerExists ? 'top-28' : 'top-16';

  const handleLogout = () => {
    router.post('/logout');
  };

  const handleNavClick = () => {
    if (onNavClick) {
      onNavClick();
    }
  };

  return (
    <div
      className={`flex flex-col h-full sticky ${topOffsetClass} shadow-lg transition-all duration-300 ${expanded ? 'w-64' : 'w-16'} bg-white text-gray-900 group z-20`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => { setExpanded(false); setHovered(null); }}
    >
      {/* NextGenEdu Logo */}
      <div className={`flex items-center gap-3 px-2 py-5 border-b border-purple-100 transition-all duration-300 ${expanded ? 'px-6' : 'justify-center'} bg-gradient-to-r from-purple-600 to-purple-800 text-white`}>
        <div className={`rounded-full bg-white w-10 h-10 flex items-center justify-center text-lg font-bold text-purple-700`}>
          N
        </div>
        {expanded && (
          <div>
            <div className="font-bold text-lg">NextGenEdu</div>
            <div className="text-xs text-purple-200">Learning Platform</div>
          </div>
        )}
      </div>

      {/* User Info */}
      <div className={`flex items-center gap-3 px-2 py-3 border-b border-purple-100 transition-all duration-300 ${expanded ? 'px-6' : 'justify-center'} bg-white text-purple-700`}>
        <div className={`rounded-full bg-purple-900 w-8 h-8 flex items-center justify-center text-sm font-bold text-white`}>
          {user?.name?.charAt(0) || 'U'}
        </div>
        {expanded && (
          <div>
            <div className="font-semibold text-sm">{user?.name || 'User'}</div>
            <div className="text-xs text-purple-400">{user?.email || ''}</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1 bg-white overflow-y-auto min-h-0">
        {navLinks.map((link, idx) => {
          const isActive = currentUrl.startsWith(link.href);
          const isHovered = hovered === idx;
          return (
            <Link
              key={link.name}
              href={link.href}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
              onClick={handleNavClick}
              className={`flex items-center gap-4 px-2 py-2 my-1 rounded transition-all duration-200 cursor-pointer
                ${expanded ? 'px-4' : 'justify-center'}
                ${isActive || isHovered ? 'bg-purple-700 text-white' : 'text-purple-700 hover:bg-purple-100'}
              `}
            >
              <link.icon className={`h-5 w-5 ${isActive || isHovered ? 'text-white' : 'text-purple-700'}`} />
              {expanded && <span className="whitespace-nowrap text-sm">{link.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section with Logout */}
      <div className={`px-2 py-3 border-t border-purple-100 transition-all duration-300 mt-auto ${expanded ? 'px-4' : 'flex items-center justify-center'} bg-white text-purple-700`}>
        <div className="mb-2">
          <a href="#" className={`bg-purple-900 text-xs px-3 py-1 rounded hover:bg-purple-800 transition block text-center text-white ${expanded ? '' : 'hidden'}`}>Your online resume <span className="ml-1">↗</span></a>
        </div>
        {expanded && <div className="text-xs text-purple-400 mb-2">Notification</div>}
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-4 px-2 py-2 w-full rounded transition-all duration-200 cursor-pointer text-red-600 hover:bg-red-50 ${expanded ? 'px-4' : 'justify-center'}`}
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          {expanded && <span className="whitespace-nowrap text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
} 