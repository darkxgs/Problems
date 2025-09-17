import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { ComplaintType, Customer, Product, Engineer, Complaint } from '../types';

interface ComplaintFormProps {
  customers: Customer[];
  products: Product[];
  engineers: Engineer[];
  complaintTypes: Array<{key: string, label: string}>;
  onSubmit: (complaint: Omit<Complaint, 'id' | 'status' | 'dateTime'>) => void;
}

const ComplaintForm: React.FC<ComplaintFormProps> = ({ customers, products, engineers, complaintTypes, onSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    productId: '',
    description: '',
    engineerId: '',
    type: 'warranty' as ComplaintType,
    // Customer fields for new customer
    newCustomerName: '',
    newCustomerBranch: '',
    newCustomerPhone: '',
    // Product fields for new product
    newProductBrand: '',
    newProductType: '',
    newProductModel: '',
    newProductSerial: '',
    isNewCustomer: false,
    isNewProduct: false
  });

  // Use dynamic complaint types from props

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!window.confirm('هل أنت متأكد من تسجيل هذه الشكوى؟')) {
      return;
    }
    
    // Prepare customer data
    let customer: Customer;
    if (formData.isNewCustomer) {
      customer = {
        id: Date.now().toString(),
        name: formData.newCustomerName,
        branch: formData.newCustomerBranch,
        phone: formData.newCustomerPhone
      };
    } else {
      customer = customers.find(c => c.id === formData.customerId)!;
    }

    // Prepare product data
    let product: Product;
    if (formData.isNewProduct) {
      product = {
        brand: formData.newProductBrand,
        type: formData.newProductType,
        model: formData.newProductModel,
        serial: formData.newProductSerial
      };
    } else {
      product = products.find(p => p.brand === formData.productId)!;
    }

    // Prepare engineer data
    const assignedEngineer = formData.engineerId 
      ? engineers.find(e => e.id === formData.engineerId)
      : undefined;

    const complaint = {
      customer,
      product,
      description: formData.description,
      assignedEngineer,
      type: formData.type
    };

    onSubmit(complaint);
    setIsOpen(false);
    
    // Reset form
    setFormData({
      customerId: '',
      productId: '',
      description: '',
      engineerId: '',
      type: 'warranty',
      newCustomerName: '',
      newCustomerBranch: '',
      newCustomerPhone: '',
      newProductBrand: '',
      newProductType: '',
      newProductModel: '',
      newProductSerial: '',
      isNewCustomer: false,
      isNewProduct: false
    });
  };

  if (!isOpen) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
          <Plus className="h-5 w-5 ml-2" />
          تسجيل شكوى جديدة
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">تسجيل شكوى جديدة</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Section */}
        <div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="isNewCustomer"
              checked={formData.isNewCustomer}
              onChange={(e) => setFormData(prev => ({ ...prev, isNewCustomer: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isNewCustomer" className="mr-2 text-sm font-medium text-gray-700">
              عميل جديد
            </label>
          </div>

          {formData.isNewCustomer ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اسم العميل *</label>
                <input
                  type="text"
                  required
                  value={formData.newCustomerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, newCustomerName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الفرع *</label>
                <input
                  type="text"
                  required
                  value={formData.newCustomerBranch}
                  onChange={(e) => setFormData(prev => ({ ...prev, newCustomerBranch: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف *</label>
                <input
                  type="tel"
                  required
                  value={formData.newCustomerPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, newCustomerPhone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">اختر العميل *</label>
              <select
                required
                value={formData.customerId}
                onChange={(e) => setFormData(prev => ({ ...prev, customerId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">اختر العميل</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.branch}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Product Section */}
        <div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="isNewProduct"
              checked={formData.isNewProduct}
              onChange={(e) => setFormData(prev => ({ ...prev, isNewProduct: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isNewProduct" className="mr-2 text-sm font-medium text-gray-700">
              منتج جديد
            </label>
          </div>

          {formData.isNewProduct ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الماركة *</label>
                <input
                  type="text"
                  required
                  value={formData.newProductBrand}
                  onChange={(e) => setFormData(prev => ({ ...prev, newProductBrand: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">النوع *</label>
                <input
                  type="text"
                  required
                  value={formData.newProductType}
                  onChange={(e) => setFormData(prev => ({ ...prev, newProductType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الموديل *</label>
                <input
                  type="text"
                  required
                  value={formData.newProductModel}
                  onChange={(e) => setFormData(prev => ({ ...prev, newProductModel: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">السيريال *</label>
                <input
                  type="text"
                  required
                  value={formData.newProductSerial}
                  onChange={(e) => setFormData(prev => ({ ...prev, newProductSerial: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">اختر المنتج *</label>
              <select
                required
                value={formData.productId}
                onChange={(e) => setFormData(prev => ({ ...prev, productId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">اختر المنتج</option>
                {products.map((product, index) => (
                  <option key={index} value={product.brand}>
                    {product.brand} {product.type} - {product.model}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">وصف الشكوى *</label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="اكتب وصف مفصل للشكوى..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Type and Engineer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">نوع الشكوى *</label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as ComplaintType }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {complaintTypes.map(type => (
                <option key={type.key} value={type.key}>{type.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">المهندس المسؤول</label>
            <select
              value={formData.engineerId}
              onChange={(e) => setFormData(prev => ({ ...prev, engineerId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">اختر المهندس (اختياري)</option>
              {engineers.map(engineer => (
                <option key={engineer.id} value={engineer.id}>
                  {engineer.name} - {engineer.specialization}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-reverse space-x-3">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            تسجيل الشكوى
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComplaintForm;