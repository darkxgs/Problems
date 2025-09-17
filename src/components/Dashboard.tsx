import React from 'react';
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

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">مرحباً بك في نظام إدارة الشكاوى</h1>
        <p className="text-blue-100">نظرة شاملة على حالة النظام والأنشطة الحديثة</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي الشكاوى</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalComplaints}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className={`h-4 w-4 ml-1 ${monthlyGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            <span className={growthColor}>{growthText} من الشهر الماضي</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">شكاوى مفتوحة</p>
              <p className="text-3xl font-bold text-red-600">{stats.openComplaints}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600">تحتاج إلى متابعة</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">قيد التحقيق</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.underInvestigation}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600">قيد المعالجة</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">تم الإصلاح</p>
              <p className="text-3xl font-bold text-green-600">{stats.closedComplaints}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600">مكتملة بنجاح</span>
          </div>
        </div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Complaints */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">الشكاوى الحديثة</h3>
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
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">تنبيهات المخزون</h3>
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
        </div>
      </div>

      {/* Quick Stats */}
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
    </div>
  );
};

export default Dashboard;