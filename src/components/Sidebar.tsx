import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <motion.div 
        className={`
          fixed inset-y-0 right-0 z-50 w-64 glass-dark backdrop-blur-xl shadow-strong
          lg:translate-x-0 lg:static lg:inset-0
        `}
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10 lg:hidden">
          <motion.h2 
            className="heading-secondary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            القائمة الرئيسية
          </motion.h2>
          <motion.button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 btn-animate"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-5 w-5" />
          </motion.button>
        </div>
        
        <nav className="mt-8 px-4">
          <ul className="space-y-3">
            {menuItems.map((item, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.button 
                  className={`
                    w-full flex items-center justify-between px-4 py-4 text-right rounded-xl transition-all duration-300 btn-animate
                    ${currentPage === item.id 
                      ? 'menu-item-active text-white font-semibold' 
                      : 'text-white/90 hover:text-white menu-item-hover'
                    }
                  `}
                  onClick={() => {
                    onPageChange(item.id);
                    onClose();
                  }}
                  whileHover={{ scale: 1.02, x: -8 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-reverse space-x-4">
                    <motion.div
                      className={`p-3 rounded-xl ${
                        currentPage === item.id 
                          ? 'bg-success shadow-medium' 
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                      whileHover={{ rotate: currentPage === item.id ? 0 : 10, scale: 1.1 }}
                      animate={{ 
                        rotate: currentPage === item.id ? [0, 5, -5, 0] : 0,
                        scale: currentPage === item.id ? 1.05 : 1
                      }}
                      transition={{ duration: currentPage === item.id ? 2 : 0.3, repeat: currentPage === item.id ? Infinity : 0 }}
                    >
                      <item.icon className="h-5 w-5" />
                    </motion.div>
                    <span className="text-emphasis text-base">{item.label}</span>
                  </div>
                  <motion.div
                    animate={{ 
                      x: currentPage === item.id ? -8 : 0,
                      rotate: currentPage === item.id ? 180 : 0
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronRight className={`h-5 w-5 ${currentPage === item.id ? 'text-white' : 'text-white/60'}`} />
                  </motion.div>
                </motion.button>
              </motion.li>
            ))}
          </ul>
        </nav>
      </motion.div>
    </>
  );
};

export default Sidebar;