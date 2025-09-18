import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Bell, Settings, User, ClipboardList } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
  currentUser: { name: string };
  onSettingsClick?: () => void;
  onNotificationsClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, currentUser, onSettingsClick, onNotificationsClick }) => {
  return (
    <motion.header 
      className="glass-dark backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-strong"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Right side - Menu and Logo */}
          <div className="flex items-center space-x-reverse space-x-4">
            <motion.button
              onClick={onMenuToggle}
              className="p-3 rounded-xl text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-teal-400/50 btn-animate shadow-medium"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu className="h-6 w-6" />
            </motion.button>
            <motion.div 
              className="flex items-center space-x-reverse space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="p-3 rounded-2xl bg-success shadow-medium"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                whileHover={{ scale: 1.1 }}
              >
                <ClipboardList className="h-7 w-7 text-white" />
              </motion.div>
              <h1 className="heading-secondary">نظام إدارة الشكاوى</h1>
            </motion.div>
          </div>

          {/* Left side - User actions */}
          <motion.div 
            className="flex items-center space-x-reverse space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button 
              onClick={onNotificationsClick}
              className="relative p-3 text-white hover:text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-orange-400/50 rounded-xl btn-animate shadow-medium"
              title="الإشعارات"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Bell className="h-6 w-6" />
              <motion.div 
                className="absolute -top-1 -right-1 w-4 h-4 bg-warning rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
              </motion.div>
            </motion.button>
            <motion.button 
              onClick={onSettingsClick}
              className="p-3 text-white hover:text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400/50 rounded-xl btn-animate shadow-medium"
              title="الإعدادات"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
            >
              <Settings className="h-6 w-6" />
            </motion.button>
            <motion.div 
              className="flex items-center space-x-reverse space-x-4 text-sm glass-card rounded-2xl px-4 py-3 shadow-medium"
              whileHover={{ scale: 1.05 }}
            >
              <div className="p-2 bg-info rounded-xl">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="text-right">
                <span className="text-emphasis block">{currentUser.name}</span>
                <span className="text-white/70 text-xs">مدير النظام</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;