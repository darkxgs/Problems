import React, { useState } from 'react';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Package,
    MapPin,
    AlertTriangle,
    X,
    Save,
    Minus
} from 'lucide-react';
import { SparePart } from '../types';

interface WarehousePageProps {
    spareParts: SparePart[];
    onAddSparePart: (sparePart: Omit<SparePart, 'id'>) => void;
    onUpdateSparePart: (id: string, sparePart: Omit<SparePart, 'id'>) => void;
    onDeleteSparePart: (id: string) => void;
    onUpdateQuantity: (id: string, quantity: number) => void;
}

const WarehousePage: React.FC<WarehousePageProps> = ({
    spareParts,
    onAddSparePart,
    onUpdateSparePart,
    onDeleteSparePart,
    onUpdateQuantity
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [warehouseFilter, setWarehouseFilter] = useState('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingSparePart, setEditingSparePart] = useState<SparePart | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        warehouse: '',
        quantity: 0,
        code: ''
    });

    const warehouses = Array.from(new Set(spareParts.map(part => part.warehouse)));

    const filteredSpareParts = spareParts.filter(part => {
        const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            part.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            part.warehouse.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesWarehouse = warehouseFilter === 'all' || part.warehouse === warehouseFilter;
        return matchesSearch && matchesWarehouse;
    });

    const lowStockParts = spareParts.filter(part => part.quantity < 10);
    const totalParts = spareParts.reduce((sum, part) => sum + part.quantity, 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSparePart) {
            onUpdateSparePart(editingSparePart.id, formData);
            setEditingSparePart(null);
        } else {
            onAddSparePart(formData);
            setIsAddModalOpen(false);
        }
        setFormData({ name: '', warehouse: '', quantity: 0, code: '' });
    };

    const handleEdit = (sparePart: SparePart) => {
        if (window.confirm(`هل تريد تعديل بيانات قطعة الغيار "${sparePart.name}"؟`)) {
            setEditingSparePart(sparePart);
            setFormData({
                name: sparePart.name,
                warehouse: sparePart.warehouse,
                quantity: sparePart.quantity,
                code: sparePart.code
            });
        }
    };

    const handleCancelEdit = () => {
        if (window.confirm('هل تريد إلغاء التعديل؟ سيتم فقدان التغييرات غير المحفوظة.')) {
            setEditingSparePart(null);
            setFormData({ name: '', warehouse: '', quantity: 0, code: '' });
        }
    };

    const handleDelete = (sparePart: SparePart) => {
        if (window.confirm(`هل أنت متأكد من حذف قطعة الغيار "${sparePart.name}"؟\n\nسيتم حذف جميع البيانات المرتبطة بها نهائياً.`)) {
            onDeleteSparePart(sparePart.id);
        }
    };

    const handleAddNew = () => {
        setIsAddModalOpen(true);
        setFormData({ name: '', warehouse: '', quantity: 0, code: '' });
    };

    const handleQuantityChange = (id: string, change: number) => {
        const part = spareParts.find(p => p.id === id);
        if (part) {
            const newQuantity = Math.max(0, part.quantity + change);
            const action = change > 0 ? 'زيادة' : 'تقليل';
            if (window.confirm(`هل تريد ${action} كمية "${part.name}" إلى ${newQuantity}؟`)) {
                onUpdateQuantity(id, newQuantity);
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">إدارة المخازن</h1>
                    <p className="text-gray-600">إدارة قطع الغيار والمخزون</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <Plus className="h-5 w-5 ml-2" />
                    إضافة قطعة غيار
                </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Package className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="mr-4">
                            <p className="text-sm font-medium text-gray-600">إجمالي القطع</p>
                            <p className="text-2xl font-bold text-gray-900">{totalParts}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-full">
                            <Package className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="mr-4">
                            <p className="text-sm font-medium text-gray-600">أنواع القطع</p>
                            <p className="text-2xl font-bold text-gray-900">{spareParts.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-full">
                            <MapPin className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="mr-4">
                            <p className="text-sm font-medium text-gray-600">المخازن</p>
                            <p className="text-2xl font-bold text-gray-900">{warehouses.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-red-100 rounded-full">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="mr-4">
                            <p className="text-sm font-medium text-gray-600">مخزون منخفض</p>
                            <p className="text-2xl font-bold text-gray-900">{lowStockParts.length}</p>
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
                            placeholder="البحث في قطع الغيار..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <select
                        value={warehouseFilter}
                        onChange={(e) => setWarehouseFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">جميع المخازن</option>
                        {warehouses.map(warehouse => (
                            <option key={warehouse} value={warehouse}>{warehouse}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Low Stock Alert */}
            {lowStockParts.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                        <AlertTriangle className="h-5 w-5 text-red-600 ml-2" />
                        <h3 className="text-lg font-semibold text-red-800">تنبيه: مخزون منخفض</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {lowStockParts.map(part => (
                            <div key={part.id} className="bg-white p-3 rounded border border-red-200">
                                <p className="font-medium text-gray-900">{part.name}</p>
                                <p className="text-sm text-gray-600">{part.warehouse}</p>
                                <p className="text-sm text-red-600 font-medium">متبقي: {part.quantity} قطعة</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Spare Parts Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">قطع الغيار</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    اسم القطعة
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الكود
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    المخزن
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الكمية
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
                            {filteredSpareParts.map((part) => (
                                <tr key={part.id} className="hover:bg-gray-50">
                                    {editingSparePart?.id === part.id ? (
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
                                                    value={formData.code}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                                                    className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="text"
                                                    value={formData.warehouse}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, warehouse: e.target.value }))}
                                                    className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="number"
                                                    value={formData.quantity}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                                                    className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                                        <Package className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-900">{part.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                                    {part.code}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <MapPin className="h-4 w-4 ml-1" />
                                                    {part.warehouse}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center space-x-reverse space-x-2">
                                                    <button
                                                        onClick={() => handleQuantityChange(part.id, -1)}
                                                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                                                        disabled={part.quantity <= 0}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </button>
                                                    <span className="text-sm font-medium text-gray-900 min-w-[3rem] text-center">
                                                        {part.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleQuantityChange(part.id, 1)}
                                                        className="p-1 text-green-600 hover:bg-green-100 rounded"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${part.quantity === 0 ? 'bg-red-100 text-red-800' :
                                                        part.quantity < 10 ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-green-100 text-green-800'
                                                    }`}>
                                                    {part.quantity === 0 ? 'نفد المخزون' :
                                                        part.quantity < 10 ? 'مخزون منخفض' : 'متوفر'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex space-x-reverse space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(part)}
                                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-md"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(part)}
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

            {/* Add Spare Part Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">إضافة قطعة غيار جديدة</h2>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">اسم القطعة *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">كود القطعة *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.code}
                                        onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">المخزن *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.warehouse}
                                        onChange={(e) => setFormData(prev => ({ ...prev, warehouse: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">الكمية *</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                    إضافة القطعة
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WarehousePage;