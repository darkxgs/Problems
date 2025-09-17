import React from 'react';
import { 
  Home, 
  FileText, 
  Users, 
  Settings, 
  Package, 
  BarChart3,
  ChevronRight,
  X,
  Wrench
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentPage, onPageChange }) => {
  const menuItems = [
    { icon: Home, label: 'لوحة التحكم', id: 'dashboard' },
    { icon: FileText, label: 'إدارة الشكاوى', id: 'complaints' },
    { icon: Users, label: 'العملاء', id: 'customers' },
    { icon: Wrench, label: 'المهندسين', id: 'engineers' },
    { icon: Package, label: 'المخازن', id: 'warehouse' },
    { icon: BarChart3, label: 'التقارير', id: 'reports' },
    { icon: Settings, label: 'الإعدادات', id: 'settings' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 lg:hidden">
          <h2 className="text-lg font-semibold text-gray-900">القائمة الرئيسية</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button className={`
                  w-full flex items-center justify-between px-4 py-3 text-right rounded-lg transition-colors duration-200
                  ${currentPage === item.id 
                    ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
                onClick={() => {
                  onPageChange(item.id);
                  onClose();
                }}>
                  <div className="flex items-center space-x-reverse space-x-3">
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;