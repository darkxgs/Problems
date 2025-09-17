import React from 'react';
import { 
  Calendar, 
  Phone, 
  MapPin, 
  User, 
  Package, 
  AlertCircle, 
  CheckCircle,
  Clock,
  Wrench,
  Trash2
} from 'lucide-react';
import { Complaint, ComplaintStatus, ComplaintType } from '../types';

interface ComplaintCardProps {
  complaint: Complaint;
  onStatusChange: (id: string, status: ComplaintStatus) => void;
  onRepair: (id: string) => void;
  onDelete: (id: string) => void;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, onStatusChange, onRepair, onDelete }) => {
  const getStatusColor = (status: ComplaintStatus) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'under_investigation': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: ComplaintStatus) => {
    switch (status) {
      case 'open': return <AlertCircle className="h-4 w-4" />;
      case 'under_investigation': return <Clock className="h-4 w-4" />;
      case 'closed': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: ComplaintStatus) => {
    switch (status) {
      case 'open': return 'مفتوحة';
      case 'under_investigation': return 'قيد التحقيق';
      case 'closed': return 'مغلقة (تم الإصلاح)';
      default: return status;
    }
  };

  const getTypeLabel = (type: ComplaintType) => {
    switch (type) {
      case 'warranty': return 'ضمان';
      case 'comprehensive_contract': return 'عقد شامل';
      case 'non_comprehensive_contract': return 'عقد غير شامل';
      case 'out_of_warranty': return 'خارج الضمان';
      default: return type;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            شكوى رقم #{complaint.id}
          </h3>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
            {getStatusIcon(complaint.status)}
            <span className="mr-1">{getStatusLabel(complaint.status)}</span>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 ml-1" />
            {formatDate(complaint.dateTime)}
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 ml-2" />
            <span className="font-medium">العميل:</span>
            <span className="mr-1">{complaint.customer.name}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 ml-2" />
            <span className="font-medium">الفرع:</span>
            <span className="mr-1">{complaint.customer.branch}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="h-4 w-4 ml-2" />
            <span className="font-medium">الهاتف:</span>
            <span className="mr-1 direction-ltr">{complaint.customer.phone}</span>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Package className="h-4 w-4 ml-2" />
            <span className="font-medium">المنتج:</span>
            <span className="mr-1">{complaint.product.brand} - {complaint.product.type}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium">الموديل:</span>
            <span className="mr-1">{complaint.product.model}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium">السيريال:</span>
            <span className="mr-1 font-mono">{complaint.product.serial}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-900 mb-2">وصف الشكوى:</p>
        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{complaint.description}</p>
      </div>

      {/* Type and Engineer */}
      <div className="flex flex-wrap gap-4 mb-4 text-sm">
        <div>
          <span className="font-medium text-gray-700">نوع الشكوى:</span>
          <span className="mr-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-md">
            {getTypeLabel(complaint.type)}
          </span>
        </div>
        {complaint.assignedEngineer && (
          <div>
            <span className="font-medium text-gray-700">المهندس المسؤول:</span>
            <span className="mr-2 px-2 py-1 bg-green-100 text-green-800 rounded-md">
              {complaint.assignedEngineer.name}
            </span>
          </div>
        )}
      </div>

      {/* Repair Details */}
      {complaint.repairDetails && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm font-medium text-green-800 mb-2">تفاصيل الإصلاح:</p>
          <p className="text-sm text-green-700 mb-1">
            نوع الإصلاح: {complaint.repairDetails.repairType === 'with_spare_parts' ? 'باستخدام قطع غيار' : 'بدون قطع غيار'}
          </p>
          {complaint.repairDetails.spareParts && complaint.repairDetails.spareParts.length > 0 && (
            <div className="text-sm text-green-700 mb-1">
              <span className="font-medium">قطع الغيار المستخدمة:</span>
              <ul className="mr-4 mt-1">
                {complaint.repairDetails.spareParts.map((part) => (
                  <li key={part.id}>• {part.name} ({part.code})</li>
                ))}
              </ul>
            </div>
          )}
          {complaint.repairDetails.notes && (
            <p className="text-sm text-green-700">
              <span className="font-medium">ملاحظات:</span> {complaint.repairDetails.notes}
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 justify-between">
        <div className="flex flex-wrap gap-2">
          {complaint.status === 'open' && (
            <button
              onClick={() => {
                if (window.confirm(`هل تريد بدء التحقيق في الشكوى رقم #${complaint.id}؟`)) {
                  onStatusChange(complaint.id, 'under_investigation');
                }
              }}
              className="px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors duration-200"
            >
              بدء التحقيق
            </button>
          )}
          
          {complaint.status === 'under_investigation' && (
            <button
              onClick={() => onRepair(complaint.id)}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 flex items-center"
            >
              <Wrench className="h-4 w-4 ml-1" />
              تم الإصلاح
            </button>
          )}
        </div>
        
        {/* Delete Button - Always visible */}
        <button
          onClick={() => {
            if (window.confirm(`هل أنت متأكد من حذف الشكوى رقم #${complaint.id}؟\n\nسيتم حذف جميع البيانات المرتبطة بها نهائياً.`)) {
              onDelete(complaint.id);
            }
          }}
          className="px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 flex items-center"
        >
          <Trash2 className="h-4 w-4 ml-1" />
          حذف
        </button>
      </div>
    </div>
  );
};

export default ComplaintCard;