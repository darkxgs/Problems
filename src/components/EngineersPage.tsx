import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  User, 
  Wrench, 
  X,
  Save,
  Users,
  Award
} from 'lucide-react';
import { Engineer } from '../types';

interface EngineersPageProps {
  engineers: Engineer[];
  onAddEngineer: (engineer: Omit<Engineer, 'id'>) => void;
  onUpdateEngineer: (id: string, engineer: Omit<Engineer, 'id'>) => void;
  onDeleteEngineer: (id: string) => void;
}

const EngineersPage: React.FC<EngineersPageProps> = ({
  engineers,
  onAddEngineer,
  onUpdateEngineer,
  onDeleteEngineer
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEngineer, setEditingEngineer] = useState<Engineer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    specialization: ''
  });

  // Get unique specializations from existing engineers for filter only
  const existingSpecializations = Array.from(new Set(engineers.map(eng => eng.specialization).filter(Boolean)));

  const filteredEngineers = engineers.filter(engineer => {
    const matchesSearch = engineer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engineer.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = specializationFilter === 'all' || engineer.specialization === specializationFilter;
    return matchesSearch && matchesSpecialization;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEngineer) {
      onUpdateEngineer(editingEngineer.id, formData);
      setEditingEngineer(null);
    } else {
      onAddEngineer(formData);
      setIsAddModalOpen(false);
    }
    setFormData({ name: '', specialization: '' });
  };

  const handleEdit = (engineer: Engineer) => {
    if (window.confirm(`هل تريد تعديل بيانات المهندس "${engineer.name}"؟`)) {
      setEditingEngineer(engineer);
      setFormData({
        name: engineer.name,
        specialization: engineer.specialization
      });
    }
  };

  const handleCancelEdit = () => {
    if (window.confirm('هل تريد إلغاء التعديل؟ سيتم فقدان التغييرات غير المحفوظة.')) {
      setEditingEngineer(null);
      setFormData({ name: '', specialization: '' });
    }
  };

  const handleAddNew = () => {
    setIsAddModalOpen(true);
    setFormData({ name: '', specialization: '' });
  };

  const handleDelete = (id: string) => {
    const engineer = engineers.find(e => e.id === id);
    const message = `هل أنت متأكد من حذف المهندس "${engineer?.name}"؟\n\nسيتم إلغاء تعيينه من جميع الشكاوى المرتبطة به تلقائياً.`;
    
    if (window.confirm(message)) {
      onDeleteEngineer(id);
    }
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المهندسين</h1>
          <p className="text-gray-600">إدارة فريق المهندسين والتخصصات</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="h-5 w-5 ml-2" />
          إضافة مهندس جديد
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">إجمالي المهندسين</p>
              <p className="text-2xl font-bold text-gray-900">{engineers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <Award className="h-6 w-6 text-green-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">التخصصات</p>
              <p className="text-2xl font-bold text-gray-900">{existingSpecializations.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Wrench className="h-6 w-6 text-purple-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">المهندسين النشطين</p>
              <p className="text-2xl font-bold text-gray-900">{engineers.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="البحث في المهندسين..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={specializationFilter}
            onChange={(e) => setSpecializationFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">جميع التخصصات</option>
            {existingSpecializations.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Engineers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">قائمة المهندسين</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  اسم المهندس
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التخصص
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEngineers.map((engineer) => (
                <tr key={engineer.id} className="hover:bg-gray-50">
                  {editingEngineer?.id === engineer.id ? (
                    <>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={formData.specialization}
                          onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                          className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="أدخل التخصص"
                        />
                      </td>
                      <td className="px-6 py-4">-</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-reverse space-x-2">
                          <button
                            onClick={handleSubmit}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-md"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="p-2 bg-blue-100 rounded-full ml-3">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="text-sm font-medium text-gray-900">{engineer.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <Wrench className="h-4 w-4 ml-1" />
                          {engineer.specialization}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          نشط
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-reverse space-x-2">
                          <button
                            onClick={() => handleEdit(engineer)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-md"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(engineer.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-md"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Engineer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">إضافة مهندس جديد</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اسم المهندس *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل اسم المهندس"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">التخصص *</label>
                  <input
                    type="text"
                    required
                    value={formData.specialization}
                    onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل التخصص"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-reverse space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  إضافة المهندس
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Specializations Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">توزيع التخصصات</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {existingSpecializations.map(specialization => {
            const count = engineers.filter(eng => eng.specialization === specialization).length;
            const percentage = Math.round((count / engineers.length) * 100);
            
            return (
              <div key={specialization} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{specialization}</h4>
                  <span className="text-sm font-bold text-blue-600">{count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {percentage}% من إجمالي المهندسين
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EngineersPage;