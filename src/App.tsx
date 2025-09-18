import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FilterBar from './components/FilterBar';
import ComplaintCard from './components/ComplaintCard';
import ComplaintForm from './components/ComplaintForm';
import RepairModal from './components/RepairModal';
import CustomersPage from './components/CustomersPage';
import EngineersPage from './components/EngineersPage';
import WarehousePage from './components/WarehousePage';
import ReportsPage from './components/ReportsPage';
import SettingsPage from './components/SettingsPage';
import { Complaint, ComplaintStatus, RepairDetails, Customer, SparePart, Engineer, Product, User } from './types';
import { 
  customerApi, 
  engineerApi, 
  productApi, 
  sparePartApi, 
  complaintApi, 
  userApi,
  settingsApi,
  complaintTypesApi,
  statisticsApi
} from './lib/api';
import { initializeDatabase } from './lib/initDb';
import { testDatabaseConnection } from './lib/testConnection';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [repairModalOpen, setRepairModalOpen] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [systemSettings, setSystemSettings] = useState<Record<string, any>>({});
  const [complaintTypes, setComplaintTypes] = useState<Array<{key: string, label: string}>>([]);
  const [statistics, setStatistics] = useState<Record<string, number>>({});

  // Initialize database and load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const connectionTest = await testDatabaseConnection();
        if (!connectionTest) {
          throw new Error('Database connection failed');
        }
        
        await initializeDatabase();
        
        const [
          complaintsData,
          customersData,
          sparePartsData,
          engineersData,
          productsData,
          userData,
          settingsData,
          complaintTypesData,
          statisticsData
        ] = await Promise.all([
          complaintApi.getAll(),
          customerApi.getAll(),
          sparePartApi.getAll(),
          engineerApi.getAll(),
          productApi.getAll(),
          userApi.getCurrent(),
          settingsApi.getAll(),
          complaintTypesApi.getAll(),
          statisticsApi.calculateTrends()
        ]);

        setComplaints(complaintsData);
        setCustomers(customersData);
        setSpareParts(sparePartsData);
        setEngineers(engineersData);
        setProducts(productsData);
        setCurrentUser(userData);
        setSystemSettings(settingsData);
        setComplaintTypes(complaintTypesData);
        setStatistics(statisticsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Customer management functions
  const handleAddCustomer = async (customer: Omit<Customer, 'id'>) => {
    try {
      const newCustomer = await customerApi.create(customer);
      setCustomers(prev => [...prev, newCustomer]);
      alert('تم إضافة العميل بنجاح');
    } catch (error) {
      console.error('Error adding customer:', error);
      alert('حدث خطأ أثناء إضافة العميل. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleUpdateCustomer = async (id: string, customer: Omit<Customer, 'id'>) => {
    try {
      const updatedCustomer = await customerApi.update(id, customer);
      setCustomers(prev => prev.map(c => c.id === id ? updatedCustomer : c));
      alert('تم تحديث بيانات العميل بنجاح');
    } catch (error) {
      console.error('Error updating customer:', error);
      alert('حدث خطأ أثناء تحديث بيانات العميل. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    try {
      await customerApi.delete(id);
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  // Engineer management functions
  const handleAddEngineer = async (engineer: Omit<Engineer, 'id'>) => {
    try {
      const newEngineer = await engineerApi.create(engineer);
      setEngineers(prev => [...prev, newEngineer]);
    } catch (error) {
      console.error('Error adding engineer:', error);
    }
  };

  const handleUpdateEngineer = async (id: string, engineer: Omit<Engineer, 'id'>) => {
    try {
      const updatedEngineer = await engineerApi.update(id, engineer);
      setEngineers(prev => prev.map(e => e.id === id ? updatedEngineer : e));
    } catch (error) {
      console.error('Error updating engineer:', error);
    }
  };

  const handleDeleteEngineer = async (id: string) => {
    try {
      await engineerApi.delete(id);
      setEngineers(prev => prev.filter(e => e.id !== id));
      
      // Refresh complaints to show updated engineer assignments
      const updatedComplaints = await complaintApi.getAll();
      setComplaints(updatedComplaints);
    } catch (error) {
      console.error('Error deleting engineer:', error);
      alert('حدث خطأ أثناء حذف المهندس. يرجى المحاولة مرة أخرى.');
    }
  };

  // Spare parts management functions
  const handleAddSparePart = async (sparePart: Omit<SparePart, 'id'>) => {
    try {
      const newSparePart = await sparePartApi.create(sparePart);
      setSpareParts(prev => [...prev, newSparePart]);
    } catch (error) {
      console.error('Error adding spare part:', error);
    }
  };

  const handleUpdateSparePart = async (id: string, sparePart: Omit<SparePart, 'id'>) => {
    try {
      const updatedSparePart = await sparePartApi.update(id, sparePart);
      setSpareParts(prev => prev.map(p => p.id === id ? updatedSparePart : p));
    } catch (error) {
      console.error('Error updating spare part:', error);
    }
  };

  const handleDeleteSparePart = async (id: string) => {
    try {
      await sparePartApi.delete(id);
      setSpareParts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting spare part:', error);
    }
  };

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    try {
      await sparePartApi.updateQuantity(id, quantity);
      setSpareParts(prev => prev.map(p => p.id === id ? { ...p, quantity } : p));
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleUpdateUser = async (user: User) => {
    try {
      const updatedUser = await userApi.update(user.id, user);
      setCurrentUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleUpdateSettings = async (key: string, value: any) => {
    try {
      await settingsApi.update(key, value);
      setSystemSettings(prev => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  // Filter complaints based on status and search term
  const filteredComplaints = complaints.filter(complaint => {
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesSearch = !searchTerm || 
      complaint.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.id.includes(searchTerm) ||
      complaint.product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (id: string, status: ComplaintStatus) => {
    try {
      await complaintApi.updateStatus(id, status);
      setComplaints(prev => prev.map(complaint => 
        complaint.id === id ? { ...complaint, status } : complaint
      ));
    } catch (error) {
      console.error('Error updating complaint status:', error);
    }
  };

  const handleRepairClick = (id: string) => {
    setSelectedComplaintId(id);
    setRepairModalOpen(true);
  };

  const handleRepairSubmit = async (repairDetails: RepairDetails) => {
    try {
      await complaintApi.addRepairDetails(selectedComplaintId, repairDetails);
      setComplaints(prev => prev.map(complaint => 
        complaint.id === selectedComplaintId 
          ? { ...complaint, status: 'closed' as ComplaintStatus, repairDetails }
          : complaint
      ));
      
      // Update spare parts quantities if used
      if (repairDetails.repairType === 'with_spare_parts' && repairDetails.spareParts) {
        setSpareParts(prev => prev.map(part => {
          const usedPart = repairDetails.spareParts?.find(sp => sp.id === part.id);
          return usedPart ? { ...part, quantity: part.quantity - 1 } : part;
        }));
      }
      
      setRepairModalOpen(false);
      setSelectedComplaintId('');
    } catch (error) {
      console.error('Error submitting repair:', error);
    }
  };

  const handleComplaintSubmit = async (newComplaint: Omit<Complaint, 'id' | 'status' | 'dateTime'>) => {
    try {
      const complaint = await complaintApi.create(newComplaint);
      setComplaints(prev => [complaint, ...prev]);
    } catch (error) {
      console.error('Error creating complaint:', error);
    }
  };

  const handleDeleteComplaint = async (id: string) => {
    try {
      await complaintApi.delete(id);
      setComplaints(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting complaint:', error);
      alert('حدث خطأ أثناء حذف الشكوى. يرجى المحاولة مرة أخرى.');
    }
  };

  // Statistics
  const stats = {
    total: complaints.length,
    open: complaints.filter(c => c.status === 'open').length,
    underInvestigation: complaints.filter(c => c.status === 'under_investigation').length,
    closed: complaints.filter(c => c.status === 'closed').length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <motion.div 
          className="text-center glass rounded-3xl p-12"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-20 h-20 border-4 border-white border-t-transparent rounded-full mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p 
            className="text-white text-xl font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            جاري تحميل البيانات...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0, x: 50 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -50 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  return (
    <motion.div 
      className="min-h-screen" 
      dir="rtl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Header 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
        currentUser={currentUser!}
        onSettingsClick={() => setCurrentPage('settings')}
        onNotificationsClick={() => {
          // Future: Show notifications dropdown
          alert('الإشعارات - سيتم تطوير هذه الميزة قريباً');
        }}
      />
      
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
        
        <main className="flex-1 p-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
          {currentPage === 'dashboard' && (
            <Dashboard 
              complaints={complaints}
              customers={customers}
              spareParts={spareParts}
              systemSettings={systemSettings}
              statistics={statistics}
            />
          )}

          {currentPage === 'complaints' && (
            <>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                      <span className="text-2xl font-bold">{stats.total}</span>
                    </div>
                    <div className="mr-4">
                      <p className="text-sm font-medium text-gray-600">إجمالي الشكاوى</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-red-100 text-red-600">
                      <span className="text-2xl font-bold">{stats.open}</span>
                    </div>
                    <div className="mr-4">
                      <p className="text-sm font-medium text-gray-600">شكاوى مفتوحة</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.open}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                      <span className="text-2xl font-bold">{stats.underInvestigation}</span>
                    </div>
                    <div className="mr-4">
                      <p className="text-sm font-medium text-gray-600">قيد التحقيق</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.underInvestigation}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600">
                      <span className="text-2xl font-bold">{stats.closed}</span>
                    </div>
                    <div className="mr-4">
                      <p className="text-sm font-medium text-gray-600">مُغلقة</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.closed}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Complaint Form */}
              <ComplaintForm
                customers={customers}
                products={products}
                engineers={engineers}
                complaintTypes={complaintTypes}
                onSubmit={handleComplaintSubmit}
              />

              {/* Filter Bar */}
              <FilterBar
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />

              {/* Complaints List */}
              <div className="space-y-6">
                {filteredComplaints.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500">
                      <p className="text-lg font-medium">لا توجد شكاوى مطابقة للفلتر المحدد</p>
                      <p className="text-sm mt-2">جرب تغيير معايير البحث أو الفلتر</p>
                    </div>
                  </div>
                ) : (
                  filteredComplaints.map(complaint => (
                    <ComplaintCard
                      key={complaint.id}
                      complaint={complaint}
                      onStatusChange={handleStatusChange}
                      onRepair={handleRepairClick}
                      onDelete={handleDeleteComplaint}
                    />
                  ))
                )}
              </div>
            </>
          )}

          {currentPage === 'customers' && (
            <CustomersPage
              customers={customers}
              onAddCustomer={handleAddCustomer}
              onUpdateCustomer={handleUpdateCustomer}
              onDeleteCustomer={handleDeleteCustomer}
            />
          )}

          {currentPage === 'engineers' && (
            <EngineersPage
              engineers={engineers}
              onAddEngineer={handleAddEngineer}
              onUpdateEngineer={handleUpdateEngineer}
              onDeleteEngineer={handleDeleteEngineer}
            />
          )}

          {currentPage === 'warehouse' && (
            <WarehousePage
              spareParts={spareParts}
              lowStockThreshold={systemSettings.low_stock_threshold || 10}
              onAddSparePart={handleAddSparePart}
              onUpdateSparePart={handleUpdateSparePart}
              onDeleteSparePart={handleDeleteSparePart}
              onUpdateQuantity={handleUpdateQuantity}
            />
          )}

          {currentPage === 'reports' && (
            <ReportsPage
              complaints={complaints}
              customers={customers}
              spareParts={spareParts}
              statistics={statistics}
              systemSettings={systemSettings}
            />
          )}

          {currentPage === 'settings' && (
            <SettingsPage
              currentUser={currentUser!}
              systemSettings={systemSettings}
              onUpdateUser={handleUpdateUser}
              onUpdateSettings={handleUpdateSettings}
            />
          )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Repair Modal */}
        <RepairModal
          isOpen={repairModalOpen}
          onClose={() => setRepairModalOpen(false)}
          onSubmit={handleRepairSubmit}
          availableSpareParts={spareParts}
        />
      </div>
    </motion.div>
  );
}

export default App;