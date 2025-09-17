// One-time script to clean up sample data from the database
// Run this once with: node cleanup-sample-data.js

import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const sql = neon(process.env.VITE_DATABASE_URL);

async function cleanupSampleData() {
  try {
    console.log('🧹 Cleaning up sample data...');
    
    // Delete sample engineers (these are the ones that were auto-inserted)
    const deletedEngineers = await sql`
      DELETE FROM engineers 
      WHERE name IN ('محمد الأحمد', 'عبدالله الخالد', 'سعد المطيري', 'ناصر العلي')
      RETURNING name
    `;
    
    // Delete sample spare parts (these are the ones that were auto-inserted)
    const deletedParts = await sql`
      DELETE FROM spare_parts 
      WHERE code IN ('AF-001', 'COM-002', 'IF-003', 'ECB-004', 'DH-005', 'FM-006')
      RETURNING name, code
    `;
    
    console.log(`✅ Deleted ${deletedEngineers.length} sample engineers`);
    console.log(`✅ Deleted ${deletedParts.length} sample spare parts`);
    console.log('🎉 Sample data cleanup completed successfully!');
    console.log('');
    console.log('Now you can:');
    console.log('1. Add your own engineers through the المهندسين page');
    console.log('2. Add your own spare parts through the المخازن page');
    console.log('3. The sample data will not be re-inserted on app restart');
    
  } catch (error) {
    console.error('❌ Error cleaning up sample data:', error);
  }
}

// Run the cleanup
cleanupSampleData();