import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Download, 
  Filter,
  FileText,
  PieChart,
  Users,
  Package,
  Clock
} from 'lucide-react';
import { Complaint, Customer, SparePart } from '../types';

interface ReportsPageProps {
  complaints: Complaint[];
  customers: Customer[];
  spareParts: SparePart[];
}

const ReportsPage: React.FC<ReportsPageProps> = ({ complaints, customers, spareParts }) => {
  const [dateRange, setDateRange] = useState('month');
  const [reportType, setReportType] = useState('complaints');

  // Calculate statistics
  const stats = {
    totalComplaints: complaints.length,
    openComplaints: complaints.filter(c => c.status === 'open').length,
    underInvestigation: complaints.filter(c => c.status === 'under_investigation').length,
    closedComplaints: complaints.filter(c => c.status === 'closed').length,
    warrantyComplaints: complaints.filter(c => c.type === 'warranty').length,
    contractComplaints: complaints.filter(c => c.type === 'comprehensive_contract' || c.type === 'non_comprehensive_contract').length,
    outOfWarrantyComplaints: complaints.filter(c => c.type === 'out_of_warranty').length,
    totalCustomers: customers.length,
    totalSpareParts: spareParts.reduce((sum, part) => sum + part.quantity, 0),
    lowStockParts: spareParts.filter(part => part.quantity < 10).length
  };

  // Calculate completion rate
  const completionRate = stats.totalComplaints > 0 
    ? Math.round((stats.closedComplaints / stats.totalComplaints) * 100)
    : 0;

  // Group complaints by branch
  const complaintsByBranch = complaints.reduce((acc, complaint) => {
    const branch = complaint.customer.branch;
    acc[branch] = (acc[branch] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Group complaints by type
  const complaintsByType = {
    'ضمان': stats.warrantyComplaints,
    'عقد شامل/غير شامل': stats.contractComplaints,
    'خارج الضمان': stats.outOfWarrantyComplaints
  };

  // Recent activity
  const recentComplaints = complaints
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
    .slice(0, 10);

  const handleExportReport = () => {
    // This would typically generate and download a report
    alert('سيتم تصدير التقرير قريباً');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">التقارير والإحصائيات</h1>
          <p className="text-gray-600">تحليل شامل لأداء النظام والأنشطة</p>
        </div>
        <div className="flex space-x-reverse space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">هذا الأسبوع</option>
            <option value="month">هذا الشهر</option>
            <option value="quarter">هذا الربع</option>
            <option value="year">هذا العام</option>
          </select>
          <button
            onClick={handleExportReport}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <Download className="h-5 w-5 ml-2" />
            تصدير التقرير
          </button>
        </div>
      </div>

      {/* Key Metrics */}
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
            <TrendingUp className="h-4 w-4 text-green-500 ml-1" />
            <span className="text-green-600">+8% من الشهر الماضي</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">معدل الإنجاز</p>
              <p className="text-3xl font-bold text-green-600">{completionRate}%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <PieChart className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600">{stats.closedComplaints} من {stats.totalComplaints} شكوى</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">متوسط وقت الحل</p>
              <p className="text-3xl font-bold text-yellow-600">2.5</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600">أيام في المتوسط</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">رضا العملاء</p>
              <p className="text-3xl font-bold text-purple-600">4.2</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600">من 5 نجوم</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Complaints by Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">توزيع الشكاوى حسب الحالة</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full ml-3"></div>
                <span className="text-sm text-gray-600">مفتوحة</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-900 ml-2">{stats.openComplaints}</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${(stats.openComplaints / stats.totalComplaints) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded-full ml-3"></div>
                <span className="text-sm text-gray-600">قيد التحقيق</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-900 ml-2">{stats.underInvestigation}</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${(stats.underInvestigation / stats.totalComplaints) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full ml-3"></div>
                <span className="text-sm text-gray-600">مغلقة</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-900 ml-2">{stats.closedComplaints}</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(stats.closedComplaints / stats.totalComplaints) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Complaints by Type */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">توزيع الشكاوى حسب النوع</h3>
          <div className="space-y-4">
            {Object.entries(complaintsByType).map(([type, count], index) => {
              const colors = ['bg-blue-500', 'bg-purple-500', 'bg-orange-500'];
              return (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 ${colors[index]} rounded-full ml-3`}></div>
                    <span className="text-sm text-gray-600">{type}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 ml-2">{count}</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${colors[index]} h-2 rounded-full`}
                        style={{ width: `${(count / stats.totalComplaints) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Complaints by Branch */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">الشكاوى حسب الفرع</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(complaintsByBranch).map(([branch, count]) => (
            <div key={branch} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{branch}</h4>
                <span className="text-sm font-bold text-blue-600">{count}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${(count / stats.totalComplaints) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {Math.round((count / stats.totalComplaints) * 100)}% من إجمالي الشكاوى
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">النشاط الحديث</h3>
        <div className="space-y-4">
          {recentComplaints.map((complaint) => (
            <div key={complaint.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-full ml-3">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">شكوى #{complaint.id}</p>
                  <p className="text-sm text-gray-600">{complaint.customer.name} - {complaint.customer.branch}</p>
                </div>
              </div>
              <div className="text-left">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  complaint.status === 'open' ? 'bg-red-100 text-red-800' :
                  complaint.status === 'under_investigation' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {complaint.status === 'open' ? 'مفتوحة' :
                   complaint.status === 'under_investigation' ? 'قيد التحقيق' : 'مغلقة'}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(complaint.dateTime).toLocaleDateString('ar-SA')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inventory Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">حالة المخزون</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <Package className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalSpareParts}</p>
            <p className="text-sm text-gray-600">إجمالي قطع الغيار</p>
          </div>
          
          <div className="text-center">
            <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{spareParts.length}</p>
            <p className="text-sm text-gray-600">أنواع القطع</p>
          </div>
          
          <div className="text-center">
            <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.lowStockParts}</p>
            <p className="text-sm text-gray-600">قطع تحتاج تجديد</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;