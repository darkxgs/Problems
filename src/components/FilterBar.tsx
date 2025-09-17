import React from 'react';
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
    { value: 'all' as const, label: 'جميع الشكاوى', color: 'text-gray-600' },
    { value: 'open' as const, label: 'مفتوحة', color: 'text-red-600' },
    { value: 'under_investigation' as const, label: 'قيد التحقيق', color: 'text-yellow-600' },
    { value: 'closed' as const, label: 'مغلقة (تم الإصلاح)', color: 'text-green-600' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="البحث في الشكاوى..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-reverse space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <div className="flex space-x-reverse space-x-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onStatusFilterChange(option.value)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                  ${statusFilter === option.value
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;