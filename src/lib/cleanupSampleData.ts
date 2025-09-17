import { sql } from './database';

export async function cleanupSampleData() {
  try {
    console.log('Cleaning up sample data...');
    
    // Delete sample engineers (these are the ones that were auto-inserted)
    await sql`
      DELETE FROM engineers 
      WHERE name IN ('محمد الأحمد', 'عبدالله الخالد', 'سعد المطيري', 'ناصر العلي')
    `;
    
    // Delete sample spare parts (these are the ones that were auto-inserted)
    await sql`
      DELETE FROM spare_parts 
      WHERE code IN ('AF-001', 'COM-002', 'IF-003', 'ECB-004', 'DH-005', 'FM-006')
    `;
    
    console.log('Sample data cleanup completed successfully');
  } catch (error) {
    console.error('Error cleaning up sample data:', error);
    throw error;
  }
}