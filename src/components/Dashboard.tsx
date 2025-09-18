import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Package,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3
} from 'lucide-react';

interface DashboardProps {
  complaints: any[];
  customers: any[];
  spareParts: any[];
  systemSettings: Record<string, any>;
  statistics: Record<string, number>;
}

const Dashboard: React.FC<DashboardProps> = ({ complaints, customers, spareParts, systemSettings, statistics }) => {
  const lowStockThreshold = systemSettings.low_stock_threshold || 10;

  const stats = {
    totalComplaints: complaints.length,
    openComplaints: complaints.filter(c => c.status === 'open').length,
    underInvestigation: complaints.filter(c => c.status === 'under_investigation').length,
    closedComplaints: complaints.filter(c => c.status === 'closed').length,
    totalCustomers: customers.length,
    totalSpareParts: spareParts.reduce((sum, part) => sum + part.quantity, 0),
    lowStockParts: spareParts.filter(part => part.quantity < lowStockThreshold).length
  };

  const recentComplaints = complaints.slice(0, 5);
  const lowStockParts = spareParts.filter(part => part.quantity < lowStockThreshold);

  const monthlyGrowth = statistics.monthlyGrowth || 0;
  const growthText = monthlyGrowth >= 0 ? `+${monthlyGrowth}%` : `${monthlyGrowth}%`;
  const growthColor = monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Section */}
      <motion.div 
        className="glass-card rounded-3xl p-8 text-white relative overflow-hidden shadow-strong"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
      >
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
          <div className="lg:col-span-2">
            <motion.h1 
              className="heading-primary mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              مرحباً بك في نظام إدارة الشكاوى
            </motion.h1>
            <motion.p 
              className="text-body text-lg mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              نظرة شاملة على حالة النظام والأنشطة الحديثة
            </motion.p>
            <motion.div 
              className="grid grid-cols-2 gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="bg-white/10 rounded-xl px-4 py-3 border border-white/20">
                <div className="text-muted text-xs mb-1">التاريخ</div>
                <div className="text-emphasis font-semibold">{new Date().toLocaleDateString('ar-SA')}</div>
              </div>
              <div className="bg-white/10 rounded-xl px-4 py-3 border border-white/20">
                <div className="text-muted text-xs mb-1">الوقت</div>
                <div className="text-emphasis font-semibold">{new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            </motion.div>
          </div>
          <div className="lg:col-span-1 flex justify-center">
            <motion.div 
              className="text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
            >
              <motion.div 
                className="w-24 h-24 bg-success rounded-2xl flex items-center justify-center shadow-medium mb-3 mx-auto"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <span className="text-3xl">📊</span>
              </motion.div>
              <div className="text-muted text-sm">إحصائيات مباشرة</div>
            </motion.div>
          </div>
          <div className="lg:col-span-1">
            <motion.div 
              className="bg-white/10 rounded-2xl p-4 border border-white/20"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
            >
              <div className="text-center">
                <div className="number-large text-success mb-2">{stats.totalComplaints}</div>
                <div className="text-muted text-sm">إجمالي الشكاوى</div>
                <div className="text-xs text-muted mt-1">هذا الشهر</div>
              </div>
            </motion.div>
          </div>
        </div>
        <motion.div 
          className="absolute top-0 left-0 w-40 h-40 accent-orange opacity-20 rounded-full -ml-20 -mt-20"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      {/* Statistics Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
      >
        <motion.div 
          className="glass-card rounded-2xl p-6 card-uniform"
          variants={itemVariants}
          whileHover={{ y: -8, scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className="text-muted text-sm mb-2">إجمالي الشكاوى</p>
              <motion.p 
                className="number-large text-info"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                {stats.totalComplaints}
              </motion.p>
            </div>
            <motion.div 
              className="p-4 bg-info rounded-2xl shadow-medium"
              whileHover={{ rotate: 15, scale: 1.1 }}
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <BarChart3 className="h-6 w-6 text-white" />
            </motion.div>
          </div>
          <div className="mt-auto">
            <div className="flex items-center text-sm bg-white/10 rounded-xl p-3">
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <TrendingUp className={`h-4 w-4 ml-2 ${monthlyGrowth >= 0 ? 'text-success' : 'text-danger'}`} />
              </motion.div>
              <span className={`font-medium text-sm ${monthlyGrowth >= 0 ? 'text-success' : 'text-danger'}`}>
                {growthText} من الشهر الماضي
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="glass-card rounded-2xl p-6 card-uniform"
          variants={itemVariants}
          whileHover={{ y: -8, scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className="text-muted text-sm mb-2">شكاوى مفتوحة</p>
              <motion.p 
                className="number-large text-danger"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
              >
                {stats.openComplaints}
              </motion.p>
            </div>
            <motion.div 
              className="p-4 bg-warning rounded-2xl shadow-medium"
              whileHover={{ rotate: 15, scale: 1.1 }}
              animate={{ 
                rotate: stats.openComplaints > 0 ? [0, 10, -10, 0] : 0,
                scale: stats.openComplaints > 0 ? [1, 1.05, 1] : 1
              }}
              transition={{ duration: 2, repeat: stats.openComplaints > 0 ? Infinity : 0 }}
            >
              <AlertTriangle className="h-6 w-6 text-white" />
            </motion.div>
          </div>
          <div className="mt-auto">
            {stats.openComplaints > 0 ? (
              <div className="bg-red-500/20 rounded-xl p-3 border border-red-400/30">
                <span className="text-red-200 font-medium text-sm">⚠️ تحتاج متابعة عاجلة</span>
              </div>
            ) : (
              <div className="bg-green-500/20 rounded-xl p-3 border border-green-400/30">
                <span className="text-green-200 font-medium text-sm">✅ لا توجد شكاوى مفتوحة</span>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div 
          className="glass-card rounded-2xl p-6 card-uniform"
          variants={itemVariants}
          whileHover={{ y: -8, scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className="text-muted text-sm mb-2">قيد التحقيق</p>
              <motion.p 
                className="number-large text-warning"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
              >
                {stats.underInvestigation}
              </motion.p>
            </div>
            <motion.div 
              className="p-4 bg-warning rounded-2xl shadow-medium"
              whileHover={{ rotate: 15, scale: 1.1 }}
              animate={{ 
                rotate: stats.underInvestigation > 0 ? 360 : 0
              }}
              transition={{ 
                duration: stats.underInvestigation > 0 ? 4 : 0, 
                repeat: stats.underInvestigation > 0 ? Infinity : 0, 
                ease: "linear" 
              }}
            >
              <Clock className="h-6 w-6 text-white" />
            </motion.div>
          </div>
          <div className="mt-auto">
            <div className="bg-yellow-500/20 rounded-xl p-3 border border-yellow-400/30">
              <span className="text-yellow-200 font-medium text-sm">
                {stats.underInvestigation > 0 ? '🔍 قيد المعالجة' : '⏸️ لا توجد حالات'}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="glass-card rounded-2xl p-6 card-uniform"
          variants={itemVariants}
          whileHover={{ y: -8, scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className="text-muted text-sm mb-2">تم الإصلاح</p>
              <motion.p 
                className="number-large text-success"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
              >
                {stats.closedComplaints}
              </motion.p>
            </div>
            <motion.div 
              className="p-4 bg-success rounded-2xl shadow-medium"
              whileHover={{ rotate: 15, scale: 1.1 }}
              animate={{ 
                scale: stats.closedComplaints > 0 ? [1, 1.05, 1] : 1
              }}
              transition={{ 
                duration: 2, 
                repeat: stats.closedComplaints > 0 ? Infinity : 0 
              }}
            >
              <CheckCircle className="h-6 w-6 text-white" />
            </motion.div>
          </div>
          <div className="mt-auto">
            <div className="bg-green-500/20 rounded-xl p-3 border border-green-400/30">
              <span className="text-green-200 font-medium text-sm">
                ✅ {stats.closedComplaints > 0 ? 'مكتملة بنجاح' : 'لا توجد حالات مكتملة'}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Recent Activity Section */}
      <motion.div 
        className="section-header"
        variants={itemVariants}
      >
        <h2 className="heading-secondary">النشاط الحديث</h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Complaints */}
        <motion.div 
          className="glass-card rounded-2xl p-6"
          variants={itemVariants}
          whileHover={{ y: -5 }}
        >
          <h3 className="heading-tertiary mb-6">الشكاوى الحديثة</h3>
          <div className="space-y-4">
            {recentComplaints.map((complaint) => (
              <div key={complaint.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">شكوى #{complaint.id}</p>
                  <p className="text-sm text-gray-600">{complaint.customer.name}</p>
                </div>
                <div className="text-left">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${complaint.status === 'open' ? 'bg-red-100 text-red-800' :
                    complaint.status === 'under_investigation' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                    {complaint.status === 'open' ? 'مفتوحة' :
                      complaint.status === 'under_investigation' ? 'قيد التحقيق' : 'مغلقة'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Low Stock Alert */}
        <motion.div 
          className="glass-card rounded-2xl p-6"
          variants={itemVariants}
          whileHover={{ y: -5 }}
        >
          <h3 className="heading-tertiary mb-6">تنبيهات المخزون</h3>
          {lowStockParts.length > 0 ? (
            <div className="space-y-4">
              {lowStockParts.map((part) => (
                <div key={part.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <p className="font-medium text-gray-900">{part.name}</p>
                    <p className="text-sm text-gray-600">{part.warehouse}</p>
                  </div>
                  <div className="text-left">
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                      {part.quantity} قطعة
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <p className="text-gray-600">جميع قطع الغيار متوفرة بكميات كافية</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Stats Section */}
      <motion.div 
        className="section-header"
        variants={itemVariants}
      >
        <h2 className="heading-secondary">إحصائيات سريعة</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <Users className="h-8 w-8 text-blue-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
          <p className="text-sm text-gray-600">إجمالي العملاء</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <Package className="h-8 w-8 text-green-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{stats.totalSpareParts}</p>
          <p className="text-sm text-gray-600">قطع الغيار المتوفرة</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{stats.lowStockParts}</p>
          <p className="text-sm text-gray-600">قطع غيار تحتاج تجديد</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;