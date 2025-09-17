# نظام إدارة الشكاوى - Complaint Management System

A comprehensive React-based complaint management system with Neon PostgreSQL database integration, designed for Arabic-speaking users with full RTL support.

## 🌟 Features

### Core Functionality
- **إدارة الشكاوى** - Complete complaint lifecycle management
- **إدارة العملاء** - Customer database with full CRUD operations
- **إدارة المهندسين** - Engineer management with flexible specializations
- **إدارة المخازن** - Spare parts inventory with real-time tracking
- **تتبع الإصلاحات** - Repair tracking with spare parts consumption
- **لوحة التحكم** - Real-time dashboard with statistics
- **التقارير والإحصائيات** - Comprehensive reporting and analytics

### Advanced Features
- **Dynamic Configuration** - All settings configurable through database
- **Real-time Statistics** - Live calculations from actual data
- **Confirmation Dialogs** - Comprehensive confirmation system for all actions
- **Arabic Interface** - Full RTL support with native Arabic text
- **Responsive Design** - Works perfectly on desktop and mobile
- **Data Integrity** - Proper foreign key handling and data validation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Neon PostgreSQL account (free tier available)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/darkxgs/Problems.git
cd Problems
```

2. **Install dependencies:**
```bash
npm install
```

3. **Environment Setup:**
The `.env` file is already configured with the Neon database connection string.

4. **Database Initialization:**
The database tables and initial data will be created automatically when you first run the application.

5. **Run the development server:**
```bash
npm run dev
```

6. **Build for production:**
```bash
npm run build
```

## 🗄️ Database Schema

### Core Tables
- **`customers`** - Customer information and contact details
- **`engineers`** - Engineer profiles with dynamic specializations
- **`products`** - Product catalog with brand, type, model, serial
- **`spare_parts`** - Inventory management with quantity tracking
- **`complaints`** - Complaint tracking with status and assignments
- **`complaint_spare_parts`** - Junction table for repair parts usage
- **`users`** - User management with role-based permissions

### Configuration Tables
- **`system_settings`** - Dynamic system configuration
- **`complaint_types`** - Configurable complaint categories
- **`user_preferences`** - User-specific settings
- **`statistics_cache`** - Performance optimization for reports

## 🛠️ Technologies Used

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for responsive styling
- **Lucide React** for consistent iconography

### Backend & Database
- **Neon PostgreSQL** for reliable cloud database
- **@neondatabase/serverless** for optimized connections
- **SQL** for complex queries and data integrity

### Development Tools
- **ESLint** for code quality
- **TypeScript** for type checking
- **PostCSS** for CSS processing

## 📱 User Interface

### Pages Overview
- **لوحة التحكم (Dashboard)** - Overview with real-time statistics
- **إدارة الشكاوى (Complaints)** - Full complaint management
- **العملاء (Customers)** - Customer database management
- **المهندسين (Engineers)** - Engineer profiles and assignments
- **المخازن (Warehouse)** - Spare parts inventory
- **التقارير (Reports)** - Analytics and reporting
- **الإعدادات (Settings)** - System configuration

### Key Features
- **Arabic RTL Interface** - Native right-to-left layout
- **Responsive Design** - Works on all screen sizes
- **Confirmation Dialogs** - Prevents accidental actions
- **Real-time Updates** - Live data synchronization
- **Search & Filtering** - Advanced data filtering
- **Inline Editing** - Quick data modifications

## 🔧 Configuration

### System Settings
All major settings are configurable through the database:
- Low stock thresholds
- Session timeouts
- File upload limits
- Auto-assignment rules
- Backup settings
- Company information

### User Management
- Role-based access control
- Customizable permissions
- User preferences
- Notification settings

## 📊 Data Management

### Dynamic Features
- **No Hardcoded Data** - All data comes from database
- **Flexible Specializations** - Engineers can have any specialization
- **Configurable Thresholds** - Inventory alerts are customizable
- **Real-time Calculations** - Statistics calculated from live data

### Data Integrity
- **Foreign Key Constraints** - Proper data relationships
- **Cascade Operations** - Safe deletion with cleanup
- **Transaction Safety** - Atomic operations
- **Validation Rules** - Data consistency checks

## 🚦 Getting Started Guide

### First Run
1. Start the application with `npm run dev`
2. The database will be automatically initialized
3. Sample data will be created for testing
4. Access the application at `http://localhost:5173`

### Initial Setup
1. Review system settings in الإعدادات (Settings)
2. Add your engineers in المهندسين (Engineers)
3. Set up your spare parts inventory in المخازن (Warehouse)
4. Add customers in العملاء (Customers)
5. Start managing complaints in إدارة الشكاوى (Complaints)

## 📈 Performance Features

### Optimizations
- **Lazy Loading** - Components loaded on demand
- **Database Indexing** - Optimized query performance
- **Caching Strategy** - Statistics caching for speed
- **Efficient Updates** - Minimal re-renders

### Scalability
- **Cloud Database** - Neon PostgreSQL scales automatically
- **Modular Architecture** - Easy to extend and maintain
- **API Design** - RESTful patterns for future expansion

## 🔒 Security Features

### Data Protection
- **Confirmation Dialogs** - Prevents accidental deletions
- **Input Validation** - Client and server-side validation
- **SQL Injection Protection** - Parameterized queries
- **Error Handling** - Graceful error management

### User Safety
- **Arabic Error Messages** - Clear user communication
- **Undo Prevention** - Warnings before destructive actions
- **Data Backup** - Configurable backup systems

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Standards
- TypeScript for type safety
- ESLint for code quality
- Consistent naming conventions
- Comprehensive error handling
- Arabic language support

## 📝 Documentation

### Available Documentation
- `DYNAMIC_DATA_CHANGES.md` - Dynamic data implementation
- `ENGINEERS_MANAGEMENT.md` - Engineer management system
- `FLEXIBLE_SPECIALIZATIONS.md` - Specialization flexibility
- `CONFIRMATION_DIALOGS_IMPLEMENTATION.md` - Confirmation system
- `COMPLAINT_DELETE_FUNCTIONALITY.md` - Deletion features
- `ENGINEER_DELETION_FIX.md` - Deletion fixes

## 🆘 Support

### Common Issues
- Database connection problems
- Environment variable setup
- Build and deployment issues
- Feature requests and bugs

### Getting Help
- Check the documentation files
- Review the code comments
- Test with sample data
- Contact the development team

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern React and TypeScript
- Powered by Neon PostgreSQL
- Designed for Arabic-speaking users
- Focused on user experience and data integrity

---

**نظام إدارة الشكاوى** - A comprehensive solution for complaint management with Arabic interface and modern technology stack.