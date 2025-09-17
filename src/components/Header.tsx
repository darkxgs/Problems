import React from 'react';
import { Menu, Bell, Settings, User, ClipboardList } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
  currentUser: { name: string };
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, currentUser }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Right side - Menu and Logo */}
          <div className="flex items-center space-x-reverse space-x-4">
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-reverse space-x-2">
              <ClipboardList className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">نظام إدارة الشكاوى</h1>
            </div>
          </div>

          {/* Left side - User actions */}
          <div className="flex items-center space-x-reverse space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md">
              <Bell className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md">
              <Settings className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-reverse space-x-2 text-sm">
              <User className="h-5 w-5 text-gray-400" />
              <span className="text-gray-700 font-medium">{currentUser.name}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;