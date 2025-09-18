import React from 'react';
import { motion } from 'framer-motion';
import { Filter, Search } from 'lucide-react';
import { ComplaintStatus } from '../types';

interface FilterBarProps {
  statusFilter: ComplaintStatus | 'all';
  onStatusFilterChange: (status: ComplaintStatus | 'all') => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  statusFilter,
  onStatusFilterChange,
  searchTerm,
  onSearchChange
}) => {
  const statusOptions = [
    { value: 'all' as const, label: 'جميع الشكاوى', icon: '📋', bgColor: 'bg-gray-500/20' },
    { value: 'open' as const, label: 'مفتوحة', icon: '🔴', bgColor: 'bg-red-500/20' },
    { value: 'under_investigation' as const, label: 'قيد التحقيق', icon: '🟡', bgColor: 'bg-yellow-500/20' },
    { value: 'closed' as const, label: 'مغلقة', icon: '🟢', bgColor: 'bg-green-500/20' }
  ];

  return (
    <motion.div 
      className="glass-card rounded-2xl p-6 mb-6 shadow-medium"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        {/* Search */}
        <motion.div 
          className="search-container flex-1 max-w-md"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Search className="search-icon h-5 w-5" />
          <input
            type="text"
            placeholder="🔍 البحث في الشكاوى (رقم الشكوى، اسم العميل، الوصف...)"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input w-full py-3 px-4 rounded-xl text-white placeholder-white/60 focus:outline-none transition-all duration-300"
          />
        </motion.div>

        {/* Status Filter */}
        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 text-white/80">
            <Filter className="h-5 w-5" />
            <span className="font-medium">تصفية:</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {statusOptions.map((option, index) => (
              <motion.button
                key={option.value}
                onClick={() => onStatusFilterChange(option.value)}
                className={`
                  filter-button px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2
                  ${statusFilter === option.value
                    ? 'active text-white shadow-lg'
                    : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white border border-white/20'
                  }
                `}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-base">{option.icon}</span>
                {option.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FilterBar;