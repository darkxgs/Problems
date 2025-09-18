import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
import ConfirmationModal from './ConfirmationModal';

interface ComplaintCardProps {
  complaint: Complaint;
  onStatusChange: (id: string, status: ComplaintStatus) => void;
  onRepair: (id: string) => void;
  onDelete: (id: string) => void;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, onStatusChange, onRepair, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
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
    <motion.div 
      className={`glass-card rounded-3xl p-8 shadow-strong ${isChangingStatus ? 'status-changing' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <motion.div 
            className="flex items-center gap-3 mb-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
              #{complaint.id}
            </div>
            <h3 className="complaint-id">شكوى رقم {complaint.id}</h3>
          </motion.div>
          <motion.div 
            className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm ${
              complaint.status === 'open' ? 'status-open' :
              complaint.status === 'under_investigation' ? 'status-investigation' :
              'status-closed'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: complaint.status === 'under_investigation' ? 360 : 0 }}
              transition={{ duration: 2, repeat: complaint.status === 'under_investigation' ? Infinity : 0 }}
            >
              {getStatusIcon(complaint.status)}
            </motion.div>
            <span className="mr-2">{getStatusLabel(complaint.status)}</span>
          </motion.div>
        </div>
        <motion.div 
          className="text-xs text-white/80 bg-white/10 rounded-lg p-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center">
            <Calendar className="h-4 w-4 ml-1" />
            {formatDate(complaint.dateTime)}
          </div>
        </motion.div>
      </div>

      {/* Customer Info */}
      <motion.div 
        className="card-section"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h4 className="text-white font-semibold mb-3 flex items-center">
          <User className="h-5 w-5 ml-2 text-blue-300" />
          معلومات العميل
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="info-row">
            <User className="info-icon text-blue-300" />
            <div>
              <span className="label-text">العميل</span>
              <div className="value-text">{complaint.customer.name}</div>
            </div>
          </div>
          <div className="info-row">
            <MapPin className="info-icon text-green-300" />
            <div>
              <span className="label-text">الفرع</span>
              <div className="value-text">{complaint.customer.branch}</div>
            </div>
          </div>
          <div className="info-row">
            <Phone className="info-icon text-purple-300" />
            <div>
              <span className="label-text">الهاتف</span>
              <div className="value-text monospace-text">{complaint.customer.phone}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Product Info */}
      <motion.div 
        className="card-section-alt"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <h4 className="text-white font-semibold mb-3 flex items-center">
          <Package className="h-5 w-5 ml-2 text-orange-300" />
          معلومات المنتج
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="info-row">
            <Package className="info-icon text-orange-300" />
            <div>
              <span className="label-text">المنتج</span>
              <div className="value-text">{complaint.product.brand} - {complaint.product.type}</div>
            </div>
          </div>
          <div className="info-row">
            <span className="info-icon">📱</span>
            <div>
              <span className="label-text">الموديل</span>
              <div className="value-text">{complaint.product.model}</div>
            </div>
          </div>
          <div className="info-row">
            <span className="info-icon">🔢</span>
            <div>
              <span className="label-text">السيريال</span>
              <div className="value-text monospace-text">{complaint.product.serial}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Description */}
      <motion.div 
        className="card-section"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h4 className="text-white font-semibold mb-3 flex items-center">
          <span className="text-lg ml-2">📝</span>
          وصف الشكوى
        </h4>
        <p className="value-text leading-relaxed bg-white/5 p-4 rounded-xl border border-white/10">
          {complaint.description}
        </p>
      </motion.div>

      {/* Type and Engineer */}
      <motion.div 
        className="card-section-alt"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="info-row">
            <span className="info-icon">🏷️</span>
            <div>
              <span className="label-text">نوع الشكوى</span>
              <div className="value-text bg-blue-500/20 px-3 py-1 rounded-lg inline-block">
                {getTypeLabel(complaint.type)}
              </div>
            </div>
          </div>
          {complaint.assignedEngineer && (
            <div className="info-row">
              <span className="info-icon">👨‍🔧</span>
              <div>
                <span className="label-text">المهندس المسؤول</span>
                <div className="value-text bg-green-500/20 px-3 py-1 rounded-lg inline-block">
                  {complaint.assignedEngineer.name}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

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
      <motion.div 
        className="flex flex-wrap gap-3 justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex flex-wrap gap-3">
          {complaint.status === 'open' && (
            <motion.button
              onClick={() => setShowStatusModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium rounded-xl hover:from-yellow-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200 btn-animate flex items-center gap-2"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Clock className="h-5 w-5" />
              بدء التحقيق
            </motion.button>
          )}
          
          {complaint.status === 'under_investigation' && (
            <motion.button
              onClick={() => onRepair(complaint.id)}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium rounded-xl hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 flex items-center gap-2 btn-animate"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Wrench className="h-5 w-5" />
              </motion.div>
              تم الإصلاح
            </motion.button>
          )}
        </div>
        
        {/* Delete Button - Always visible */}
        <motion.button
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-xl hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-200 flex items-center gap-2 btn-animate"
          whileHover={{ scale: 1.05, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Trash2 className="h-5 w-5" />
          حذف
        </motion.button>
      </motion.div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => onDelete(complaint.id)}
        title="تأكيد حذف الشكوى"
        message={`هل أنت متأكد من حذف الشكوى رقم #${complaint.id}؟\n\nسيتم حذف جميع البيانات المرتبطة بها نهائياً ولا يمكن التراجع عن هذا الإجراء.`}
        confirmText="حذف نهائياً"
        cancelText="إلغاء"
        type="danger"
      />

      <ConfirmationModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onConfirm={() => {
          setIsChangingStatus(true);
          setTimeout(() => {
            onStatusChange(complaint.id, 'under_investigation');
            setIsChangingStatus(false);
          }, 500);
        }}
        title="تأكيد بدء التحقيق"
        message={`هل تريد بدء التحقيق في الشكوى رقم #${complaint.id}؟\n\nسيتم تغيير حالة الشكوى إلى "قيد التحقيق".`}
        confirmText="بدء التحقيق"
        cancelText="إلغاء"
        type="warning"
      />
    </motion.div>
  );
};

export default ComplaintCard;