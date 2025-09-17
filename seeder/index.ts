/**
 * P2P Lending Platform Seeder
 *
 * Main seeder file that orchestrates seeding of all services:
 * - User Service (users, roles, user-roles)
 * - Auth Service (user authentication, audit logs)
 * - Loan Service (loans with various statuses)
 * - Investment Service (investments and returns)
 */

import {
  disconnectAllClients,
  healthCheckAllDatabases,
} from './prisma-clients';
import { clearUserAuths, seedUserAuths } from './services/auth-seeder';
import {
  clearInvestments,
  seedInvestments,
} from './services/investment-seeder';
import { clearLoans, seedLoans } from './services/loan-seeder';
import { clearUsers, seedUsers } from './services/user-seeder';

interface SeederOptions {
  clear?: boolean;
  users?: boolean;
  auth?: boolean;
  loans?: boolean;
  investments?: boolean;
  all?: boolean;
}

class P2PSeeder {
  private options: SeederOptions;

  constructor(options: SeederOptions = {}) {
    this.options = {
      clear: false,
      users: true,
      auth: true,
      loans: true,
      investments: true,
      all: false,
      ...options,
    };
  }

  async run(): Promise<void> {
    console.log('🚀 Starting P2P Lending Platform Seeder');
    console.log('=====================================');

    try {
      // Health check all databases
      console.log('🔍 Checking database connections...');
      const healthCheck = await healthCheckAllDatabases();

      const failedConnections = Object.entries(healthCheck)
        .filter(([, isConnected]) => !isConnected)
        .map(([service]) => service);

      if (failedConnections.length > 0) {
        console.error(
          `❌ Failed to connect to: ${failedConnections.join(', ')}`,
        );
        console.error(
          'Please ensure all databases are running and accessible.',
        );
        process.exit(1);
      }

      console.log('✅ All database connections successful');

      // Clear data if requested
      if (this.options.clear || this.options.all) {
        console.log('\n🧹 Clearing existing data...');
        await this.clearAllData();
      }

      // Seed data based on options
      if (this.options.all || this.options.users) {
        console.log('\n👥 Seeding users...');
        await seedUsers();
      }

      if (this.options.all || this.options.auth) {
        console.log('\n🔐 Seeding authentication data...');
        await seedUserAuths();
      }

      if (this.options.all || this.options.loans) {
        console.log('\n💰 Seeding loans...');
        await seedLoans();
      }

      if (this.options.all || this.options.investments) {
        console.log('\n📈 Seeding investments...');
        await seedInvestments();
      }

      console.log('\n🎉 Seeding completed successfully!');
      console.log('\n📊 Summary:');
      console.log('- Users: 6 (Admin, Borrowers, Lenders, Moderator)');
      console.log('- Roles: 4 (Admin, Borrower, Lender, Moderator)');
      console.log('- User Auth: 6 authentication records');
      console.log('- Loans: 8 (various purposes and statuses)');
      console.log('- Investments: 12 (active, completed, pending)');
      console.log('\n🔑 Default Login Credentials:');
      console.log('Admin: admin@p2plending.com / Admin123!');
      console.log('Borrower: john.borrower@example.com / Borrower123!');
      console.log('Lender: jane.lender@example.com / Lender123!');
      console.log('Moderator: mike.moderator@example.com / Moderator123!');
    } catch (error) {
      console.error('\n❌ Seeding failed:', error);
      process.exit(1);
    } finally {
      await disconnectAllClients();
    }
  }

  private async clearAllData(): Promise<void> {
    const clearPromises = [
      clearUsers(),
      clearUserAuths(),
      clearLoans(),
      clearInvestments(),
    ];

    await Promise.all(clearPromises);
  }
}

// CLI argument parsing
function parseArguments(): SeederOptions {
  const args = process.argv.slice(2);
  const options: SeederOptions = {};

  for (const arg of args) {
    switch (arg) {
      case '--clear':
        options.clear = true;
        break;
      case '--users-only':
        options.users = true;
        options.auth = false;
        options.loans = false;
        options.investments = false;
        break;
      case '--auth-only':
        options.users = false;
        options.auth = true;
        options.loans = false;
        options.investments = false;
        break;
      case '--loans-only':
        options.users = false;
        options.auth = false;
        options.loans = true;
        options.investments = false;
        break;
      case '--investments-only':
        options.users = false;
        options.auth = false;
        options.loans = false;
        options.investments = true;
        break;
      case '--all':
        options.all = true;
        break;
      case '--help':
        console.log(`
P2P Lending Platform Seeder

Usage: ts-node seeder/index.ts [options]

Options:
  --clear              Clear all existing data before seeding
  --users-only         Seed only user service data
  --auth-only          Seed only auth service data
  --loans-only         Seed only loan service data
  --investments-only   Seed only investment service data
  --all                Seed all services (default)
  --help               Show this help message

Examples:
  ts-node seeder/index.ts                    # Seed all services
  ts-node seeder/index.ts --clear            # Clear and seed all services
  ts-node seeder/index.ts --users-only       # Seed only users
  ts-node seeder/index.ts --loans-only --clear # Clear and seed only loans
        `);
        process.exit(0);
        break;
    }
  }

  return options;
}

// Main execution
if (require.main === module) {
  const options = parseArguments();
  const seeder = new P2PSeeder(options);
  seeder.run().catch(console.error);
}

export { P2PSeeder, SeederOptions };
