export interface Customer {
  id: string;
  name: string;
  branch: string;
  phone: string;
}

export interface Product {
  brand: string;
  type: string;
  model: string;
  serial: string;
}

export interface Engineer {
  id: string;
  name: string;
  specialization: string;
}

export interface SparePart {
  id: string;
  name: string;
  warehouse: string;
  quantity: number;
  code: string;
}

export interface RepairDetails {
  repairType: 'with_spare_parts' | 'without_spare_parts';
  spareParts?: SparePart[];
  notes: string;
}

export type ComplaintType = 'warranty' | 'comprehensive_contract' | 'non_comprehensive_contract' | 'out_of_warranty';
export type ComplaintStatus = 'open' | 'under_investigation' | 'closed';

export interface Complaint {
  id: string;
  customer: Customer;
  description: string;
  assignedEngineer?: Engineer;
  dateTime: string;
  type: ComplaintType;
  product: Product;
  status: ComplaintStatus;
  repairDetails?: RepairDetails;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'admin' | 'engineer' | 'complaints_only';
  permissions: {
    viewAllWarehouses: boolean;
    manageComplaints: boolean;
  };
}