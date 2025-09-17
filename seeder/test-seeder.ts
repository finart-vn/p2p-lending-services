#!/usr/bin/env ts-node

/**
 * Test script to verify seeder functionality
 * This script tests the seeder without actually running it
 */

import { healthCheckAllDatabases } from './prisma-clients';

async function testSeeder() {
  console.log('🧪 Testing P2P Lending Platform Seeder');
  console.log('=====================================');

  try {
    // Test database connections
    console.log('🔍 Testing database connections...');
    const healthCheck = await healthCheckAllDatabases();

    console.log('Database Health Check Results:');
    console.log(
      `- User Service: ${healthCheck.user ? '✅ Connected' : '❌ Failed'}`,
    );
    console.log(
      `- Auth Service: ${healthCheck.auth ? '✅ Connected' : '❌ Failed'}`,
    );
    console.log(
      `- Loan Service: ${healthCheck.loan ? '✅ Connected' : '❌ Failed'}`,
    );
    console.log(
      `- Investment Service: ${healthCheck.investment ? '✅ Connected' : '❌ Failed'}`,
    );

    const allConnected = Object.values(healthCheck).every((status) => status);

    if (allConnected) {
      console.log('\n🎉 All database connections successful!');
      console.log('✅ Seeder is ready to run');
      console.log('\nTo run the seeder:');
      console.log('  npm run seed          # Seed all services');
      console.log('  npm run seed:clear    # Clear and seed all services');
      console.log('  npm run seed:users    # Seed only users');
    } else {
      console.log('\n❌ Some database connections failed');
      console.log(
        'Please check your database URLs and ensure databases are running',
      );
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  testSeeder().catch(console.error);
}
