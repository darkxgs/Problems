import { sql } from './database';
import { Customer, Engineer, Product, SparePart, Complaint, User, ComplaintStatus, ComplaintType } from '../types';

// Customer API
export const customerApi = {
  async getAll(): Promise<Customer[]> {
    const result = await sql`SELECT * FROM customers ORDER BY created_at DESC`;
    return result.map(row => ({
      id: row.id.toString(),
      name: row.name,
      branch: row.branch,
      phone: row.phone
    }));
  },

  async create(customer: Omit<Customer, 'id'>): Promise<Customer> {
    const result = await sql`
      INSERT INTO customers (name, branch, phone)
      VALUES (${customer.name}, ${customer.branch}, ${customer.phone})
      RETURNING *
    `;
    const row = result[0];
    return {
      id: row.id.toString(),
      name: row.name,
      branch: row.branch,
      phone: row.phone
    };
  },

  async update(id: string, customer: Omit<Customer, 'id'>): Promise<Customer> {
    const result = await sql`
      UPDATE customers 
      SET name = ${customer.name}, branch = ${customer.branch}, phone = ${customer.phone}
      WHERE id = ${parseInt(id)}
      RETURNING *
    `;
    const row = result[0];
    return {
      id: row.id.toString(),
      name: row.name,
      branch: row.branch,
      phone: row.phone
    };
  },

  async delete(id: string): Promise<void> {
    await sql`DELETE FROM customers WHERE id = ${parseInt(id)}`;
  }
};

// Engineer API
export const engineerApi = {
  async getAll(): Promise<Engineer[]> {
    const result = await sql`SELECT * FROM engineers ORDER BY created_at DESC`;
    return result.map(row => ({
      id: row.id.toString(),
      name: row.name,
      specialization: row.specialization
    }));
  },

  async create(engineer: Omit<Engineer, 'id'>): Promise<Engineer> {
    const result = await sql`
      INSERT INTO engineers (name, specialization)
      VALUES (${engineer.name}, ${engineer.specialization})
      RETURNING *
    `;
    const row = result[0];
    return {
      id: row.id.toString(),
      name: row.name,
      specialization: row.specialization
    };
  },

  async update(id: string, engineer: Omit<Engineer, 'id'>): Promise<Engineer> {
    const result = await sql`
      UPDATE engineers 
      SET name = ${engineer.name}, specialization = ${engineer.specialization}
      WHERE id = ${parseInt(id)}
      RETURNING *
    `;
    const row = result[0];
    return {
      id: row.id.toString(),
      name: row.name,
      specialization: row.specialization
    };
  },

  async delete(id: string): Promise<void> {
    // First, unassign the engineer from all complaints
    await sql`
      UPDATE complaints 
      SET engineer_id = NULL 
      WHERE engineer_id = ${parseInt(id)}
    `;

    // Then delete the engineer
    await sql`DELETE FROM engineers WHERE id = ${parseInt(id)}`;
  },

  async getById(id: string): Promise<Engineer | null> {
    const result = await sql`SELECT * FROM engineers WHERE id = ${parseInt(id)} LIMIT 1`;
    if (result.length === 0) return null;

    const row = result[0];
    return {
      id: row.id.toString(),
      name: row.name,
      specialization: row.specialization
    };
  }
};

// Product API
export const productApi = {
  async getAll(): Promise<Product[]> {
    const result = await sql`SELECT * FROM products ORDER BY created_at DESC`;
    return result.map(row => ({
      brand: row.brand,
      type: row.type,
      model: row.model,
      serial: row.serial
    }));
  },

  async create(product: Product): Promise<Product> {
    await sql`
      INSERT INTO products (brand, type, model, serial)
      VALUES (${product.brand}, ${product.type}, ${product.model}, ${product.serial})
    `;
    return product;
  }
};

// Spare Parts API
export const sparePartApi = {
  async getAll(): Promise<SparePart[]> {
    const result = await sql`SELECT * FROM spare_parts ORDER BY created_at DESC`;
    return result.map(row => ({
      id: row.id.toString(),
      name: row.name,
      warehouse: row.warehouse,
      quantity: row.quantity,
      code: row.code
    }));
  },

  async create(sparePart: Omit<SparePart, 'id'>): Promise<SparePart> {
    const result = await sql`
      INSERT INTO spare_parts (name, warehouse, quantity, code)
      VALUES (${sparePart.name}, ${sparePart.warehouse}, ${sparePart.quantity}, ${sparePart.code})
      RETURNING *
    `;
    const row = result[0];
    return {
      id: row.id.toString(),
      name: row.name,
      warehouse: row.warehouse,
      quantity: row.quantity,
      code: row.code
    };
  },

  async update(id: string, sparePart: Omit<SparePart, 'id'>): Promise<SparePart> {
    const result = await sql`
      UPDATE spare_parts 
      SET name = ${sparePart.name}, warehouse = ${sparePart.warehouse}, 
          quantity = ${sparePart.quantity}, code = ${sparePart.code}
      WHERE id = ${parseInt(id)}
      RETURNING *
    `;
    const row = result[0];
    return {
      id: row.id.toString(),
      name: row.name,
      warehouse: row.warehouse,
      quantity: row.quantity,
      code: row.code
    };
  },

  async updateQuantity(id: string, quantity: number): Promise<void> {
    await sql`
      UPDATE spare_parts 
      SET quantity = ${quantity}
      WHERE id = ${parseInt(id)}
    `;
  },

  async delete(id: string): Promise<void> {
    await sql`DELETE FROM spare_parts WHERE id = ${parseInt(id)}`;
  }
};

// Complaints API
export const complaintApi = {
  async getAll(): Promise<Complaint[]> {
    const result = await sql`
      SELECT 
        c.id, c.customer_id, c.product_id, c.engineer_id, c.description, 
        c.type as complaint_type, c.status, c.repair_type, c.repair_notes, c.created_at,
        cu.name as customer_name, cu.branch as customer_branch, cu.phone as customer_phone,
        p.brand as product_brand, p.type as product_type, p.model as product_model, p.serial as product_serial,
        e.name as engineer_name, e.specialization as engineer_specialization
      FROM complaints c
      LEFT JOIN customers cu ON c.customer_id = cu.id
      LEFT JOIN products p ON c.product_id = p.id
      LEFT JOIN engineers e ON c.engineer_id = e.id
      ORDER BY c.created_at DESC
    `;

    return result.map(row => ({
      id: row.id.toString(),
      customer: {
        id: row.customer_id?.toString() || '',
        name: row.customer_name || '',
        branch: row.customer_branch || '',
        phone: row.customer_phone || ''
      },
      product: {
        brand: row.product_brand || '',
        type: row.product_type || '',
        model: row.product_model || '',
        serial: row.product_serial || ''
      },
      assignedEngineer: row.engineer_id ? {
        id: row.engineer_id.toString(),
        name: row.engineer_name,
        specialization: row.engineer_specialization
      } : undefined,
      description: row.description,
      type: row.complaint_type as ComplaintType,
      status: row.status as ComplaintStatus,
      dateTime: row.created_at,
      repairDetails: row.repair_type ? {
        repairType: row.repair_type,
        notes: row.repair_notes || ''
      } : undefined
    }));
  },

  async create(complaint: Omit<Complaint, 'id' | 'status' | 'dateTime'>): Promise<Complaint> {
    // First, ensure customer and product exist
    let customerId: number;
    let productId: number;

    // Check if customer exists, create if not
    const existingCustomer = await sql`
      SELECT id FROM customers WHERE phone = ${complaint.customer.phone}
    `;

    if (existingCustomer.length > 0) {
      customerId = existingCustomer[0].id;
    } else {
      const newCustomer = await sql`
        INSERT INTO customers (name, branch, phone)
        VALUES (${complaint.customer.name}, ${complaint.customer.branch}, ${complaint.customer.phone})
        RETURNING id
      `;
      customerId = newCustomer[0].id;
    }

    // Check if product exists, create if not
    const existingProduct = await sql`
      SELECT id FROM products WHERE serial = ${complaint.product.serial}
    `;

    if (existingProduct.length > 0) {
      productId = existingProduct[0].id;
    } else {
      const newProduct = await sql`
        INSERT INTO products (brand, type, model, serial)
        VALUES (${complaint.product.brand}, ${complaint.product.type}, ${complaint.product.model}, ${complaint.product.serial})
        RETURNING id
      `;
      productId = newProduct[0].id;
    }

    // Create complaint
    const result = await sql`
      INSERT INTO complaints (customer_id, product_id, engineer_id, description, type, status)
      VALUES (${customerId}, ${productId}, ${complaint.assignedEngineer ? parseInt(complaint.assignedEngineer.id) : null}, ${complaint.description}, ${complaint.type}, 'open')
      RETURNING *
    `;

    const row = result[0];
    return {
      id: row.id.toString(),
      customer: complaint.customer,
      product: complaint.product,
      assignedEngineer: complaint.assignedEngineer,
      description: row.description,
      type: row.type as ComplaintType,
      status: row.status as ComplaintStatus,
      dateTime: row.created_at
    };
  },

  async updateStatus(id: string, status: ComplaintStatus): Promise<void> {
    await sql`
      UPDATE complaints 
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${parseInt(id)}
    `;
  },

  async addRepairDetails(id: string, repairDetails: any): Promise<void> {
    await sql`
      UPDATE complaints 
      SET repair_type = ${repairDetails.repairType}, 
          repair_notes = ${repairDetails.notes},
          status = 'closed',
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${parseInt(id)}
    `;

    // If spare parts were used, record them
    if (repairDetails.repairType === 'with_spare_parts' && repairDetails.spareParts) {
      for (const sparePart of repairDetails.spareParts) {
        await sql`
          INSERT INTO complaint_spare_parts (complaint_id, spare_part_id, quantity_used)
          VALUES (${parseInt(id)}, ${parseInt(sparePart.id)}, 1)
        `;

        // Update spare part quantity
        await sql`
          UPDATE spare_parts 
          SET quantity = quantity - 1
          WHERE id = ${parseInt(sparePart.id)}
        `;
      }
    }
  },

  async delete(id: string): Promise<void> {
    // Delete complaint spare parts first (due to foreign key constraint)
    await sql`DELETE FROM complaint_spare_parts WHERE complaint_id = ${parseInt(id)}`;

    // Then delete the complaint
    await sql`DELETE FROM complaints WHERE id = ${parseInt(id)}`;
  }
};

// User API
export const userApi = {
  async getCurrent(): Promise<User> {
    const result = await sql`SELECT * FROM users WHERE role = 'admin' LIMIT 1`;
    const row = result[0];
    return {
      id: row.id.toString(),
      name: row.name,
      email: row.email,
      phone: row.phone,
      role: row.role,
      permissions: {
        viewAllWarehouses: row.view_all_warehouses,
        manageComplaints: row.manage_complaints
      }
    };
  },

  async update(id: string, userData: Partial<User>): Promise<User> {
    const result = await sql`
      UPDATE users 
      SET name = ${userData.name}, email = ${userData.email}, phone = ${userData.phone}
      WHERE id = ${parseInt(id)}
      RETURNING *
    `;
    const row = result[0];
    return {
      id: row.id.toString(),
      name: row.name,
      email: row.email,
      phone: row.phone,
      role: row.role,
      permissions: {
        viewAllWarehouses: row.view_all_warehouses,
        manageComplaints: row.manage_complaints
      }
    };
  }
};

// System Settings API
export const settingsApi = {
  async getAll(): Promise<Record<string, any>> {
    const result = await sql`SELECT setting_key, setting_value, setting_type FROM system_settings`;
    const settings: Record<string, any> = {};

    result.forEach(row => {
      let value = row.setting_value;
      if (row.setting_type === 'number') {
        value = parseFloat(value);
      } else if (row.setting_type === 'boolean') {
        value = value === 'true';
      }
      settings[row.setting_key] = value;
    });

    return settings;
  },

  async update(key: string, value: any): Promise<void> {
    const stringValue = typeof value === 'boolean' ? value.toString() : value.toString();
    await sql`
      UPDATE system_settings 
      SET setting_value = ${stringValue}, updated_at = CURRENT_TIMESTAMP
      WHERE setting_key = ${key}
    `;
  },

  async getSetting(key: string): Promise<any> {
    const result = await sql`
      SELECT setting_value, setting_type FROM system_settings 
      WHERE setting_key = ${key} LIMIT 1
    `;

    if (result.length === 0) return null;

    const row = result[0];
    let value = row.setting_value;

    if (row.setting_type === 'number') {
      value = parseFloat(value);
    } else if (row.setting_type === 'boolean') {
      value = value === 'true';
    }

    return value;
  }
};

// Complaint Types API
export const complaintTypesApi = {
  async getAll(): Promise<Array<{ key: string, label: string }>> {
    const result = await sql`
      SELECT type_key, type_label FROM complaint_types 
      WHERE is_active = true 
      ORDER BY sort_order
    `;
    return result.map(row => ({
      key: row.type_key,
      label: row.type_label
    }));
  }
};

// Statistics API
export const statisticsApi = {
  async calculateTrends(): Promise<Record<string, number>> {
    // Calculate monthly growth
    const currentMonth = await sql`
      SELECT COUNT(*) as count FROM complaints 
      WHERE created_at >= date_trunc('month', CURRENT_DATE)
    `;

    const lastMonth = await sql`
      SELECT COUNT(*) as count FROM complaints 
      WHERE created_at >= date_trunc('month', CURRENT_DATE - interval '1 month')
      AND created_at < date_trunc('month', CURRENT_DATE)
    `;

    const currentCount = currentMonth[0]?.count || 0;
    const lastCount = lastMonth[0]?.count || 0;
    const monthlyGrowth = lastCount > 0 ? ((currentCount - lastCount) / lastCount) * 100 : 0;

    // Calculate average resolution time
    const resolutionTimes = await sql`
      SELECT AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/86400) as avg_days
      FROM complaints 
      WHERE status = 'closed' AND updated_at IS NOT NULL
    `;

    const avgResolutionDays = resolutionTimes[0]?.avg_days || 0;

    // Calculate customer satisfaction
    const closedComplaints = await sql`
      SELECT COUNT(*) as count FROM complaints WHERE status = 'closed'
    `;
    const totalComplaints = await sql`
      SELECT COUNT(*) as count FROM complaints
    `;
    
    const closedCount = closedComplaints[0]?.count || 0;
    const totalCount = totalComplaints[0]?.count || 1;
    const completionRate = (closedCount / totalCount) * 100;
    
    // Simple satisfaction calculation based on completion rate
    const satisfaction = Math.min(5, Math.max(1, (completionRate / 100) * 5));

    return {
      monthlyGrowth: Math.round(monthlyGrowth * 100) / 100,
      avgResolutionDays: Math.round(avgResolutionDays * 10) / 10,
      customerSatisfaction: Math.round(satisfaction * 10) / 10
    };
  },

  async getCustomerSatisfaction(): Promise<number> {
    // This would typically come from customer feedback
    // For now, return a calculated value based on resolution time and complaint types
    const closedComplaints = await sql`
      SELECT COUNT(*) as count FROM complaints WHERE status = 'closed'
    `;
    const totalComplaints = await sql`
      SELECT COUNT(*) as count FROM complaints
    `;

    const closedCount = closedComplaints[0]?.count || 0;
    const totalCount = totalComplaints[0]?.count || 1;
    const completionRate = (closedCount / totalCount) * 100;

    // Simple satisfaction calculation based on completion rate
    const satisfaction = Math.min(5, Math.max(1, (completionRate / 100) * 5));
    return Math.round(satisfaction * 10) / 10;
  }
};


// User Preferences API
export const userPreferencesApi = {
  async get(userId: string): Promise<Record<string, any>> {
    const result = await sql`
      SELECT preference_key, preference_value FROM user_preferences 
      WHERE user_id = ${parseInt(userId)}
    `;

    const preferences: Record<string, any> = {};
    result.forEach(row => {
      try {
        preferences[row.preference_key] = JSON.parse(row.preference_value);
      } catch {
        preferences[row.preference_key] = row.preference_value;
      }
    });

    return preferences;
  },

  async set(userId: string, key: string, value: any): Promise<void> {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    await sql`
      INSERT INTO user_preferences (user_id, preference_key, preference_value)
      VALUES (${parseInt(userId)}, ${key}, ${stringValue})
      ON CONFLICT (user_id, preference_key)
      DO UPDATE SET preference_value = ${stringValue}, updated_at = CURRENT_TIMESTAMP
    `;
  }
};