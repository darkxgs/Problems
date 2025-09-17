import React, { useState } from 'react';
import { X, Package, Plus, Minus } from 'lucide-react';
import { SparePart, RepairDetails } from '../types';

interface RepairModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (repairDetails: RepairDetails) => void;
  availableSpareParts: SparePart[];
}

const RepairModal: React.FC<RepairModalProps> = ({ isOpen, onClose, onSubmit, availableSpareParts }) => {
  const [repairType, setRepairType] = useState<'with_spare_parts' | 'without_spare_parts'>('without_spare_parts');
  const [selectedParts, setSelectedParts] = useState<{ part: SparePart; quantity: number }[]>([]);
  const [notes, setNotes] = useState('');

  const handleClose = () => {
    const hasChanges = repairType !== 'without_spare_parts' || selectedParts.length > 0 || notes.trim() !== '';
    
    if (hasChanges) {
      if (window.confirm('هل تريد إغلاق نافذة الإصلاح؟ سيتم فقدان جميع البيانات المدخلة.')) {
        // Reset form
        setRepairType('without_spare_parts');
        setSelectedParts([]);
        setNotes('');
        onClose();
      }
    } else {
      onClose();
    }
  };

  const addSparePart = (part: SparePart) => {
    const existing = selectedParts.find(sp => sp.part.id === part.id);
    if (existing) {
      setSelectedParts(prev => 
        prev.map(sp => 
          sp.part.id === part.id 
            ? { ...sp, quantity: Math.min(sp.quantity + 1, part.quantity) }
            : sp
        )
      );
    } else {
      setSelectedParts(prev => [...prev, { part, quantity: 1 }]);
    }
  };

  const removeSparePart = (partId: string) => {
    setSelectedParts(prev => prev.filter(sp => sp.part.id !== partId));
  };

  const updateQuantity = (partId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeSparePart(partId);
      return;
    }
    
    setSelectedParts(prev =>
      prev.map(sp => {
        if (sp.part.id === partId) {
          return { ...sp, quantity: Math.min(newQuantity, sp.part.quantity) };
        }
        return sp;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const confirmMessage = repairType === 'with_spare_parts' 
      ? `هل أنت متأكد من تأكيد الإصلاح باستخدام قطع الغيار؟\n\nسيتم تحديث المخزون تلقائياً.`
      : `هل أنت متأكد من تأكيد الإصلاح بدون قطع غيار؟`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }
    
    const repairDetails: RepairDetails = {
      repairType,
      notes,
      ...(repairType === 'with_spare_parts' && selectedParts.length > 0 && {
        spareParts: selectedParts.map(sp => sp.part)
      })
    };

    onSubmit(repairDetails);
    
    // Reset form
    setRepairType('without_spare_parts');
    setSelectedParts([]);
    setNotes('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">تفاصيل الإصلاح</h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Repair Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">نوع الإصلاح *</label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="without_spare_parts"
                  checked={repairType === 'without_spare_parts'}
                  onChange={(e) => setRepairType(e.target.value as 'without_spare_parts')}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="mr-3 text-sm text-gray-700">إصلاح بدون قطع غيار</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="with_spare_parts"
                  checked={repairType === 'with_spare_parts'}
                  onChange={(e) => setRepairType(e.target.value as 'with_spare_parts')}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="mr-3 text-sm text-gray-700">إصلاح باستخدام قطع غيار</span>
              </label>
            </div>
          </div>

          {/* Spare Parts Selection */}
          {repairType === 'with_spare_parts' && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">اختيار قطع الغيار</h3>
              
              {/* Available Parts */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">قطع الغيار المتوفرة:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
                  {availableSpareParts.map(part => (
                    <div key={part.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h5 className="font-medium text-gray-900 text-sm">{part.name}</h5>
                          <p className="text-xs text-gray-500">كود: {part.code}</p>
                          <p className="text-xs text-gray-500">المخزن: {part.warehouse}</p>
                        </div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {part.quantity} قطعة
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => addSparePart(part)}
                        disabled={selectedParts.find(sp => sp.part.id === part.id) !== undefined}
                        className="w-full px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        <Plus className="h-3 w-3 inline ml-1" />
                        {selectedParts.find(sp => sp.part.id === part.id) ? 'مُضاف' : 'إضافة'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Parts */}
              {selectedParts.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">قطع الغيار المختارة:</h4>
                  <div className="space-y-3">
                    {selectedParts.map(({ part, quantity }) => (
                      <div key={part.id} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center">
                          <Package className="h-4 w-4 text-blue-600 ml-2" />
                          <div>
                            <span className="font-medium text-gray-900">{part.name}</span>
                            <span className="text-sm text-gray-500 mr-2">({part.code})</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-reverse space-x-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(part.id, quantity - 1)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="mx-3 font-medium">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(part.id, quantity + 1)}
                            disabled={quantity >= part.quantity}
                            className="p-1 text-green-600 hover:bg-green-100 rounded disabled:text-gray-400 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeSparePart(part.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded mr-2"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">ملاحظات الإصلاح</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="اكتب ملاحظات حول عملية الإصلاح..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-reverse space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              تأكيد الإصلاح
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RepairModal;